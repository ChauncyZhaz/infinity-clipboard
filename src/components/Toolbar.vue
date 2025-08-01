<template>
  <div class="toolbar">
    <h1>📋 无限剪贴板</h1>
    
    <div class="search-container">
      <input 
        type="text" 
        class="search-input" 
        placeholder="搜索剪贴板内容..." 
        :value="searchTerm"
        @input="handleSearchInput"
        id="searchInput"
      >
    </div>
    
    <div class="toolbar-buttons">
      <button class="btn btn-primary" @click="$emit('clear-all')">清空全部</button>
      <button class="btn btn-secondary" @click="$emit('export-data')">导出数据</button>
      <button class="btn btn-secondary" @click="$emit('import-data')">导入数据</button>
      <button class="btn btn-secondary" @click="$emit('show-help')" title="使用帮助">❓</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toolbar',
  props: {
    searchTerm: {
      type: String,
      default: ''
    }
  },
  emits: ['search', 'clear-all', 'export-data', 'import-data', 'show-help'],
  methods: {
    handleSearchInput(event) {
      this.$emit('search', event.target.value)
    }
  }
}
</script>

<style scoped>
.toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #2c3e50;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.toolbar h1 {
  font-size: 18px;
  margin-right: 30px;
}

.search-container {
  flex: 1;
  max-width: 400px;
  margin: 0 20px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 20px;
  background: #34495e;
  color: white;
  font-size: 14px;
}

.search-input::placeholder {
  color: #bdc3c7;
}

.toolbar-buttons {
  display: flex;
  margin-left: auto;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

@media (max-width: 768px) {
  .toolbar {
    padding: 0 10px;
  }
  
  .toolbar h1 {
    font-size: 16px;
    margin-right: 15px;
  }
  
  .search-container {
    margin: 0 10px;
  }
}
</style> 