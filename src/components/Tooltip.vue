<template>
  <div v-if="visible" class="tooltip">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'Tooltip',
  props: {
    message: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.tooltip {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #333;
  color: white;
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 14px;
  z-index: 1001;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  animation: fadeInOut 2s ease-in-out;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
  20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
}
</style> 