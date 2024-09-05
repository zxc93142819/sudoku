const express = require('express');
const path = require('path')

const app = express();
const PORT = 3000;

const { spawn } = require('child_process');

// 這裡以 example.py 為例
const crop = spawn('python', ['crop.py', ]);  // 傳遞參數
const solve = spawn('python', ['sudoku.py', 'arg1', 'arg2']);  // 傳遞參數

app.use(express.static(path.join(__dirname , '..\\..\\frontend\\sudoku\\dist')));


// router
app.post("/upload" , function(req , res) {
  if (!req.file) {
    console.log(req.data)
    return res.status(400).send('No file uploaded.');
  }
  // 處理完成後返回結果給前端
  res.json({ message: '文件上傳成功！', file: req });
}) ;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
