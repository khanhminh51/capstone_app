import cv2
import numpy as np
import urllib.request
from datetime import datetime
import time

class ESP32Cam:
    def __init__(self, url):
        self.url = url

    def get_frame(self):
        # start_time = time.time()
        img_response = urllib.request.urlopen(self.url)
        # end_time = time.time()
        # print("Thời gian chạy của hàm img_response: {} giây".format(end_time - start_time))
        # start_time = time.time()
        img_array = np.array(bytearray(img_response.read()), dtype=np.uint8)
        # end_time = time.time()
        # print("Thời gian chạy của hàm img_array: {} giây".format(end_time - start_time))
        # start_time = time.time()
        frame = cv2.imdecode(img_array, -1)
        # end_time = time.time()
        # print("Thời gian chạy của hàm frame: {} giây".format(end_time - start_time))
        return frame


        # if frame is not None:
        #     # Overlay current time on the frame
        #     font = cv2.FONT_HERSHEY_SIMPLEX
        #     org = (50, 50)
        #     font_scale = 1
        #     color = (255, 0, 0)
        #     thickness = 2
        #     frame = cv2.putText(frame, datetime.now().strftime("%H:%M:%S"), org, font, font_scale, color, thickness, cv2.LINE_AA)

if __name__ == "__main__":
    url = 'http://172.20.10.6/cam-lo.jpg'  
    esp32cam = ESP32Cam(url)

    while True:
        frame = esp32cam.get_frame()

        if frame is not None:
            cv2.imshow("ESP32-CAM", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cv2.destroyAllWindows()
