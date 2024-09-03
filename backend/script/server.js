const express = require('express');
const path = require('path')

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname , '..\\..\\frontend\\sudoku\\dist')));

// // 簡單的API路由
// app.get('/api/message', (req, res) => {
//   res.json({ message: 'Hello from the server!' });
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
