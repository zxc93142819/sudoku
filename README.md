# Sudoku Web App

A web application for solving Sudoku puzzles from images.  
Users can upload a photo of a Sudoku puzzle, the app will recognize the grid, and you can edit or solve it interactively.

## Features

- **Image Upload:** Upload a photo of a Sudoku puzzle.
- **Automatic Recognition:** The app extracts the Sudoku grid and recognizes digits using AI.
- **Manual Correction:** Edit any cell by clicking or using the keyboard.
- **Solve Sudoku:** Get the solution instantly.
- **Responsive UI:** Works on desktop and mobile.

## Getting Started

### Prerequisites

- Python 3.x
- Node.js & npm
- [Anaconda](https://www.anaconda.com/) (recommended for Python dependencies)
- PyTorch (for digit recognition)
- OpenCV, Pillow, Flask, torchvision

### Installation

#### Backend

1. Install Python dependencies:
    ```sh
    conda create -n sudoku python=3.8
    conda activate sudoku
    pip install flask opencv-python pillow torchvision torch
    ```
2. Place your trained model files (`netG`, `netF`) in `backend/model/`.

#### Frontend

1. Go to the frontend directory:
    ```sh
    cd frontend/vue-project
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Build the frontend:
    ```sh
    npm run build
    ```

### Running the App

#### Backend

Start the Flask server:
```sh
python backend/script/app.py
```

#### Frontend (Development)

You can run the frontend in development mode:
```sh
npm run serve
```
Or just use the built files served by Flask.

### Usage

1. Open [http://localhost:3000](http://localhost:3000) in your browser.
2. Upload a Sudoku image.
3. Check and correct the recognized grid if needed.
4. Click "Solve" to get the solution.
5. You can also manually input numbers using your keyboard or the number buttons.

### Keyboard Shortcuts

- Select a cell, then press 1-9 to input a number.
- Press Delete/Backspace to clear a cell.

### Troubleshooting

- If image upload or recognition is slow, check your digit recognition model and optimize `specify.py`.
- Make sure your model files are present and compatible with your PyTorch version.
- For large images, try resizing before upload.

### License

MIT License

---

**Made with Vue.js, Flask, PyTorch, and
