<template>
  <div id="app" class="main-container">
    <div class="background-overlay"></div>
    
    <div class="content-wrapper">
      <!-- 上傳照片區域 -->
      <div class="upload-section">
        <div class="upload-container">
          <input 
            type="file"
            id="file-input"
            @change="onFileChange" 
            accept="image/*"
            class="file-input"
            ref="fileInput"
          />
          <button for="file-input" class="file-label">
            <span class="btn-icon">📷</span>
            選擇照片
          </button>
        </div>
        
        <!-- 預覽圖片 -->
        <div v-if="imageUrl" class="image-preview">
          <img :src="imageUrl" alt="上傳的圖片" class="preview-image" />
        </div>
      </div>

      <!-- 操作按鈕 -->
      <div class="button-group">
        <button @click="uploadFile" class="action-btn upload-btn" :disabled="!selectedFile">
          <span class="btn-icon">⬆️</span>
          上傳解析
        </button>
        <button @click="solvesudoku" class="action-btn solve-btn">
          <span class="btn-icon">🧩</span>
          查看解答
        </button>
      </div>

      <!-- 結果顯示 -->
      <div class="result-display">
        <span class="result-text">{{ result }}</span>
      </div>

      <!-- 數獨網格 -->
      <div class="sudoku-section">
        <div class="sudoku-container">
          <button 
            v-for="(cell, index) in sudoku" 
            :key="index" 
            class="sudoku-cell" 
            :class="{
              'selected': selectedSpace === index,
              'filled': cell !== '',
              'top-border': isTopBorder(index),
              'right-border': isRightBorder(index),
              'bottom-border': isBottomBorder(index),
              'left-border': isLeftBorder(index)
            }"
            @click="selectCell(index)"
          >
            {{ cell }}
          </button>
        </div>
      </div>

      <!-- 數字輸入區 -->
      <div class="input-section">
        <h3 class="section-subtitle">選擇數字</h3>
        <div class="number-grid">
          <button 
            v-for="(num, index) in numbers" 
            :key="index" 
            class="number-btn" 
            @click="inputNumber(num)"
          >
            {{ num }}
          </button>
          <button class="number-btn clear-btn" @click="clearCell">
            <span class="clear-icon">❌</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export default {
  name: 'SudokuApp',
  data() {
    return {
      result: "尚未開始",
      uuid: uuidv4(),
      imageUrl: null,
      selectedFile: null,
      selectedSpace: null,
      numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      sudoku: Array(81).fill(''),
      isLoading: false
    };
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeydown);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeydown);
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }
  },
  methods: {
    // 處理文件選擇
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        // 檢查文件類型
        if (!file.type.startsWith('image/')) {
          alert('請選擇圖片文件！');
          this.resetFileInput();
          return;
        }
        
        // 檢查文件大小 (限制10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert('文件大小不能超過10MB！');
          this.resetFileInput();
          return;
        }
        
        this.selectedFile = file;
        this.imageUrl = URL.createObjectURL(file);
      }
    },

    // 鍵盤事件處理
    handleKeydown(e) {
      if (this.selectedSpace === null) return;
      if (e.key >= '1' && e.key <= '9') {
        this.inputNumber(Number(e.key));
      }
      if (e.key === 'Backspace' || e.key === 'Delete') {
        this.clearCell();
      }
    },

    // 重置文件輸入
    resetFileInput() {
      this.$refs.fileInput.value = '';
      this.selectedFile = null;
      this.imageUrl = null;
    },

    // 上傳文件
    async uploadFile() {
      if (!this.selectedFile) {
        alert("請先選擇文件！");
        return;
      }

      this.isLoading = true;
      this.result = "正在處理中...";

      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('uid', this.uuid);

      try {
        const response = await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 60000 // 60秒超時
        });

        if (response.data && response.data.data) {
          // console.log('上傳成功:', response.data);
          const data = response.data.data.map(cell => cell === 0 ? '' : cell);
          // console.log('解析後的數獨數據:', data); // 除錯用
          this.sudoku = data;
          this.result = "圖片解析完成";
          alert('請檢查數獨解析結果，如有錯誤請手動修正後再按"查看解答"');
        } else {
          throw new Error('服務器返回數據格式錯誤');
        }
      } catch (error) {
        console.error('上傳錯誤:', error);
        this.result = "解析失敗";
        if (error.code === 'ECONNABORTED') {
          alert('請求超時，請重試');
        } else {
          alert('服務器錯誤，請重試');
        }
      } finally {
        this.isLoading = false;
      }
    },

    // 選擇格子
    selectCell(index) {
      this.selectedSpace = index;
    },

    // 輸入數字
    inputNumber(num) {
      console.log('inputNumber called, selectedSpace:', this.selectedSpace); // 除錯用
      if (this.selectedSpace !== null) {
        this.sudoku[this.selectedSpace] = num; // Vue 3 寫法
      } else {
        alert('請先選擇一個格子');
      }
    },

    clearCell() {
      if (this.selectedSpace !== null) {
        this.sudoku[this.selectedSpace] = ''; // Vue 3 寫法
      } else {
        alert('請先選擇一個格子');
      }
    },

    // 解數獨
    solvesudoku() {
      // console.log('求解數獨按鈕點擊');
      // this.isLoading = true;
      // this.result = "正在求解中...";

      // // 模擬求解過程
      // setTimeout(() => {
      //   // 生成一個完整的數獨解答
      //   const solution = [
      //     5, 3, 4, 6, 7, 8, 9, 1, 2,
      //     6, 7, 2, 1, 9, 5, 3, 4, 8,
      //     1, 9, 8, 3, 4, 2, 5, 6, 7,
      //     8, 5, 9, 7, 6, 1, 4, 2, 3,
      //     4, 2, 6, 8, 5, 3, 7, 9, 1,
      //     7, 1, 3, 9, 2, 4, 8, 5, 6,
      //     9, 6, 1, 5, 3, 7, 2, 8, 4,
      //     2, 8, 7, 4, 1, 9, 6, 3, 5,
      //     3, 4, 5, 2, 8, 6, 1, 7, 9
      //   ];
        
      //   this.sudoku = solution;
      //   this.result = "解決成功";
      //   this.isLoading = false;
      //   alert('數獨已成功解決！');
      // }, 1500);

      axios.post('/solve', {
        map: this.sudoku
      }, {
        timeout: 30000
      })
      .then(response => {
        if (response.data) {
          this.result = response.data.message;
          if (response.data.message === "解決成功") {
            this.sudoku = response.data.data;
            alert('數獨已成功解決！');
          } else {
            alert('此數獨無解或數據有誤！');
          }
        }
      })
      .catch(error => {
        console.error('求解錯誤:', error);
        this.result = "求解失敗";
        alert('服務器錯誤，請重試');
      })
      .finally(() => {
        this.isLoading = false;
      });
    },

    // 判斷邊框樣式
    isTopBorder(index) {
      return index < 9 || (index >= 27 && index < 36) || (index >= 54 && index < 63);
    },
    
    isRightBorder(index) {
      return (index + 1) % 9 === 3 || (index + 1) % 9 === 6;
    },
    
    isBottomBorder(index) {
      return (index >= 18 && index < 27) || (index >= 45 && index < 54) || (index >= 72);
    },
    
    isLeftBorder(index) {
      return index % 9 === 0 || index % 9 === 3 || index % 9 === 6;
    }
  },

  // 清理資源
  beforeDestroy() {
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }
  }
};
</script>

