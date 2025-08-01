<template>
  <div class="context-menu" :style="menuStyle" @click.stop>
    <div 
      v-for="menuItem in menuItems" 
      :key="menuItem.text"
      class="menu-item"
      @click="handleMenuItemClick(menuItem)"
    >
      {{ menuItem.text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContextMenu',
  props: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    item: {
      type: Object,
      default: null
    }
  },
  emits: ['copy', 'download', 'open-new-window', 'close'],
  computed: {
    menuStyle() {
      return {
        top: `${this.y}px`,
        left: `${this.x}px`
      }
    },
    menuItems() {
      if (!this.item || this.item.type !== 'image') {
        return []
      }
      
      return [
        { 
          text: '复制图片到剪贴板', 
          action: () => this.$emit('copy', this.item.content, 'image') 
        },
        { 
          text: '保存图片', 
          action: () => this.$emit('download', this.item.content) 
        },
        { 
          text: '在新窗口打开', 
          action: () => this.$emit('open-new-window', this.item.content) 
        }
      ]
    }
  },
  mounted() {
    // 点击其他地方关闭菜单
    setTimeout(() => {
      document.addEventListener('click', this.closeMenu)
    }, 100)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeMenu)
  },
  methods: {
    handleMenuItemClick(menuItem) {
      menuItem.action()
      this.$emit('close')
    },
    closeMenu() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  z-index: 10000;
  min-width: 150px;
}

.menu-item {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  transition: background-color 0.2s;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: #f5f5f5;
}
</style> 