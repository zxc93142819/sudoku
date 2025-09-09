import os
import uuid
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import subprocess
import json

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max-limit

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def serve_vue_app():
    return send_from_directory('../../frontend/vue-project/dist', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('../../frontend/vue-project/dist', path)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    
    if file:
        filename = secure_filename(file.filename)
        uid = request.form.get('uid', str(uuid.uuid4()))
        ext = os.path.splitext(filename)[1]
        new_filename = f"{uid}{ext}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
        file.save(file_path)

        print(f"File saved to {file_path}")

        # Run Python script for image processing
        try:
            result = subprocess.run(['python', './backend/script/crop.py', file_path], 
                                    capture_output=True, text=True, check=True, timeout=60)
            print("crop.py output:", result.stdout)
            solved_sudoku = json.loads(result.stdout)
            return jsonify({'data': solved_sudoku, 'message': '分析成功'})
        except subprocess.CalledProcessError as e:
            return jsonify({'message': '解決失敗', 'error': str(e)}), 500

@app.route('/solve', methods=['POST'])
def solve_sudoku():
    sudoku_map = request.json.get('map')
    if not sudoku_map:
        return jsonify({'message': 'No map provided'}), 400

    sudoku_grid = [sudoku_map[i:i+9] for i in range(0, 81, 9)]
    sudoku_json = json.dumps(sudoku_grid)

    # Run Python script for solving Sudoku
    print("Running sudoku.py with input:", sudoku_json)

    try:
        result = subprocess.run(['python', './backend/script/sudoku.py', sudoku_json], 
                                capture_output=True, text=True, check=True)
        solved_sudoku = json.loads(result.stdout)
        if not solved_sudoku:  # 空陣列代表無解
            return jsonify({'data': [], 'message': '此數獨無解'}), 200
        return jsonify({'data': solved_sudoku, 'message': '解決成功'})
    except subprocess.CalledProcessError as e:
        print("subprocess error:", e)
        return jsonify({'message': '解決失敗', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)