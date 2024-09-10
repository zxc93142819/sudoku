const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = 3000;
const fs = require('fs')

const { spawn } = require('child_process');

// 這裡以 example.py 為例
const crop = spawn('python', ['crop.py', ]);  // 傳遞參數
const solve = spawn('python', ['sudoku.py', 'arg1', 'arg2']);  // 傳遞參數

app.use(express.static(path.join(__dirname , '..\\..\\frontend\\sudoku\\dist')));








// upload image
function uploadFile(req) {
  // 配置 multer 存储
  // storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, 'uploads/') // 确保这个目录存在
  //   },
  //   filename: function (req, file, cb) {
  //     console.log(req)
  //     cb(null, req.body.uid + path.extname(file.originalname))
  //     // cb(null, req.body.uid)
  //   }
  // }) ;
  // const upload = multer({ storage: storage });
  console.log(req)
}

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // 确保这个目录存在
  },
  filename: function (req, file, cb) {
    // 先利用uuid當作檔名，稍後再進行改檔名
    const crypto = require("crypto");
    let uuid = crypto.randomUUID();
    cb(null, uuid + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

app.post("/upload" , upload.single('file') , (req , res) => {
  // 此時req裡面才有我要的檔案與uid
  console.log(req)
  if (!req.file) {
    return res.status(200).send('accept but no file');
  }
  var uid = req.body.uid
  var ext = path.extname(req.file.originalname)
  var old_file_name = req.file.filename
  var new_file_name = uid + ext
  fs.rename("uploads/" + old_file_name , "uploads/" + new_file_name , function(err){
    if(err) {
      console.log("改名失敗")
    }
  }) ;
  
  // TODO : 要送進python檔裡辨識
  res.json({ message: '文件上傳成功！'});
}) ;

// router
// app.post("/upload" , (req , res) => {
//   console.log(req)
//   var file = req.file
//   var uid = req.body.uid

//   // fs.writeFile('../../uploads/' + uid + path.extname(file.originalname) , JSON.stringify(file) , function (error) {
//   //   if (error) {
//   //     console.log('文件寫入失敗')
//   //   } else {
//   //     console.log('寫入成功')
//   //   }
//   // })

//   // file.mv('../../uploads/' + uid + path.extname(file.originalname) , (err) => {
//   //   if (err) {
//   //     console.log('文件寫入失敗')
//   //   } else {
//   //     console.log('寫入成功')
//   //   }
//   // }) ;

//   // console.log(req)
//   if (!req.file) {
//     return res.status(200).send('accept but no file');
//   }
//   // 處理完成後返回結果給前端
//   // console.log(req.body.uid)
  
//   // TODO : 要送進python檔裡辨識
//   res.json({ message: '文件上傳成功！'});
// }) ;



// solve
app.post("/solve" , (req , res) => {
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
