from flask import Flask, render_template, Response, redirect, url_for, request
from webcam import Webcam
from esp32cam import ESP32Cam 
from datetime import datetime
from detectwithyolo import detect_objects_yolov8
import cv2
import time
from flask_mysqldb import MySQL
import threading
import queue
import concurrent.futures
from firebaserealtime import fetch_data

app = Flask(__name__)
app.secret_key = "flash message"
esp32cam = ESP32Cam('http://172.20.10.6/cam-lo.jpg')  
webcam = Webcam()
flag = 0

RESIZED_WIDTH = 480
RESIZED_HEIGHT = 320

# Configure MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'futurefarm2'

mysql = MySQL(app)

def insert_location_to_database():
    with app.app_context():
        data = fetch_data()
        longitude = data["longitude"]
        latitude = data["latitude"]
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM location WHERE longitude = %s AND latitude = %s", (longitude, latitude))
        existing_location = cur.fetchone()
        if not existing_location:
            cur.execute("INSERT INTO location (longitude, latitude, time) VALUES (%s, %s, %s)", (longitude, latitude, datetime.now()))
            mysql.connection.commit()
        cur.close()

@app.route('/delete/<string:id_data>', methods=['GET'])
def delete(id_data):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM location WHERE id=%s", (int(id_data),))
    mysql.connection.commit()
    return redirect(url_for('airesult'))

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/result")
def airesult():
    try:
        cur = mysql.connection.cursor()
        page = request.args.get('page', 1, type=int)
        per_page = 3  # Number of items per page
        offset = (page - 1) * per_page
        
        cur.execute("SELECT COUNT(*) FROM location")
        total = cur.fetchone()[0]
        
        cur.execute("SELECT * FROM location LIMIT %s OFFSET %s", (per_page, offset))
        data = cur.fetchall()
        cur.close()
        
        total_pages = (total + per_page - 1) // per_page  # Calculate total pages
        
        return render_template("airesult.html", airesult=data, page=page, total_pages=total_pages)
    except Exception as e:
        return render_template("airesult.html", airesult=[], page=1, total_pages=1)

def read_from_webcam():
    while True:
        image = next(webcam.get_frame())
        image = cv2.resize(image, (RESIZED_WIDTH, RESIZED_HEIGHT))
        start_time = time.time()
        image, _ = detect_objects_yolov8(image)
        end_time = time.time()
        print(f"Thời gian chạy của hàm image_feed: {end_time - start_time:.2f} giây")
        _, jpeg = cv2.imencode('.jpg', image)
        frame = jpeg.tobytes()
        yield b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n'

def get_frame():
    return esp32cam.get_frame()

def process_frame(image):
    image, flag = detect_objects_yolov8(image)
    _, jpeg = cv2.imencode('.jpg', image)
    frame = jpeg.tobytes()
    return frame, flag

def read_from_esp32cam():
    frame_queue = queue.Queue(maxsize=1)

    def producer():
        while True:
            image = get_frame()
            if frame_queue.full():
                frame_queue.get()
            frame_queue.put(image)

    def consumer():
        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            while True:
                image = frame_queue.get()
                future = executor.submit(process_frame, image)
                frame, flag = future.result()
                if flag == 1:
                    threading.Thread(target=insert_location_to_database, daemon=True).start()
                yield b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n'

    threading.Thread(target=producer, daemon=True).start()
    return consumer()

@app.route("/image_feed")
def image_feed():
    return Response(read_from_esp32cam(), mimetype="multipart/x-mixed-replace; boundary=frame")

insert_data_thread = threading.Thread(target=insert_location_to_database)
insert_data_thread.daemon = True
insert_data_thread.start()

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False)
