<template>
  <div class="clipboard-item" @dblclick="handleItemClick">
    <div class="item-header">
      <span class="item-type">{{ getTypeIcon(item.type) }} {{ item.type }}</span>
      <div class="item-actions">
        <button class="action-btn" @click.stop="$emit('copy', item.content, item.type)" title="复制到剪贴板">📋</button>
        <button class="action-btn" @click.stop="$emit('delete', item.id)" title="删除">🗑️</button>
      </div>
    </div>
    
    <div class="item-content">
      <!-- 图片内容 -->
      <div v-if="item.type === 'image'" class="image-content">
        <img 
          :src="item.content" 
          alt="粘贴的图片" 
          title="右键点击图片查看更多选项"
          @contextmenu="handleImageContextMenu"
        >
        <div class="image-tip">
          💡 提示：双击可快速复制
        </div>
      </div>
      
      <!-- 代码内容 -->
      <div v-else-if="item.type === 'code'" class="code-content">
        <pre><code>{{ item.content }}</code></pre>
        <select class="language-selector" @change="handleLanguageChange">
          <option value="text" :selected="item.language === 'text'">文本</option>
          <option value="javascript" :selected="item.language === 'javascript'">JavaScript</option>
          <option value="python" :selected="item.language === 'python'">Python</option>
          <option value="java" :selected="item.language === 'java'">Java</option>
          <option value="html" :selected="item.language === 'html'">HTML</option>
          <option value="css" :selected="item.language === 'css'">CSS</option>
        </select>
      </div>
      
      <!-- 文本内容 -->
      <div v-else class="text-content">
        {{ item.content }}
      </div>
    </div>
    
    <div class="item-timestamp">
      {{ formatTimestamp(item.timestamp) }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClipboardItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['copy', 'delete', 'change-language', 'context-menu'],
  methods: {
    getTypeIcon(type) {
      const icons = {
        'text': '📝',
        'code': '💻',
        'image': '🖼️'
      }
      return icons[type] || '📄'
    },
    
    formatTimestamp(timestamp) {
      return new Date(timestamp).toLocaleString('zh-CN')
    },
    
    handleItemClick() {
      this.$emit('copy', this.item.content, this.item.type)
    },
    
    handleLanguageChange(event) {
      this.$emit('change-language', this.item.id, event.target.value)
    },
    
    handleImageContextMenu(event) {
      this.$emit('context-menu', event, this.item)
    }
  }
}
</script>

<style scoped>
.clipboard-item {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: all 0.3s;
  position: relative;
  min-height: 100px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.clipboard-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.item-type {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: bold;
}

.item-actions {
  display: flex;
  gap: 5px;
}

.action-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  background: #f8f9fa;
  color: #666;
}

.action-btn:hover {
  background: #e9ecef;
}

.item-content {
  word-wrap: break-word;
  flex: 1;
}

.text-content {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

.code-content {
  background: #f8f9fa;
  border-radius: 4px;
  padding: 10px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.4;
  overflow-x: auto;
  position: relative;
}

.code-content pre {
  margin: 0;
  white-space: pre-wrap;
}

.code-content code {
  font-family: inherit;
}

.language-selector {
  position: absolute;
  top: 5px;
  right: 5px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px;
  font-size: 12px;
}

.image-content {
  position: relative;
}

.image-content img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  cursor: pointer;
}

.image-content img:hover {
  opacity: 0.8;
}

.image-tip {
  font-size: 11px;
  color: #666;
  margin-top: auto;
  padding-top: 5px;
}

.item-timestamp {
  font-size: 11px;
  color: #999;
  margin-top: auto;
  padding-top: 5px;
}
</style>