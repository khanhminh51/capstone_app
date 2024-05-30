import firebase_admin
from firebase_admin import credentials, db
import time

cred = credentials.Certificate("./key.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://capstone-afdd7-default-rtdb.asia-southeast1.firebasedatabase.app/'
})

# def fetch_data():
#     try:
#         humidity = db.reference("/DHT_11/Humidity").get()
#         temperature = db.reference("/DHT_11/Temperature").get()
#         return {"humidity": humidity, "temperature": temperature}
#     except Exception as e:
#         print("Error fetching data:", e)
#         return None

# while True:
#     data = fetch_data()
#     if data:
#         print("Humidity:", data["humidity"])
#         print("Temperature:", data["temperature"])
#     time.sleep(1)  


def fetch_data():
    longitude = db.reference("/more_data/lng").get()
    latitude = db.reference("/more_data/lat").get()
    longitude /=  1000000;
    latitude /= 1000000;
    return {"longitude": longitude, "latitude": latitude}

