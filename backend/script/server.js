const express = require('express');
const path = require('path')
const multer = require('multer')
const app = express();
const PORT = 3000;

const { spawn } = require('child_process');

// 這裡以 example.py 為例
const crop = spawn('python', ['crop.py', ]);  // 傳遞參數
const solve = spawn('python', ['sudoku.py', 'arg1', 'arg2']);  // 傳遞參數

app.use(express.static(path.join(__dirname , '..\\..\\frontend\\sudoku\\dist')));


// 配置 multer 存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // 确保这个目录存在
  },
  filename: function (req, file, cb) {
    console.log(req)
    cb(null, req.body.uid + path.extname(file.originalname))
    // cb(null, req.body.uid)
  }
});
const upload = multer({ storage: storage });
// router
app.post("/upload" , upload.single('file') , (req , res) => {
  // console.log(req)
  if (!req.file) {
    return res.status(200).send('accept but no file');
  }
  // 處理完成後返回結果給前端
  console.log(req.body.uid)
  
  // TODO : 要送進python檔裡辨識
  res.json({ message: '文件上傳成功！'});
}) ;


app.post("/solve" , upload.none , (req , res) => {
  arrayData = JSON.parse(req.body.map)
  // console.log(arrayData)
  if (!req.body.map) {
    return res.status(200).send('accept but no file');
  }
  // 處理完成後返回結果給前端
  
  // TODO : 要送進python檔裡辨識
  res.json({ message: '資料已進來！'});
}) ;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
