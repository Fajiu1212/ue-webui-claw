// 简单的HTTP服务器，用于预览测试页面
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 8081;  // 如果端口被占用，可以修改为其他端口如 8082, 8083 等

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // 默认指向test.html
  let filePath = req.url === '/' ? '/test.html' : req.url;
  filePath = path.join(__dirname, 'src/pages', filePath);
  
  // 获取文件扩展名
  const extname = String(path.extname(filePath)).toLowerCase();
  
  // MIME类型映射
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
  };
  
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  // 读取并返回文件
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // 文件不存在
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404: File Not Found</h1>', 'utf-8');
      } else {
        // 其他错误
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      // 成功返回文件
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, () => {
console.log(`🚀 服务器启动成功！`);
console.log(`📁 服务目录: ${path.join(__dirname, 'src/pages')}`);
console.log(`🌐 访问地址: http://localhost:${port}`);
console.log(`🌐 测试页面: http://localhost:${port}/test.html`);
console.log('');
console.log('按 Ctrl+C 停止服务器');

// 导入child_process
import { exec } from 'child_process';

// 自动打开浏览器
setTimeout(() => {
  const platform = process.platform;
  const url = `http://localhost:${port}/test.html`;
  
  if (platform === 'win32') {
    exec(`start ${url}`);
  } else if (platform === 'darwin') {
    exec(`open ${url}`);
  } else {
    exec(`xdg-open ${url}`);
  }
  console.log(`🌐 正在打开浏览器: ${url}`);
}, 1000);
});

// 错误处理
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ 端口 ${port} 已被占用！`);
    console.error('请尝试使用其他端口或关闭占用该端口的程序。');
    process.exit(1);
  } else {
    console.error('服务器错误:', error);
  }
});

// 优雅退出
process.on('SIGINT', () => {
  console.log('\n👋 正在关闭服务器...');
  server.close(() => {
    console.log('✅ 服务器已关闭');
    process.exit(0);
  });
});
