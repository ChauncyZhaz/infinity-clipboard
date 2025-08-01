// 检测是否为代码
function detectCode(text) {
  const codePatterns = [
    /function\s+\w+\s*\(/,
    /if\s*\(.*\)\s*{/,
    /for\s*\(.*\)\s*{/,
    /while\s*\(.*\)\s*{/,
    /import\s+.*from/,
    /require\s*\(/,
    /console\.log/,
    /class\s+\w+/,
    /def\s+\w+/,
    /public\s+class/,
    /private\s+\w+/,
    /protected\s+\w+/,
    /<html>/i,
    /<!DOCTYPE/i,
    /<script>/i,
    /<style>/i
  ]
  
  return codePatterns.some(pattern => pattern.test(text))
}

// 检测代码语言
function detectLanguage(text) {
  if (text.includes('function') && text.includes('console.log')) return 'javascript'
  if (text.includes('import') && text.includes('from')) return 'javascript'
  if (text.includes('def ') && text.includes(':')) return 'python'
  if (text.includes('public class') || text.includes('private ')) return 'java'
  if (text.includes('<html>') || text.includes('<!DOCTYPE')) return 'html'
  if (text.includes('<script>')) return 'javascript'
  if (text.includes('<style>')) return 'css'
  if (text.includes('function') && text.includes('{')) return 'javascript'
  return 'text'
}

// 复制文本到剪贴板
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

// 复制图片到剪贴板
async function copyImage(imageSrc) {
  const response = await fetch(imageSrc)
  const blob = await response.blob()
  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob
    })
  ])
}

// 下载图片
function downloadImage(imageSrc) {
  const link = document.createElement('a')
  link.href = imageSrc
  link.download = `clipboard-image-${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 处理粘贴事件
function handlePaste(event, callback) {
  event.preventDefault()
  
  const clipboardData = event.clipboardData
  if (!clipboardData) return

  // 处理图片
  if (clipboardData.files.length > 0) {
    const file = clipboardData.files[0]
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = function(e) {
        callback({
          type: 'image',
          content: e.target.result,
          timestamp: new Date()
        })
      }
      reader.readAsDataURL(file)
      return
    }
  }

  // 处理文本
  const text = clipboardData.getData('text/plain')
  if (text) {
    // 检测是否为代码
    const isCode = detectCode(text)
    callback({
      type: isCode ? 'code' : 'text',
      content: text,
      language: isCode ? detectLanguage(text) : null,
      timestamp: new Date()
    })
  }
}

export const clipboardUtils = {
  detectCode,
  detectLanguage,
  copyText,
  copyImage,
  downloadImage,
  handlePaste
} 