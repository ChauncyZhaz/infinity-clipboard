<template>
  <div id="app">
    <!-- 顶部工具栏 -->
    <Toolbar 
      :search-term="searchTerm"
      @search="handleSearch"
      @clear-all="clearAll"
      @export-data="exportData"
      @import-data="importData"
      @show-help="showHelp"
    />

    <!-- 主画布区域 -->
    <div class="canvas-container">
      <div class="canvas">
        
        <div class="grid" id="clipboardGrid">
          <!-- 空状态 -->
          <div v-if="filteredItems.length === 0" class="empty-state">
            <h2>📋 无限剪贴板</h2>
            <p>还没有任何内容，试试粘贴一些文本、代码或图片吧！</p>
            <p>💡 提示：使用 Ctrl+V 粘贴内容</p>
          </div>

          <!-- 剪贴板项目 -->
          <ClipboardItem
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            @copy="copyToClipboard"
            @delete="deleteItem"
            @change-language="changeLanguage"
            @context-menu="handleContextMenu"
          />
        </div>
      </div>
    </div>

    <!-- 提示框 -->
    <Tooltip :message="tooltipMessage" :visible="tooltipVisible" />

    <!-- 右键菜单 -->
    <ContextMenu 
      v-if="contextMenuVisible"
      :x="contextMenuX"
      :y="contextMenuY"
      :item="contextMenuItem"
      @copy="copyToClipboard"
      @download="downloadImage"
      @open-new-window="openInNewWindow"
      @close="closeContextMenu"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Toolbar from './components/Toolbar.vue'
import ClipboardItem from './components/ClipboardItem.vue'
import Tooltip from './components/Tooltip.vue'
import ContextMenu from './components/ContextMenu.vue'
import { useClipboardStore } from './stores/clipboard'
import { clipboardUtils } from './utils/clipboard'

