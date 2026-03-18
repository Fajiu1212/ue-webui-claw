# UE5.5 WebUI 前端与UE蓝图集成指南

## 概述

本文档详细说明如何将前端WebUI页面与Unreal Engine 5.5的蓝图系统进行集成，实现双向通信。

## 前置条件

### 环境要求

- **Unreal Engine**: 5.5 或更高版本
- **WebUI插件**: 已安装并启用
- **前端文件**: 已构建完成（HTML/CSS/JS）

### 插件安装

#### 方法1：项目级安装（推荐）

1. 在项目根目录创建 `Plugins` 文件夹
2. 将WebUI插件文件复制到 `Plugins` 目录
3. 重新启动UE项目
4. 在编辑器中启用插件

```
YourProject/
├── Content/
├── Plugins/
│   └── WebUI/
│       ├── WebUI.uplugin
│       └── ...
└── YourProject.uproject
```

#### 方法2：引擎级安装

1. 将插件复制到引擎插件目录
2. 路径：`Engine/Plugins/Marketplace/WebUI`
3. 重启UE编辑器

## UE蓝图集成步骤

### 步骤1：创建Widget Blueprint

1. 在内容浏览器中右键
2. 选择 **User Interface → Widget Blueprint**
3. 命名为 `WB_WebInterface`
4. 打开蓝图编辑器

### 步骤2：添加Web Interface组件

1. 在Widget Blueprint编辑器中
2. 打开 **Palette** 面板
3. 搜索 **Web Interface**
4. 拖拽到Canvas Panel中
5. 调整大小为全屏（Anchors: 0,0 到 1,1）

### 步骤3：配置Web Interface

选中Web Interface组件，在 **Details** 面板中配置：

| 参数 | 说明 | 示例值 |
|------|------|--------|
| **URL** | 前端页面地址 | `http://localhost:5173/test.html` |
| **Initial URL** | 初始加载URL | `file:///G:/Claw_Project/Claw_WebUI/src/pages/test.html` |
| **Enable Transparent** | 启用透明背景 | `true` (勾选) |
| **Enable Mouse** | 启用鼠标事件 | `true` (勾选) |
| **Enable Keyboard** | 启用键盘事件 | `true` (勾选) |
| **Support Drag** | 支持拖拽 | `false` |

### 步骤4：配置输入模式

在Widget Blueprint的 **Event Graph** 中：

1. 添加 **Event Construct** 节点
2. 添加 **Set Input Mode UI Only** 节点
3. 连接节点：

```
Event Construct
    └── Set Input Mode UI Only
            └── Widget to Focus (self)
```

### 步骤5：处理前端消息

在Widget Blueprint中添加事件处理：

#### 方式A：使用OnInterfaceEvent事件

1. 选中Web Interface组件
2. 在 **Details** 面板中找到 **Events**
3. 点击 **On Interface Event** 的 **+** 按钮
4. 自动生成事件节点

事件节点结构：

```
On Interface Event
    ├── Name (String) - 事件名称
    └── Data (String) - JSON数据
```

#### 方式B：手动绑定事件（推荐）

在Event Graph中：

```
[Web Interface Reference]
    └── Bind Event to On Interface Event
            └── Event (创建自定义事件)
```

### 步骤6：处理测试按钮事件

#### 处理前端发送的OnTestButtonClicked事件

1. 创建自定义事件 `HandleTestButtonClicked`
2. 添加 **Switch on Name** 节点
3. 配置事件分支：

```
On Interface Event
    └── Switch on Name
            ├── "OnTestButtonClicked" → HandleTestButtonClicked
            ├── "OtherEvent" → HandleOtherEvent
            └── Default (空)
```

4. 在 **HandleTestButtonClicked** 中处理数据：

```
[On Interface Event]
    └── [Data]
            └── Parse JSON
                    └── Get Field (message, timestamp, etc.)
```

### 步骤7：发送消息到前端

在蓝图中调用JavaScript函数：

#### 调用前端函数

1. 获取Web Interface组件引用
2. 添加 **Call** 节点
3. 配置参数：

```
[Web Interface Reference]
    └── Call
            ├── Function (String) - "onTestResponse"
            └── Data (String) - JSON字符串
```

#### 示例：响应测试按钮点击

```
HandleTestButtonClicked
    └── [Build Response Data]
            └── Call (Function: "onTestResponse")
```

