# UE5.5 WebUI 智慧梁场管控平台

一个为Unreal Engine 5.5 WebUI插件开发的前端项目，实现与UE引擎的双向通信。

## 🌟 项目特色

### 页面功能
- **科技风格导航栏** - 深蓝色背景，蓝色发光边框
- **6个导航按钮** - 左右各3个，水平排列
- **中间大标题** - 瓯越交建洞头厂区智慧梁厂信息化管控平台
- **底部发光线条** - 蓝色发光动画
- **UE5.5双向通信** - 实时消息发送和接收

### 技术栈
- **HTML5** - 现代Web标准
- **CSS3** - Flexbox、动画、渐变
- **JavaScript ES6+** - 模块化、Promise、事件驱动
- **Node.js** - HTTP服务器

## 🚀 快速开始

### 前置要求
- Node.js 16.0+
- Unreal Engine 5.5+
- WebUI插件已安装

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/ue-webui-claw.git
cd ue-webui-claw
```

2. **安装依赖**（可选，用于开发）
```bash
npm install
```

3. **启动服务器**
```bash
# 本机访问
node start-server.js

# 或局域网访问（推荐给同事访问）
node start-server-lan.js
```

4. **访问页面**
- 本机：http://localhost:8081/test.html
- 局域网：http://你的IP:8081/test.html

### Windows用户（一键启动）

双击运行：
- `启动服务器.bat` - 启动局域网服务器
- `发布到局域网.bat` - 带提示的启动器

## 📱 页面功能

### 导航按钮（6个）

**左侧**：
- 项目概况（默认激活）
- 生产信息
- 安全信息

**右侧**：
- 质量信息
- 物资信息
- AI工序识别

### 通信功能

**前端 → UE**：
```javascript
// 点击按钮发送消息
ue4('OnNavButtonClicked', {
    section: 'project-overview',
    sectionName: '项目概况',
    timestamp: Date.now()
});
```

**UE → 前端**：
```javascript
// 在UE蓝图中调用
Call (Function: "onTestResponse")
Data: { "success": true, "message": "Hello from UE!" }
```

## 🔧 与UE集成

### 1. 创建Widget Blueprint
1. 在UE内容浏览器右键 → User Interface → Widget Blueprint
2. 命名为 `WB_WebInterface`

### 2. 添加WebUI组件
1. 打开Widget Blueprint
2. 从Palette拖拽Web Interface到Canvas
3. 设置为全屏（Anchors: 0,0 到 1,1）

### 3. 配置URL
在Web Interface的Details面板中：
- URL: `http://localhost:8081/test.html`
- Enable Transparent: ✅
- Enable Mouse: ✅
- Enable Keyboard: ✅

### 4. 处理事件
在Event Graph中：
```
On Interface Event
    └── Switch on Name
            └── "OnNavButtonClicked"
                └── Parse JSON (Data)
                    └── 处理业务逻辑
```

## 📂 项目结构

```
Claw_WebUI/
├── src/
│   ├── js/
│   │   └── core/
│   │       └── ue-communicator.js    # UE通信核心
│   └── pages/
│       └── test.html                 # 测试页面
├── docs/
│   ├── 预览说明.md                    # 页面说明
│   ├── 最终样式确认.md               # 样式确认
│   ├── 局域网发布指南.md             # 部署指南
│   └── 端口修改说明.md               # 端口说明
├── .gitignore                        # Git忽略文件
├── start-server.js                   # HTTP服务器
├── start-server-lan.js               # 局域网服务器
├── 启动服务器.bat                    # 一键启动脚本
├── package.json                      # 项目配置
└── README.md                         # 项目说明
```

## 🎨 样式特点

### 科技风格导航栏
- 深蓝色背景（#0a0e27 → #0f172a）
- 蓝色发光边框
- 底部蓝色发光线条（脉冲动画）

### 按钮样式
- 半透明背景
- 蓝色边框
- 悬停光泽流动
- 激活状态（蓝到紫渐变）

### 中间标题
- 蓝色发光文字
- 阴影效果

## 🔍 常见问题

### Q: 端口被占用？
**A**: 修改 `start-server-lan.js` 中的 `const port = 8081;`

### Q: 同事无法访问？
**A**: 
1. 检查防火墙（端口8081）
2. 确认同一网络
3. 使用局域网地址

### Q: 如何修改按钮？
**A**: 编辑 `src/pages/test.html` 中的按钮HTML

## 📄 许可证

MIT License - 可用于商业项目

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📞 联系方式

- GitHub Issues: https://github.com/your-username/ue-webui-claw/issues
- 项目文档: docs/

---

**🎉 开始您的UE5.5 WebUI之旅吧！**
