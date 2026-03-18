import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // 项目根目录
  root: 'src',
  
  // 基础路径
  base: './',
  
  // 构建配置
  build: {
    // 输出目录
    outDir: '../dist',
    
    // 清空输出目录
    emptyOutDir: true,
    
    // 资源目录
    assetsDir: 'assets',
    
    // 源代码映射
    sourcemap: true,
    
    // 压缩选项
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
      },
    },
    
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          // 将UE通信核心代码单独打包
          'ue-core': [
            'js/core/ue-communicator.js',
          ],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.').pop();
          let folder = 'assets';
          
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
            folder = 'media';
          } else if (/\.(png|jpe?g|gif|svg|ico|webp)(\?.*)?$/i.test(assetInfo.name)) {
            folder = 'images';
          } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
            folder = 'fonts';
          } else if (/\.css$/i.test(assetInfo.name)) {
            folder = 'css';
          }
          
          return `${folder}/[name]-[hash].[ext]`;
        },
      },
    },
  },
  
  // 开发服务器配置
  server: {
    // 端口
    port: 5173,
    
    // 主机
    host: 'localhost',
    
    // 严格端口
    strictPort: true,
    
    // 代理配置（如果需要）
    proxy: {
      // '/api': {
      //   target: 'http://localhost:3000',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ''),
      // },
    },
  },
  
  // 解析配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/js/core'),
      '@utils': path.resolve(__dirname, 'src/js/utils'),
      '@components': path.resolve(__dirname, 'src/js/components'),
    },
  },
  
  // 插件配置
  plugins: [
    // 可以在这里添加插件
  ],
  
  // 优化配置
  optimizeDeps: {
    include: [
      // 预构建依赖
    ],
  },
  
  // CSS配置
  css: {
    // 启用CSS模块化
    modules: false,
    
    // PostCSS配置
    postcss: './postcss.config.js',
  },
  
  // 预览配置
  preview: {
    port: 4173,
    host: 'localhost',
  },
});
