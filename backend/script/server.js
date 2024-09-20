const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs')
const { spawn } = require('child_process');
// const { PythonShell } = require('python-shell');

// 這裡以 example.py 為例
// const crop = spawn('python', ['crop.py', ]);  // 傳遞參數
// 

app.use(express.static(path.join(__dirname , '..\\..\\frontend\\sudoku\\dist')));
app.use(express.json());

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

// 上傳圖片與辨識
app.post("/upload" , upload.single('file') , (req , res) => {
  // 此時req裡面才有我要的檔案與uid
  console.log(req)
  if (!req.file) {
    return res.status(200).send('accept but no file');
  }
  var uid = req.body.uid
  var ext = path.extname(req.file.originalname)
  var old_file_name = "uploads/" + req.file.filename
  var new_file_name = "uploads/" + uid + ext
  fs.rename(old_file_name , new_file_name , function(err){
    if(err) {
      console.log("改名失敗")
    }
  }) ;

  // 辨識
  const pythonProcess = spawn('python', [path.join(__dirname , 'crop.py') , new_file_name]);  // 傳遞參數
  // 接收 Python 腳本的輸出
  let dataToSend = '';

  // 當有數據從標準輸出（stdout）來時，將其附加到 dataToSend
  pythonProcess.stdout.on('data', (data) => {
    // console.log(JSON.parse(data))
    dataToSend += data.toString();
  });

  // 當 Python 腳本執行完畢並關閉時，返回結果給客戶端
  pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
    if (code === 0) {
      try {
        const solvedSudoku = JSON.parse(dataToSend); // 解析從 Python 腳本返回的 JSON 字符串
        res.json({ data: solvedSudoku , message: "分析成功" }); // 返回解決後的數獨
      } catch (err) {
        res.status(200).send('Error parsing Python script output.');
      }
    } else {
      res.status(200).send('解決失敗');
    }
  });

  // 處理標準錯誤輸出（stderr）
  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
}) ;

// 單純解數獨
app.post("/solve" , (req , res) => {
  map = req.body.map
  if (!req.body.map) {
    return res.status(200).send('accept but no map');
  }
  
  var sudokuGrid = [];
  for (let i = 0; i < 9; i++) {
    sudokuGrid.push(map.slice(i * 9, i * 9 + 9));
  }
  // console.log(sudokuGrid)
  
  // 將數獨數組轉換為 JSON 字符串
  const sudokuJson = JSON.stringify(sudokuGrid);

  const pythonProcess = spawn('python', [path.join(__dirname , 'sudoku.py') , sudokuJson]);  // 傳遞參數
  // 接收 Python 腳本的輸出
  let dataToSend = '';

  // 當有數據從標準輸出（stdout）來時，將其附加到 dataToSend
  pythonProcess.stdout.on('data', (data) => {
    // console.log(JSON.parse(data))
    dataToSend += data.toString();
  });

  // 當 Python 腳本執行完畢並關閉時，返回結果給客戶端
  pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
    if (code === 0) {
      try {
        const solvedSudoku = JSON.parse(dataToSend); // 解析從 Python 腳本返回的 JSON 字符串
        res.json({ data: solvedSudoku , message: "解決成功" }); // 返回解決後的數獨
      } catch (err) {
        res.status(200).send('Error parsing Python script output.');
      }
    } else {
      res.status(200).send('解決失敗');
    }
  });

  // 處理標準錯誤輸出（stderr）
  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
}) ;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
