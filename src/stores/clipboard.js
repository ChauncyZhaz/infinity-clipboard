import { ref, computed } from 'vue'

// 剪贴板状态管理
const items = ref([])
let nextId = 1

// 从本地存储加载数据
function loadData() {
  try {
    const savedData = localStorage.getItem('infinityClipboardData')
    const savedNextId = localStorage.getItem('infinityClipboardNextId')
    
    if (savedData) {
      items.value = JSON.parse(savedData)
    }
    
    if (savedNextId) {
      nextId = parseInt(savedNextId)
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    items.value = []
    nextId = 1
  }
}

// 保存数据到本地存储
function saveData() {
  try {
    localStorage.setItem('infinityClipboardData', JSON.stringify(items.value))
    localStorage.setItem('infinityClipboardNextId', nextId.toString())
  } catch (error) {
    console.error('保存数据失败:', error)
  }
}

// 添加项目
function addItem(item) {
  item.id = nextId++
  items.value.unshift(item)
  saveData()
}

// 删除项目
function deleteItem(id) {
  items.value = items.value.filter(item => item.id !== id)
  saveData()
}

// 清空所有项目
function clearAll() {
  items.value = []
  nextId = 1
  saveData()
}

// 改变代码语言
function changeLanguage(id, language) {
  const item = items.value.find(item => item.id === id)
  if (item) {
    item.language = language
    saveData()
  }
}

// 导出数据
function exportData() {
  const data = JSON.stringify(items.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `clipboard-data-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// 导入数据
function importData() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = function(event) {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = function(e) {
        try {
          const importedData = JSON.parse(e.target.result)
          items.value = importedData
          nextId = Math.max(...items.value.map(item => item.id), 0) + 1
          saveData()
        } catch (error) {
          alert('导入失败：文件格式不正确')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

// 初始化
loadData()

export function useClipboardStore() {
  return {
    items: computed(() => items.value || []),
    addItem,
    deleteItem,
    clearAll,
    changeLanguage,
    exportData,
    importData
  }
} 