<style scoped>
/* 全局樣式 */
.main-container {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 1rem;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.content-wrapper {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

/* 標題樣式 */
.section-title {
  text-align: center;
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.section-subtitle {
  text-align: center;
  color: #4a5568;
  font-size: 1.2rem;
  font-weight: 500;
  margin: 1.5rem 0 1rem 0;
}

/* 上傳區域 */
.upload-section {
  margin-bottom: 2rem;
}

.upload-container {
  position: relative;
  text-align: center;
}

.file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.file-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #4299e1, #3182ce);
  color: white;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.file-label:hover {
  background: linear-gradient(135deg, #3182ce, #2c5aa0);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
}

.upload-icon {
  font-size: 1.2rem;
}

/* 圖片預覽 */
.image-preview {
  margin-top: 1rem;
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 按鈕組 */
.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1.5rem 0;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 50px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  justify-content: center;
}

.upload-btn {
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
}

.upload-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #38a169, #2f855a);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

.upload-btn:disabled {
  background: #cbd5e0;
  color: #a0aec0;
  cursor: not-allowed;
}

.solve-btn {
  background: linear-gradient(135deg, #ed8936, #dd6b20);
  color: white;
}

.solve-btn:hover {
  background: linear-gradient(135deg, #dd6b20, #c05621);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(237, 137, 54, 0.3);
}

/* 結果顯示 */
.result-display {
  text-align: center;
  margin: 1rem 0;
}

.result-text {
  padding: 0.5rem 1rem;
  background: rgba(74, 85, 104, 0.1);
  border-radius: 20px;
  color: #2d3748;
  font-weight: 500;
}

/* 數獨網格 */
.sudoku-section {
  margin: 2rem 0;
}

.sudoku-container {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(9, 1fr);
  gap: 1px;
  background-color: #2d3748;
  border: 3px solid #2d3748;
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 1;
  max-width: 450px;
  margin: 0 auto;
}

.sudoku-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border: none;
  font-size: clamp(1rem, 3vw, 1.5rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  aspect-ratio: 1;
}

.sudoku-cell:hover {
  background-color: #edf2f7;
}

.sudoku-cell.selected {
  background-color: #4299e1 !important;
  color: white;
}

.sudoku-cell.filled {
  background-color: #f7fafc;
  color: #2d3748;
}

/* 3x3網格邊框 */
.sudoku-cell.top-border {
  border-top: 3px solid #2d3748;
}

.sudoku-cell.right-border {
  border-right: 3px solid #2d3748;
}

.sudoku-cell.bottom-border {
  border-bottom: 3px solid #2d3748;
}

.sudoku-cell.left-border {
  border-left: 3px solid #2d3748;
}

/* 數字輸入區 */
.input-section {
  margin: 2rem 0;
}

.number-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  max-width: 300px;
  margin: 0 auto;
}

.number-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1;
  border: 2px solid #e2e8f0;
  background: #fff;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #2d3748;
}

.number-btn:hover {
  background: #4299e1;
  color: white;
  border-color: #4299e1;
  transform: scale(1.05);
}

.clear-btn {
  background: #fed7d7;
  border-color: #feb2b2;
  color: #c53030;
}

.clear-btn:hover {
  background: #fc8181;
  border-color: #fc8181;
  color: white;
}

.clear-icon {
  font-size: 1rem;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 1.5rem;
    margin: 0.5rem;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .section-subtitle {
    font-size: 1.1rem;
  }
  
  .button-group {
    flex-direction: column;
    align-items: center;
  }
  
  .action-btn {
    width: 100%;
    max-width: 250px;
  }
  
  .sudoku-container {
    max-width: 320px;
  }
  
  .number-grid {
    grid-template-columns: repeat(3, 1fr);
    max-width: 250px;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 1rem;
  }
  
  .sudoku-container {
    max-width: 280px;
  }
  
  .number-grid {
    max-width: 200px;
  }
  
  .file-label {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
  
  .action-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}

@media (min-width: 1024px) {
  .content-wrapper {
    padding: 3rem;
  }
  
  .sudoku-container {
    max-width: 500px;
  }
  
  .number-grid {
    max-width: 350px;
  }
}
</style>