export default {
  name: 'App',
  components: {
    Toolbar,
    ClipboardItem,
    Tooltip,
    ContextMenu
  },
  setup() {
    const clipboardStore = useClipboardStore()
    
    // 响应式数据
    const searchTerm = ref('')
    const tooltipMessage = ref('')
    const tooltipVisible = ref(false)
    const contextMenuVisible = ref(false)
    const contextMenuX = ref(0)
    const contextMenuY = ref(0)
    const contextMenuItem = ref(null)

    // 健壮的filteredItems
    const filteredItems = computed(() => {
      // 兼容ref和computed返回的items
      let arr = clipboardStore.items
      if (arr && typeof arr === 'object' && 'value' in arr) arr = arr.value
      arr = Array.isArray(arr) ? arr : []
      const validArr = arr.filter(item => item && typeof item === 'object' && 'id' in item)
      if (!searchTerm.value) return validArr
      return validArr.filter(item => {
        const content = (item.content || '').toLowerCase()
        const search = searchTerm.value.toLowerCase()
        return content.includes(search)
      })
    })

    // 方法
    const handleSearch = (term) => {
      searchTerm.value = term
    }

    const copyToClipboard = async (content, type = 'text') => {
      try {
        if (type === 'image') {
          await clipboardUtils.copyImage(content)
          showTooltip('图片已复制到剪贴板！')
        } else {
          await clipboardUtils.copyText(content)
          showTooltip('已复制到剪贴板！')
        }
      } catch (error) {
        console.error('复制失败:', error)
        showTooltip(type === 'image' ? '图片复制失败，请右键保存图片' : '复制失败')
      }
    }

    const deleteItem = (id) => {
      clipboardStore.deleteItem(id)
      showTooltip('项目已删除！')
    }

    const changeLanguage = (id, language) => {
      clipboardStore.changeLanguage(id, language)
    }

    const clearAll = () => {
      if (confirm('确定要清空所有剪贴板内容吗？')) {
        clipboardStore.clearAll()
        showTooltip('所有内容已清空！')
      }
    }

    const exportData = () => {
      clipboardStore.exportData()
      showTooltip('数据已导出！')
    }

    const importData = () => {
      clipboardStore.importData()
      showTooltip('数据已导入！')
    }

    const showHelp = () => {
      const helpText = `
快捷键说明：
• Ctrl+V: 粘贴内容
• Ctrl+F: 跳转到搜索框
• Esc: 清空搜索
• 双击项目: 快速复制内容到剪贴板

功能说明：
• 支持文本、代码、图片粘贴
• 自动检测代码类型
• 本地存储，数据安全
• 搜索功能快速定位
• 支持数据导入导出

图片处理：
• 右键点击图片可复制图片到剪贴板
• 支持保存图片到本地
• 支持在新窗口打开图片
      `
      alert(helpText)
    }

    const showTooltip = (message) => {
      tooltipMessage.value = message
      tooltipVisible.value = true
      setTimeout(() => {
        tooltipVisible.value = false
      }, 2000)
    }

    const handleContextMenu = (event, item) => {
      event.preventDefault()
      contextMenuX.value = event.clientX
      contextMenuY.value = event.clientY
      contextMenuItem.value = item
      contextMenuVisible.value = true
    }

    const closeContextMenu = () => {
      contextMenuVisible.value = false
    }

    const downloadImage = (imageSrc) => {
      clipboardUtils.downloadImage(imageSrc)
      showTooltip('图片已保存！')
    }

    const openInNewWindow = (url) => {
      // 检查是否为 data URL
      if (url.startsWith('data:')) {
        // 创建一个新的 HTML 页面来显示图片
        const newWindow = window.open('', '_blank')
        if (newWindow) {
          const html = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>图片预览</title>
              <style>
                body {
                  margin: 0;
                  padding: 20px;
                  background: #f5f5f5;
                  font-family: Arial, sans-serif;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                }
                .image-container {
                  background: white;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                  text-align: center;
                }
                img {
                  max-width: 100%;
                  max-height: 80vh;
                  height: auto;
                  border-radius: 4px;
                }
                .title {
                  margin-bottom: 15px;
                  color: #333;
                  font-size: 18px;
                  font-weight: bold;
                }
                .info {
                  margin-top: 15px;
                  color: #666;
                  font-size: 14px;
                }
              </style>
            </head>
            <body>
              <div class="image-container">
                <div class="title">图片预览</div>
                <img src="${url}" alt="剪贴板图片" />
                <div class="info">
                  图片来自无限剪贴板<br>
                  时间：${new Date().toLocaleString('zh-CN')}
                </div>
              </div>
            </body>
            </html>
          `
          newWindow.document.open()
          newWindow.document.write(html)
          newWindow.document.close()
        }
      } else {
        // 如果是普通 URL，直接打开
        window.open(url, '_blank')
      }
    }

    // 事件处理
    const handlePaste = (event) => {
      clipboardUtils.handlePaste(event, (item) => {
        clipboardStore.addItem(item)
        showTooltip('内容已添加到剪贴板！')
      })
    }

    const handleKeyboardShortcuts = (event) => {
      if (event.ctrlKey && event.key === 'f') {
        event.preventDefault()
        document.getElementById('searchInput')?.focus()
      }
      if (event.key === 'Escape') {
        searchTerm.value = ''
      }
    }

    // 生命周期
    onMounted(() => {
      document.addEventListener('paste', handlePaste)
      document.addEventListener('keydown', handleKeyboardShortcuts)
      
      // 显示欢迎信息
      let arr = clipboardStore.items
      if (arr && typeof arr === 'object' && 'value' in arr) arr = arr.value
      if (!Array.isArray(arr) || arr.length === 0) {
        showTooltip('欢迎使用无限剪贴板！按 Ctrl+V 开始粘贴内容')
      }
    })

    onUnmounted(() => {
      document.removeEventListener('paste', handlePaste)
      document.removeEventListener('keydown', handleKeyboardShortcuts)
    })

    return {
      searchTerm,
      filteredItems,
      tooltipMessage,
      tooltipVisible,
      contextMenuVisible,
      contextMenuX,
      contextMenuY,
      contextMenuItem,
      handleSearch,
      copyToClipboard,
      deleteItem,
      changeLanguage,
      clearAll,
      exportData,
      importData,
      showHelp,
      handleContextMenu,
      closeContextMenu,
      downloadImage,
      openInNewWindow
    }
  }
}
</script>

<style scoped>
#app {
  height: 100vh;
  overflow: hidden;
}

.canvas-container {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  background: #ecf0f1;
}

.canvas {
  position: relative;
  min-width: 100%;
  min-height: 100%;
  padding: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;  
  min-height: 600px;
  color: #666;
  text-align: center;
  grid-column: 1 / -1; 
}

.empty-state h2 {
  margin-bottom: 10px;
  color: #333;
}

.empty-state p {
  margin-bottom: 20px;
}
</style> 