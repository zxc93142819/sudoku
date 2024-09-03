<template>
  <div class="grid-container">
    <button 
      v-for="(cell, index) in grid" 
      :key="index" 
      class="grid-item" 
      @click="handleClick(index)">
      {{ cell }}
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      grid: Array(9).fill('')  // 建立一個包含 9 個空字串的陣列
    };
  },
  methods: {
    handleClick(index) {
      // 在這裡處理按鈕點擊事件
      this.grid[index] = `Clicked ${index + 1}`;
    }
  }
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 100px); /* 3 列，每列寬度 100px */
  grid-template-rows: repeat(3, 100px);    /* 3 行，每行高度 100px */
  gap: 0px; /* 每個格子之間的間距 */
  justify-content: center;
  align-items: center;
}

.grid-item {
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
</style>
