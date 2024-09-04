<template>
  <div id="app" class="container">
    <!-- 上傳照片按鈕 -->
    <div class="my-4">
      <h2 style = "text-align: center;">{{uuid}}</h2>
      <h2 style = "text-align: center;">上傳照片</h2>
      <input type="file" @change="onFileChange" class="form-control-file" style="align-items: center;"/>
      <div v-if="imageUrl" class="mt-3">
        <img :src="imageUrl" alt="Uploaded Image" class="img-thumbnail" />
        <button @click="uploadFile" class="btn btn-primary mt-2">上傳</button>
      </div>
    </div>

    <div class="my-4">
      <h2 style = "text-align: center;">九宮格數獨畫面</h2>
      <div class="sudoku-container">
        <button 
          v-for="(space, spaceindex) in sudoku" 
          :key="spaceindex" 
          class="sudoku-item" 
          @click="gridClick(spaceindex)">
          {{ space }}
        </button>
      </div>
    </div>

    <div class="my-4">
      <h2 style = "text-align: center;">按鈕</h2>
      <div class="number-container">
        <button 
          v-for="(num, numindex) in number" 
          :key="numindex" 
          class="number-item" 
          @click="numberClick(numindex)">
          {{ num }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid' ;

export default {
  data() {
    return {
      uuid: uuidv4(),
      imageUrl: null,  // 上傳圖片的URL
      selectedFile: null,  // 用於存儲選擇的文件
      number: Array(9).fill(''),  // 建立一個包含 9 個空字串的陣列
      sudoku: Array(81).fill('')  // 建立一個包含 81 個空字串的陣列
    };
  },
  methods: {
    // 處理文件上傳
    // onFileChange(event) {
    //   const file = event.target.files[0];
    //   if (file) {
    //     this.selectedFile = file;  // 存儲選擇的文件
    //     this.imageUrl = URL.createObjectURL(file);  // 顯示預覽
    //   }
    // },
    // uploadFile() {
    //   if (!this.selectedFile) {
    //     alert("請先選擇文件！");
    //     return;
    //   }

    //   // 創建FormData對象
    //   const formData = new FormData();
    //   formData.append('file', this.selectedFile);

    //   // 使用 fetch 或 axios 將文件上傳到服務器
    //   fetch('/upload', {  // 替換為實際的上傳URL
    //     method: 'POST',
    //     body: formData
    //   })
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log('上傳成功:', data);
    //     alert('上傳成功！');
    //   })
    //   .catch(error => {
    //     console.error('上傳失敗:', error);
    //     alert('上傳失敗，請重試。');
    //   });
    // }

    // onFileChange(event) {
    //   const file = event.target.files[0];
    //   if (file) {
    //     this.imageUrl = URL.createObjectURL(file);
    //   }
    // },

    // 數獨按下事件
    gridClick(index) {
      this.sudoku[index] = `Clicked ${index + 1}`;
    },

    // 數字按下事件
    numberClick(index) {
      this.number[index] = `Clicked ${index + 1}`;
    }
  }
};
</script>

<style scoped>
.sudoku-container {
  display: grid;
  grid-template-columns: repeat(9, 10vw); /* Flexible columns */
  grid-template-rows: repeat(9, 10vw);    /* Flexible rows */
  gap: 0px; /* No spacing between cells */
  justify-content: center;
  align-items: center;
  margin: 0 auto; /* Center the grid */
}

.sudoku-item {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #000; /* Default thin border */
  background-color: #f0f0f0; /* Background color */
  font-size: 2vw; /* Responsive font size */
  height: 10vw;
  width: 10vw;
  cursor: pointer; /* Change cursor to pointer */
}

/* Thicker borders for the 3x3 subgrids */
.sudoku-item:nth-child(3n) { /* Right border for each 3rd cell in a row */
  border-right: 3px solid #000;
}

.sudoku-item:nth-child(9n + 1) { /* Left border for each 3rd cell in a row */
  border-left: 3px solid #000;
}

.sudoku-item:nth-child(73) { /* Right border for each 3rd cell in a row */
  border-bottom: 3px solid #000;
}

.sudoku-item:nth-child(n + 1):nth-child(-n + 9) { /* top border for each 3rd cell in a row */
  border-top: 3px solid #000;
}

.sudoku-item:nth-child(n + 28):nth-child(-n + 36) { /* top border for each 3rd cell in a row */
  border-top: 3px solid #000;
}

.sudoku-item:nth-child(n + 55):nth-child(-n + 63) { /* top border for each 3rd cell in a row */
  border-top: 3px solid #000;
}

.sudoku-item:nth-child(n + 73):nth-child(-n + 81) { /* bottom border for each 3rd cell in a row */
  border-bottom: 3px solid #000;
}


.number-container {
  display: grid;
  grid-template-columns: repeat(3, 100px); /* 3 列，每列寬度 100px */
  grid-template-rows: repeat(3, 100px);    /* 3 行，每行高度 100px */
  gap: 0px; /* 每個格子之間的間距 */
  justify-content: center;
  align-items: center;
}

.number-item {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #000; /* 每個格子的邊框 */
  background-color: #f0f0f0; /* 背景色 */
  font-size: 18px; /* 字體大小 */
  height: 100px;
  width: 100px;
  cursor: pointer; /* 滑鼠變為指針 */
}

.form-control-file {
  align-items: center;
}
</style>
