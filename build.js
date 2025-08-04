// build.js
const fs = require('fs');
const htmlPath = './dist/index.html'; // 构建后的 HTML 路径

// 读取环境变量
const umamiScript = process.env.UMAMI_SCRIPT;

if (umamiScript) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace(
    '<!-- UMAMI_SCRIPT_PLACEHOLDER -->',
    umamiScript
  );
  fs.writeFileSync(htmlPath, html);
}
