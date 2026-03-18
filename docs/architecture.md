# UE5.5 WebUI 前端架构设计

## 1. 架构概述

本项目采用**模块化、分层架构设计**，确保代码的可维护性、可扩展性和可测试性。架构遵循关注点分离（SoC）原则，将不同职责分离到独立的模块中。

## 2. 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                     前端应用层 (Presentation Layer)           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Pages     │  │ Components  │  │    UI       │         │
│  │  (页面)     │  │ (可复用组件)│  │ 样式/主题   │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
└─────────┼────────────────┼────────────────┼────────────────┘
          │                │                │
┌─────────▼────────────────▼────────────────▼────────────────┐
│                业务逻辑层 (Business Logic Layer)             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Events    │  │   State     │  │  Validation │        │
│  │   Manager   │  │  Manager    │  │  Manager    │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
└─────────┼────────────────┼────────────────┼───────────────┘
          │                │                │
┌─────────▼────────────────▼────────────────▼───────────────┐
│               通信抽象层 (Communication Layer)              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           UECommunicator (UE通信核心)                 │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │  │
│  │  │  Sender  │  │ Receiver │  │  Logger  │         │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘         │  │
│  └───────┼─────────────┼─────────────┼─────────────────┘  │
└──────────┼─────────────┼─────────────┼────────────────────┘
           │             │             │
┌──────────▼─────────────▼─────────────▼────────────────────┐
│              UE WebUI Native Interface                      │
│         window.ue.interface.broadcast()                    │
│         window.ue4()                                       │
└─────────────────────────────────────────────────────────────┘
```

## 3. 核心架构原则

### 3.1 分层设计

| 层级 | 职责 | 关键技术 |
|------|------|----------|
| **表现层** | 用户界面、交互处理 | HTML5, CSS3, JavaScript ES6+ |
| **业务逻辑层** | 业务规则、状态管理 | 事件驱动、状态模式 |
| **通信抽象层** | UE通信封装、错误处理 | Promise、异步编程 |
| **原生接口层** | UE WebUI原生API | window.ue.interface |

### 3.2 设计模式

#### 单例模式 (Singleton)
- `UECommunicator`: 全局唯一的通信实例
- `Logger`: 统一的日志系统

#### 观察者模式 (Observer)
- 事件监听器管理
- 消息订阅/发布机制

#### 工厂模式 (Factory)
- 错误对象创建
- 消息对象构建

#### 策略模式 (Strategy)
- 通信策略（真实环境 vs 测试环境）
- 日志策略（不同级别输出）

## 4. 核心模块设计

### 4.1 UECommunicator (通信核心)

**职责**: 管理与UE引擎的所有通信

```typescript
class UECommunicator {
  // 发送消息到UE
  send(eventName: string, data?: any): Promise<Response>
  
  // 发送并等待响应
  sendWithResponse(eventName: string, data?: any, timeout?: number): Promise<Response>
  
  // 注册事件监听器
  on(eventName: string, callback: Function): void
  
  // 移除事件监听器
  off(eventName: string, callback?: Function): void
  
  // 触发事件
  emit(eventName: string, data?: any): void
  
  // 获取连接状态
  getStatus(): ConnectionStatus
}
```

**关键特性**:
- Promise-based API
- 自动超时处理
- 请求/响应匹配
- 事件订阅管理
- 连接状态监控

### 4.2 EventManager (事件管理器)

**职责**: 应用内事件总线

```typescript
class EventManager {
  // 订阅事件
  subscribe(event: string, handler: Function): Subscription
  
  // 发布事件
  publish(event: string, data?: any): void
  
  // 取消订阅
  unsubscribe(subscription: Subscription): void
  
  // 清理所有订阅
  clear(): void
}
```

### 4.3 Logger (日志系统)

**职责**: 统一日志管理和输出

```typescript
class Logger {
  // 调试日志
  debug(...args: any[]): void
  
  // 信息日志
  info(...args: any[]): void
  
