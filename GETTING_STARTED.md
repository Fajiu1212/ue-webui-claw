# UE5.5 WebUI 前端项目 - 快速开始

## 项目完成概览

✅ **已完成所有开发任务**

### 已交付成果

1. **测试页面** (`src/pages/test.html`)
   - 居中的Test按钮
   - 完整的通信日志系统
   - 实时状态监控
   - 美观的UI设计

2. **通信核心** (`src/js/core/ue-communicator.js`)
   - 标准化的UE通信接口
   - Promise-based API
   - 自动超时处理
   - 完善的错误处理

3. **项目文档**
   - [README.md](./README.md) - 项目概览和技术栈
   - [架构设计](./docs/architecture.md) - 详细的架构设计文档
   - [UE集成指南](./docs/ue-integration.md) - 完整的蓝图集成教程

4. **开发环境配置**
   - package.json - 完整的项目配置
   - vite.config.js - 现代化的构建工具

## 快速开始步骤

### 1. 查看测试页面

直接用浏览器打开：
```
g:\Claw_Project\Claw_WebUI\src\pages\test.html
```

### 2. 启动开发服务器（可选）

如果需要进行开发和调试：

```bash
# 安装依赖（首次运行）
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173/pages/test.html
```

### 3. 构建生产版本

```bash
# 构建项目
npm run build

# 预览构建结果
npm run preview
```

## 测试页面功能

### 按钮功能

点击**Test按钮**会：
1. 发送测试消息到UE
2. 显示发送的数据
3. 记录通信日志
4. 更新统计数据

### 显示信息

- **连接状态**: 检测UE接口是否可用
- **消息发送**: 已发送消息数量
- **消息接收**: 已接收消息数量
- **最后通信**: 最新通信时间
- **通信日志**: 详细的通信记录

## 与UE集成步骤

### 前置条件

- Unreal Engine 5.5+
- WebUI插件已安装

### 集成流程

1. **创建Widget Blueprint**
   - 新建User Interface → Widget Blueprint
   - 命名为 `WB_WebInterface`

2. **添加Web Interface组件**
   - 拖拽到Canvas Panel
   - 设置为全屏

3. **配置URL**
   - 指向test.html文件路径
   - 例如: `file:///G:/Claw_Project/Claw_WebUI/src/pages/test.html`

4. **处理消息**
   - 绑定OnInterfaceEvent事件
   - 处理"OnTestButtonClicked"事件
   - 调用Call节点响应前端

详细步骤参见：[UE集成指南](./docs/ue-integration.md)

## 项目结构

```
Claw_WebUI/
├── src/
│   ├── js/
│   │   └── core/
│   │       └── ue-communicator.js    # UE通信核心
│   └── pages/
│       └── test.html                 # 测试页面
├── docs/
│   ├── architecture.md               # 架构设计
│   └── ue-integration.md             # UE集成指南
├── package.json                      # 项目配置
├── vite.config.js                    # 构建配置
└── README.md                         # 项目说明
```

## 核心特性

### 通信接口

#### 前端发送消息到UE

```javascript
// 使用全局ue4函数
ue4('OnTestButtonClicked', {
    message: '测试消息',
    timestamp: Date.now()
});

// 或使用完整接口
window.ue.interface.broadcast('OnTestButtonClicked', data);
```

#### UE响应前端

在蓝图中：
```
Call (Function: "onTestResponse")
Data: { "success": true, "message": "响应消息" }
```

#### 前端接收UE消息

```javascript
// 注册接收函数
window.ue.interface.onTestResponse = function(data) {
    const parsed = JSON.parse(data);
    console.log('收到UE响应:', parsed);
};
```

### 错误处理

```javascript
// 通信失败处理
window.ue.interface.broadcast = function(eventName, data) {
    try {
        if (typeof eventName !== 'string') {
            throw new Error('事件名称必须是字符串');
        }
        // ... 发送逻辑
    } catch (error) {
        console.error('发送失败:', error);
    }
};
```

## 技术栈

- **HTML5**: 现代Web标准
- **CSS3**: Flexbox, Grid, CSS变量
- **JavaScript ES6+**: 模块化、异步编程
- **Vite**: 快速构建工具
- **ESLint**: 代码规范
- **Prettier**: 代码格式化

## 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 性能优化

- **代码压缩**: 生产环境自动压缩
- **资源优化**: 图片、字体优化
- **缓存策略**: 合理的缓存配置
- **代码分割**: 按需加载

## 调试技巧

### 前端调试

在浏览器中打开开发者工具：
- **Console**: 查看日志和错误
- **Network**: 监控网络请求
- **Elements**: 检查DOM结构

### UE调试

在蓝图中：
- 使用Print String输出调试信息
- 添加断点进行调试
- 查看输出日志

## 常见问题

### Q1: 按钮点击没反应？

**A**: 
1. 检查浏览器控制台是否有错误
2. 确认ue4函数是否定义
3. 验证UE接口是否可用

### Q2: UE收不到消息？

**A**:
1. 检查OnInterfaceEvent是否绑定
2. 确认事件名称是否匹配
3. 验证WebUI插件是否启用

### Q3: 前端收不到UE响应？

**A**:
1. 检查前端函数是否全局定义
2. 确认函数名称是否正确
3. 验证JSON格式是否有效

详细问题排查参见：[UE集成指南](./docs/ue-integration.md)

## 后续扩展

### 可添加的功能

1. **更多测试功能**
   - 文件上传测试
   - 二进制数据传输
   - 实时数据流

2. **UI组件库**
   - 按钮组件
   - 表单组件
   - 数据展示组件

3. **开发工具**
   - 通信监控面板
   - 性能分析工具
   - 自动化测试

### 集成示例

```javascript
// 示例：发送玩家位置
ue4('UpdatePlayerPosition', {
    playerId: 1,
    position: { x: 100, y: 200, z: 50 },
    rotation: { pitch: 0, yaw: 90, roll: 0 }
});

// 示例：接收游戏状态
window.ue.interface.onGameStateUpdate = function(data) {
    const state = JSON.parse(data);
    updateUI(state);
};
```

## 文档索引

- **项目说明**: [README.md](./README.md)
- **架构设计**: [docs/architecture.md](./docs/architecture.md)
- **UE集成**: [docs/ue-integration.md](./docs/ue-integration.md)
- **测试页面**: [src/pages/test.html](./src/pages/test.html)
- **通信核心**: [src/js/core/ue-communicator.js](./src/js/core/ue-communicator.js)

## 许可证

MIT License - 可商业使用

## 支持

如有问题：
1. 查看文档
2. 检查浏览器控制台
3. 查看UE输出日志
4. 提交Issue

---

**项目已完成，所有功能均可使用！**