### 步骤8：完整蓝图示例

#### 测试按钮处理流程

```
Event Construct
    ├── Set Input Mode UI Only
    └── Initialize Variables

On Interface Event
    └── Switch on Name
            ├── "OnTestButtonClicked"
            │   └── Parse JSON (Data)
            │       ├── Print String (Log)
            │       ├── Process Data
            │       └── Build Response
            │           └── Call "onTestResponse" (Send to Frontend)
            └── Other Events...
```

## 蓝图节点详解

### 常用节点说明

#### 1. Set Input Mode UI Only

**作用**: 设置输入模式为仅UI

**用途**: 确保WebUI可以接收鼠标和键盘输入

**参数**:
- Widget to Focus: 要聚焦的Widget（通常是self）

#### 2. On Interface Event

**作用**: 接收来自前端的消息

**输出**:
- Name: 事件名称（字符串）
- Data: 事件数据（JSON字符串）

#### 3. Call

**作用**: 调用前端JavaScript函数

**输入**:
- Function: 要调用的函数名称（字符串）
- Data: 传递给函数的参数（JSON字符串）

#### 4. Parse JSON

**作用**: 解析JSON字符串

**输入**:
- JSON String: 要解析的JSON字符串

**输出**:
- JSON Object: 解析后的JSON对象

#### 5. To JSON

**作用**: 将对象转换为JSON字符串

**输入**:
- Object: 要转换的对象

**输出**:
- JSON String: JSON字符串

## 实际应用示例

### 示例1：简单响应

#### 前端发送
```javascript
// 前端发送测试消息
ue4('OnTestButtonClicked', {
    message: 'Hello from WebUI',
    timestamp: Date.now()
});
```

#### UE蓝图处理

1. **On Interface Event** 触发
2. **Name** 为 `"OnTestButtonClicked"`
3. **Parse JSON** 解析 **Data**
4. 提取 `message` 和 `timestamp`
5. **Print String** 显示消息
6. **Build Response**:
   ```
   {
       "success": true,
       "response": "Hello from UE5!",
       "received": true
   }
   ```
7. **To JSON** 转换为字符串
8. **Call** 前端函数 `"onTestResponse"`

### 示例2：带数据验证

```
On Interface Event
    └── Switch on Name
            └── "OnTestButtonClicked"
                └── Parse JSON (Data)
                    └── Is Valid
                        ├── True:
                        │   └── Extract Fields
                        │       └── Validate Data
                        │           ├── Valid:
                        │           │   └── Process
                        │           │       └── Send Response (Success)
                        │           └── Invalid:
                        │               └── Send Response (Error)
                        └── False:
                            └── Send Response (Parse Error)
```

### 示例3：异步处理

```
On Interface Event
    └── "OnTestButtonClicked"
        └── Parse JSON
            └── Async Task (Play Animation)
                └── On Complete
                    └── Send Response
```

### 示例4：多事件处理

```
On Interface Event
    └── Switch on Name
            ├── "OnButtonClick"
            │   └── HandleButtonClick
            ├── "OnDataRequest"
            │   └── HandleDataRequest
            ├── "OnConfigUpdate"
            │   └── HandleConfigUpdate
            └── Default
                └── Log Unknown Event
```

## 调试技巧

### 1. 前端调试

#### 打开WebUI控制台
在运行游戏中按：**Shift + Ctrl + I**

#### JavaScript调试
```javascript
// 在浏览器控制台输入
debugger;
console.log('Debug info:', data);
```

### 2. UE蓝图调试

#### 使用Print String
```
[Data Processing]
    └── Print String
            └── Message: "Received: " + Data
```

#### 使用Breakpoint
在蓝图中右键节点 → **Add Breakpoint**

### 3. 日志查看

UE输出日志路径：
```
YourProject/Saved/Logs/YourProject.log
```

### 4. 常见问题排查

#### 问题1：前端无法发送消息

**检查项**:
- WebUI插件是否启用
- URL配置是否正确
- 是否启用透明模式和鼠标事件

**解决方案**:
```
1. 检查插件状态
2. 验证文件路径
3. 检查浏览器控制台错误
```

#### 问题2：UE收不到消息

**检查项**:
- OnInterfaceEvent是否绑定
- 事件名称是否匹配
- JSON格式是否正确

**解决方案**:
```
1. 检查事件绑定
2. 使用Print String输出Name
3. 验证JSON格式
```

