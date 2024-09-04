const express = require('express');
const path = require('path')

const app = express();
const PORT = 3000;

const { spawn } = require('child_process');

// 這裡以 example.py 為例
const crop = spawn('python', ['crop.py', ]);  // 傳遞參數
const solve = spawn('python', ['sudoku.py', 'arg1', 'arg2']);  // 傳遞參數

app.use(express.static(path.join(__dirname , '..\\..\\frontend\\sudoku\\dist')));

// 創建上傳文件的路由
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    res.json({ message: 'File uploaded successfully!', file: req.file });
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