  // 警告日志
  warn(...args: any[]): void
  
  // 错误日志
  error(...args: any[]): void
  
  // 设置日志级别
  setLevel(level: LogLevel): void
}
```

**日志级别**:
- DEBUG: 开发调试信息
- INFO: 一般信息
- WARN: 警告信息
- ERROR: 错误信息

### 4.4 StateManager (状态管理器)

**职责**: 应用状态集中管理

```typescript
class StateManager {
  // 获取状态
  getState<T>(key: string): T | undefined
  
  // 设置状态
  setState<T>(key: string, value: T): void
  
  // 订阅状态变化
  subscribe<T>(key: string, callback: (value: T) => void): Subscription
  
  // 清除状态
  clear(key?: string): void
}
```

## 5. 通信协议设计

### 5.1 消息格式

#### 请求消息 (前端 → UE)
```json
{
  "event": "EventName",
  "data": {
    "key": "value",
    "timestamp": 1234567890
  },
  "metadata": {
    "version": "1.0.0",
    "requestId": "req_123456"
  }
}
```

#### 响应消息 (UE → 前端)
```json
{
  "success": true,
  "data": {
    "result": "success",
    "message": "操作成功"
  },
  "error": null,
  "metadata": {
    "responseTime": 150,
    "timestamp": 1234567891
  }
}
```

### 5.2 事件命名规范

- **系统事件**: `system:*` (如 `system:init`, `system:error`)
- **UI事件**: `ui:*` (如 `ui:button:click`, `ui:input:change`)
- **数据事件**: `data:*` (如 `data:load`, `data:save`)
- **UE事件**: `ue:*` (如 `ue:level:loaded`, `ue:actor:spawned`)

### 5.3 错误处理机制

#### 错误类型
```typescript
enum ErrorType {
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UE_ERROR = 'UE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}
```

#### 错误响应格式
```json
{
  "success": false,
  "data": null,
  "error": {
    "type": "TIMEOUT_ERROR",
    "message": "请求超时",
    "details": {
      "event": "TestEvent",
      "timeout": 5000
    }
  }
}
```

## 6. 数据流设计

### 6.1 单向数据流

```
User Action → Event Handler → Business Logic → UECommunicator → UE Engine
     ↓                                                                  ↓
     └────────────── UI Update ←─ State Update ←─ Response Handler ←───┘
```

### 6.2 双向通信

```
┌─────────────┐                    ┌─────────────┐
│   Frontend  │                    │  UE Engine  │
│             │  ── Request ──>    │             │
│  UEComm.    │                    │  Blueprint  │
│             │  <─ Response ──    │             │
└─────────────┘                    └─────────────┘
```

## 7. 性能优化策略

### 7.1 通信优化

- **消息队列**: 批量发送消息，减少通信开销
- **消息压缩**: 大数据量使用压缩传输
- **连接池**: 复用连接，减少建立开销
- **超时机制**: 避免长时间等待

### 7.2 渲染优化

- **虚拟DOM**: 减少DOM操作
- **防抖节流**: 高频事件优化
- **懒加载**: 按需加载资源
- **缓存策略**: 合理缓存数据

### 7.3 内存管理

- **事件清理**: 及时移除事件监听器
- **资源释放**: 组件销毁时清理资源
- **弱引用**: 使用WeakMap/WeakSet

## 8. 安全性设计

### 8.1 输入验证

- **类型检查**: 严格类型验证
- **范围检查**: 数值范围限制
- **格式验证**: 正则表达式验证
- **长度限制**: 字符串长度限制

### 8.2 通信安全

- **消息签名**: 验证消息来源
- **数据加密**: 敏感数据加密传输
- **权限控制**: 操作权限验证
- **CSRF防护**: 跨站请求伪造防护

### 8.3 错误处理

- **错误屏蔽**: 不向用户暴露详细错误
- **日志脱敏**: 敏感信息脱敏处理
- **异常监控**: 异常行为监控

## 9. 测试策略

### 9.1 单元测试

```typescript
// UECommunicator测试
describe('UECommunicator', () => {
  test('should send message to UE', async () => {
    const communicator = new UECommunicator();
    const response = await communicator.send('TestEvent', { data: 'test' });
    expect(response.success).toBe(true);
  });
});
```

### 9.2 集成测试

- **与UE集成测试**: 实际UE环境测试
- **端到端测试**: 完整流程测试
- **性能测试**: 压力测试

### 9.3 测试覆盖率

- 代码覆盖率: > 80%
- 分支覆盖率: > 70%
- 函数覆盖率: > 80%

## 10. 部署和运维

### 10.1 构建流程

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 运行测试
npm test

# 代码检查
npm run lint
```

### 10.2 环境配置

| 环境 | API地址 | 日志级别 | 调试模式 |
|------|---------|----------|----------|
| 开发 | localhost | DEBUG | ON |
| 测试 | test.example.com | INFO | ON |
| 预生产 | staging.example.com | WARN | OFF |
| 生产 | example.com | ERROR | OFF |

### 10.3 监控和告警

- **性能监控**: 响应时间、资源使用
- **错误监控**: 错误率、异常堆栈
- **通信监控**: 消息成功率、延迟
- **业务监控**: 关键业务指标

## 11. 扩展性设计

### 11.1 插件系统

```typescript
interface UEPlugin {
  name: string;
  version: string;
  initialize(communicator: UECommunicator): void;
  destroy(): void;
}

class PluginManager {
  register(plugin: UEPlugin): void;
  unregister(pluginName: string): void;
  get(pluginName: string): UEPlugin | undefined;
}
```

### 11.2 自定义事件

```typescript
// 注册自定义事件处理器
ueCommunicator.on('custom:event', (data) => {
  // 处理自定义事件
});

// 触发自定义事件
ueCommunicator.emit('custom:event', { custom: 'data' });
```

## 12. 版本兼容性

### 12.1 UE版本兼容

- **UE 4.x**: 基础功能兼容
- **UE 5.0-5.4**: 完全兼容
- **UE 5.5+**: 推荐使用，支持所有功能

### 12.2 浏览器兼容

- **现代浏览器**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **旧版浏览器**: 使用polyfill兼容

### 12.3 向后兼容策略

- **API版本控制**: URL版本号（/v1/, /v2/）
- **功能开关**: 特性开关控制
- **优雅降级**: 不支持的功能降级处理

## 13. 最佳实践

### 13.1 代码组织

```
src/
├── core/              # 核心模块（不依赖其他模块）
├── features/          # 功能模块
│   ├── feature-name/
│   │   ├── index.js
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
├── shared/            # 共享模块
│   ├── components/
│   ├── utils/
│   └── constants/
└── pages/             # 页面模块
    └── page-name/
        ├── index.html
        ├── index.js
        └── styles.css
```

### 13.2 命名规范

- **文件命名**: kebab-case（如 `ue-communicator.js`）
- **类命名**: PascalCase（如 `UECommunicator`）
- **函数命名**: camelCase（如 `sendMessage`）
- **常量命名**: UPPER_SNAKE_CASE（如 `UE_CONFIG`）

### 13.3 代码质量

- **TypeScript**: 类型安全
- **ESLint**: 代码规范
- **Prettier**: 代码格式化
- **单元测试**: Jest + Testing Library
- **E2E测试**: Playwright/Cypress

## 14. 总结

本架构设计提供了：

1. **清晰的层次结构**: 各层职责明确，解耦良好
2. **健壮的通信机制**: 可靠的双向通信
3. **完善的安全措施**: 多层次安全保障
4. **优秀的可扩展性**: 插件化设计，易于扩展
5. **良好的可测试性**: 便于单元测试和集成测试
6. **高性能**: 多种优化策略
7. **易维护性**: 清晰的代码组织和文档

该架构能够支撑商业级应用开发，满足大规模、高性能、高可用的要求。
