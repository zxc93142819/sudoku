<template>
  <div id="app" class="container">
    <!-- 上傳照片按鈕 -->
    <div class="my-4">
      <h2 style = "text-align: center;">{{uuid}}</h2>
      <h2 style = "text-align: center;">上傳照片</h2>
      <div class="d-grid gap-2 col-6 mx-auto">
        <input type="file" @change="onFileChange" class="form-control-file"/>
      </div>
      <!-- 
      <div v-if="imageUrl" class="mt-3">
        <img :src="imageUrl" alt="Uploaded Image" class="img-thumbnail" />
      </div> 
      -->
    </div>

    <div class="d-grid gap-2 col-6 mx-auto">
      <button @click="uploadFile" class="upload_buttom">上傳</button>
      <button @click="solvesudoku" class="solve_buttom">看解答</button>
    </div>

    <div class="d-grid gap-2 col-6 mx-auto">
      <span style="text-align: center;"> {{ result }} </span>
    </div>

    <div class="my-4">
      <!-- <h2 style = "text-align: center;">數獨畫面</h2> -->
      <div class="sudoku-container">
        <button 
          v-for="(space, spaceindex) in sudoku" 
          :key="spaceindex" 
          class="sudoku-item" 
          @click="gridClick(spaceindex)"
          :style="{ backgroundColor: selectedSpace === spaceindex ? 'gray' : 'white' }"
          >
          {{ space }}
        </button>
      </div>
    </div>

    <div class="d-grid gap-2 col-6 mx-auto">
      <button @click="clear" class="delete_buttom">刪除</button>
    </div>

    <div class="my-4">
      <!-- <h2 style = "text-align: center;">按鈕</h2> -->
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
import axios from 'axios';

export default {
  data() {
    return {
      result: "尚無結果",
      uuid: uuidv4(),
      imageUrl: null,  // 上傳圖片的URL
      selectedFile: null,  // 用於存儲選擇的文件
      selectedSpace: 0 ,
      number: [1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9],  // 建立一個包含 9 個空字串的陣列
      sudoku: Array(81).fill('')  // 建立一個包含 81 個空字串的陣列
    };
  },
  methods: {
    // 處理文件上傳
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;  // 存儲選擇的文件
        this.imageUrl = URL.createObjectURL(file);  // 顯示預覽
      }
    },
    uploadFile() {
      if (!this.selectedFile) {
        alert("請先選擇文件！");
        return;
      }

      const formData = new FormData();

      formData.append('file', this.selectedFile);  // 添加文件
      formData.append('uid', this.uuid);  // 添加 UUID 或其他參數

      // 使用 fetch 或 axios 將文件上傳到服務器
      axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      .then(response => {
        console.log(response);
        var data = response.data.data
        for(let index = 0 ; index < 81 ; index ++) {
          if(data[index] == 0) {
            data[index] = '' ;
          }
        }
        this.sudoku = data;
        alert('請查看數獨解析是否正確，如有錯請自行更改再按下"看解答"，反之按下"看解答"即可');
      })
      .catch(error => {
        console.error('伺服器錯誤:', error);
        alert('伺服器錯誤，請重試。');
      });
    },

    // 數獨按下事件
    gridClick(index) {
      this.selectedSpace = index ;
    },

    // 數字按下事件
    numberClick(index) {
      this.sudoku[this.selectedSpace] = index + 1 ;
    },

    // 數字清空事件
    clear() {
      this.sudoku[this.selectedSpace] = '' ;
    },

    // 送到後端解數獨
    solvesudoku() {
      // 使用 fetch 或 axios 將文件上傳到服務器
      axios.post('/solve', {
          map: this.sudoku
      })
      .then(response => {
        console.log(response);
        this.result = response.data.message
        if(response.data.message == "解決成功") {
          this.sudoku = response.data.data;
          alert('已解決此數獨!');
        }
        else {
          alert('此數獨無解!');
        }
      })
      .catch(error => {
        console.error('伺服器錯誤:', error);
        alert('伺服器錯誤，請重試。');
      });
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
  background-color: #ffffff; /* Background color */
  font-size: 5vw; /* Responsive font size */
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
  grid-template-columns: repeat(3, 30vw); /* 3 列，每列寬度 100px */
  grid-template-rows: repeat(3, 30vw);    /* 3 行，每行高度 100px */
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
  font-size: 15vw; /* 字體大小 */
  height: 30vw;
  width: 30vw;
  cursor: pointer; /* 滑鼠變為指針 */
}

.form-control-file {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* .upload_buttom {
  align-items: center;
  background-color: aqua;
} */

.solve_buttom , .upload_buttom , .delete_buttom {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: aqua;
}

</style>
