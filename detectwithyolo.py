# import cv2 
# from ultralytics import YOLO 
# import cvzone 
# import pandas as pd

# my_file = open("labelsyolo.txt", "r")
# model = YOLO('last.pt')
# data = my_file.read() 
# class_list = data.split("\n")

# def detect_objects_yolov8(img):
#     results = model.predict(img)
#     a = results[0].boxes.data 
#     px = pd.DataFrame(a).astype("float") 
#     object_classes = []
#     for row in px.iterrows():
#         x1=int(row[0]) 
#         y1=int(row[1]) 
#         x2=int(row[2]) 
#         y2=int(row[3])
#         d=int(row[5])
#         obj_class = class_list[d] 
#         object_classes.append(obj_class)
#         cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 255), 2) 
#         cvzone.putTextRect(img, f'{obj_class}', (x2, y2), 1, 1)
#     return img 

# import cv2 
# from ultralytics import YOLO 
# import cvzone 
# import pandas as pd

# my_file = open("labelsyolo.txt", "r")
# model = YOLO('last.pt')
# data = my_file.read() 
# class_list = data.split("\n")

# def detect_objects_yolov8(img):
#     results = model.predict(img)
#     a = results[0].boxes.data 
#     px = pd.DataFrame(a).astype("float") 
#     object_classes = []
#     for row in px.iterrows():
#         x1=int(row[0]) 
#         y1=int(row[1]) 
#         x2=int(row[2]) 
#         y2=int(row[3])
#         d=int(row[5])
#         obj_class = class_list[d] 
#         object_classes.append(obj_class)
#         # if obj_class == "yellow leaves":
#         #     flag = 1
#         cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 255), 2) 
#         cvzone.putTextRect(img, f'{obj_class}', (x2, y2), 1, 1)
#     return img

import cv2
from ultralytics import YOLO
import cvzone
import pandas as pd
import time

# Load the model
model = YOLO('best.pt')

# Load class names
with open("labelsyolo.txt", "r") as my_file:
    class_list = my_file.read().split("\n")

def detect_objects_yolov8(img):
    # Predict with the model
    start_time = time.time()
    results = model.predict(img)
    end_time = time.time()
    print("Thời gian chạy của hàm predict: {} giây".format(end_time - start_time))

    # Extract data from results
    boxes = results[0].boxes.data.cpu().numpy()  # Ensure the data is in numpy array format and on the CPU
    px = pd.DataFrame(boxes).astype("float")
    flag = 0
    # Iterate through detected objects
    for index, row in px.iterrows():
        x1 = int(row[0])
        y1 = int(row[1])
        x2 = int(row[2])
        y2 = int(row[3])
        d = int(row[5])
        obj_class = class_list[d]
        if obj_class == "yellow leaves":
            # Draw rectangle and label on the image
            cv2.rectangle(img, (x1, y1), (x2, y2), (233, 218, 4), 2)
            flag = 1
        elif obj_class == "pets leaves":
            cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 0), 2)
            flag = 1
        else:
            cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 255), 2)
            flag = 0
        cvzone.putTextRect(img, f'{obj_class}', (x2, y2), scale=1, thickness=1)

    return img, flag

