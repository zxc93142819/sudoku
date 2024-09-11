import cv2
import numpy as np
import os
import pytesseract
from PIL import Image
import time
import specify
import sys
import json

image_path = sys.argv[1]

# Load the new image
# image_path = './image.jpg'
image = cv2.imread(image_path)

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Apply Gaussian Blur to reduce noise
blurred = cv2.GaussianBlur(gray, (5, 5), 0)

# Apply edge detection
edges = cv2.Canny(blurred, 50, 150)

# Find contours
contours, _ = cv2.findContours(edges, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

# Find the contour with the largest area
largest_contour = max(contours, key=cv2.contourArea)

# Approximate the contour to a polygon and check if it has 4 sides
epsilon = 0.02 * cv2.arcLength(largest_contour, True)
approx = cv2.approxPolyDP(largest_contour, epsilon, True)

maxHeight , maxWidth , _ = image.shape
# If the approximated contour has 4 points, assume it is the Sudoku grid
if len(approx) == 4:
    pts = approx.reshape(4, 2)
    rect = np.zeros((4, 2), dtype="float32")

    # Top-left point will have the smallest sum, bottom-right will have the largest sum
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]

    # Top-right point will have the smallest difference, bottom-left will have the largest difference
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]

    # Get the width and height of the new image
    (tl, tr, br, bl) = rect
    widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
    widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
    maxWidth = max(int(widthA), int(widthB))

    heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
    heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
    maxHeight = max(int(heightA), int(heightB))

    dst = np.array([
        [0, 0],
        [maxWidth - 1, 0],
        [maxWidth - 1, maxHeight - 1],
        [0, maxHeight - 1]], dtype="float32")

    M = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))
    cv2.imwrite("./img.png" , warped)
else:
    warped = image.copy()

# Calculate the size of each cell in the warped image
grid_size = 9
cell_width = maxWidth // grid_size
cell_height = maxHeight // grid_size

# Create directory to save the cropped cells
output_dir = './outputs'
os.makedirs(output_dir, exist_ok=True)

# Loop over each cell and save the cropped image
map = []
for i in range(grid_size):
    l = []
    for j in range(grid_size):
        x_start = j * cell_width
        y_start = i * cell_height
        x_end = (j + 1) * cell_width
        y_end = (i + 1) * cell_height

        cell = warped[y_start:y_end, x_start:x_end]

        cut_width = int(cell_width * 0.1)
        cut_height = int(cell_height * 0.1)
        cell = cell[cut_width:cell_width - cut_width , cut_height:cell_height - cut_height]

        # cell = remove_borders(cell)
        # PIL_cell = Image.fromarray(cv2.cvtColor(cell, cv2.COLOR_BGR2RGB))
        # PIL_cell = PIL_cell.convert('L')
        # # cell.show()
        # config = "--psm 10 -c tessedit_char_whitelist=123456789"
        # num = pytesseract.image_to_string(PIL_cell , config=config).strip()
        
        num = specify.recognize(cell)
        l.append(int(num))

        # cell_filename = os.path.join("./outputs" , f'cell_{i}_{j}.png')
        # cv2.imwrite(cell_filename, cell)

    # print(l)
    map.append(l)

# print(map)
data = []
for i in range(9) :
    for j in range(9) :
        data.append(map[i][j])
print(str(json.dumps(data)))
sys.stdout.flush()