#### 问题3：前端收不到UE响应

**检查项**:
- 前端函数是否全局定义
- 函数名称是否正确
- JSON字符串格式是否正确

**解决方案**:
```
1. 确认函数在window下定义
2. 检查函数名称拼写
3. 验证JSON.stringify结果
```

## 性能优化建议

### 1. 消息批量化

```javascript
// 不推荐：频繁发送
for (let i = 0; i < 100; i++) {
    ue4('UpdatePosition', { x: i, y: i });
}

// 推荐：批量发送
ue4('UpdatePositions', {
    positions: Array.from({ length: 100 }, (_, i) => ({ x: i, y: i }))
});
```

### 2. 数据压缩

```javascript
// 发送前压缩大数据
const compressed = LZString.compress(JSON.stringify(largeData));
ue4('LargeData', { compressed: compressed });
```

### 3. 防抖节流

```javascript
// 防抖处理
let debounceTimer;
function sendUpdate(data) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        ue4('Update', data);
    }, 100);
}
```

### 4. 事件清理

```javascript
// 组件销毁时清理
gameplayEnd() {
    // 清理事件监听器
    // 清理定时器
    // 发送结束消息
    ue4('OnGameplayEnd');
}
```

## 高级功能

### 1. 多WebUI实例

创建多个Widget Blueprint，每个加载不同的前端页面：

```
WB_MainUI → http://localhost/main.html
WB_HUD → http://localhost/hud.html
WB_Menu → http://localhost/menu.html
```

### 2. 动态加载URL

在运行时更改URL：

```
Event BeginPlay
    └── Load URL
            └── New URL: "http://" + ServerIP + "/game.html"
```

### 3. JavaScript注入

在加载页面后执行JS代码：

```
Event Construct
    └── Delay (0.5秒)
        └── Execute JavaScript
                └── Code: "window.gameVersion = '1.0.0';"
```

### 4. 双向认证

实现简单的认证机制：

```
// 前端发送认证请求
ue4('Authenticate', { token: 'user-token' });

// UE验证并响应
On Interface Event → "Authenticate"
    └── Validate Token
        └── Call "onAuthResult"
                └── { authenticated: true, user: "Player1" }
```

## 部署建议

### 1. 开发环境

```
前端: http://localhost:5173 (Vite dev server)
UE: 编辑器模式
通信: 实时热更新
```

### 2. 测试环境

```
前端: http://test.example.com
UE: 打包测试版本
通信: 真实网络环境
```

### 3. 生产环境

```
前端: 打包为本地文件
UE: 完整打包
通信: file:// 或本地服务器
```

### 4. 打包配置

将前端文件打包到UE项目中：

```
YourProject/
├── Content/
│   └── WebUI/
│       └── test.html
└── ...
```

蓝图配置：
```
URL: "file:///" + ProjectDir + "Content/WebUI/test.html"
```

## 最佳实践

### ✅ 推荐做法

1. **错误处理**: 始终添加错误处理
2. **数据验证**: 前后端都验证数据
3. **日志记录**: 关键操作添加日志
4. **性能监控**: 关注通信频率
5. **资源清理**: 及时清理资源
6. **版本控制**: 前后端版本匹配

### ❌ 避免做法

1. 不要发送过大消息（>1MB）
2. 不要频繁通信（<16ms间隔）
3. 不要阻塞主线程
4. 不要忽略错误
5. 不要硬编码URL
6. 不要在生产环境开启调试

## 总结

本指南涵盖了UE5.5 WebUI前端与蓝图集成的完整流程，包括：

- 环境配置和插件安装
- Widget Blueprint创建和配置
- 双向通信实现
- 调试技巧和常见问题
- 性能优化和最佳实践
- 高级功能和部署建议

按照本指南操作，可以快速实现前端与UE5.5的可靠通信。

## 参考资源

- [UE5.5 WebUI插件文档](https://docs.unrealengine.com/5.5/en-US/web-ui-plugin-in-unreal-engine/)
- [前端项目README](../../README.md)
- [架构设计文档](./architecture.md)
- [示例项目](https://github.com/your-project/ue-webui-example)

## 技术支持

如有问题，请联系：
- 技术文档：[项目Wiki](https://github.com/your-project/wiki)
- Issue追踪：[GitHub Issues](https://github.com/your-project/issues)
- 邮件支持：support@your-project.com
