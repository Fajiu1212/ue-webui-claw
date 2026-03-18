/**
 * UE WebUI 通信核心模块
 * 提供与Unreal Engine 5.5 WebUI插件的双向通信能力
 * 
 * @module UECommunicator
 * @version 1.0.0
 * @author Development Team
 * @license MIT
 */

/**
 * UE通信配置
 */
const UE_CONFIG = {
  // 通信超时时间（毫秒）
  TIMEOUT: 5000,
  // 重试次数
  RETRY_COUNT: 3,
  // 日志级别: 'debug', 'info', 'warn', 'error'
  LOG_LEVEL: 'info',
  // 是否启用调试模式
  DEBUG_MODE: true
};

/**
 * 日志系统
 */
class Logger {
  constructor(prefix = '[UE-Communicator]') {
    this.prefix = prefix;
  }

  debug(...args) {
    if (UE_CONFIG.DEBUG_MODE && UE_CONFIG.LOG_LEVEL === 'debug') {
      console.debug(this.prefix, ...args);
    }
  }

  info(...args) {
    if (['debug', 'info'].includes(UE_CONFIG.LOG_LEVEL)) {
      console.info(this.prefix, ...args);
    }
  }

  warn(...args) {
    if (['debug', 'info', 'warn'].includes(UE_CONFIG.LOG_LEVEL)) {
      console.warn(this.prefix, ...args);
    }
  }

  error(...args) {
    console.error(this.prefix, ...args);
  }
}

const logger = new Logger();

/**
 * UE接口验证和初始化
 */
class UEInterfaceValidator {
  /**
   * 验证UE接口是否可用
   * @returns {boolean} 接口是否可用
   */
  static isAvailable() {
    const isUEObjectAvailable = typeof window.ue !== 'undefined';
    const isUEInterfaceAvailable = isUEObjectAvailable && typeof window.ue.interface !== 'undefined';
    const isBroadcastAvailable = isUEInterfaceAvailable && typeof window.ue.interface.broadcast === 'function';
    
    logger.debug('UE接口状态:', {
      ue: isUEObjectAvailable,
      'ue.interface': isUEInterfaceAvailable,
      'ue.interface.broadcast': isBroadcastAvailable
    });

    return isBroadcastAvailable;
  }

  /**
   * 初始化UE接口
   * 如果接口不存在，则创建兼容接口
   */
  static initialize() {
    if (this.isAvailable()) {
      logger.info('UE接口已可用');
      return true;
    }

    logger.warn('UE接口不可用，创建兼容模式');
    
    // 创建兼容接口
    window.ue = window.ue || {};
    window.ue.interface = window.ue.interface || {};
    window.ue.interface.broadcast = this.createMockBroadcast();
    
    // 创建全局ue4快捷方式
    window.ue4 = window.ue.interface.broadcast;
    
    logger.info('兼容接口创建完成');
    return false;
  }

  /**
   * 创建模拟广播函数（用于测试环境）
   * @returns {Function} 模拟广播函数
   */
  static createMockBroadcast() {
    return function(eventName, data) {
      logger.warn('模拟模式:', `事件: ${eventName}`, '数据:', data);
      
      // 模拟UE响应（测试用）
      setTimeout(() => {
        if (typeof window.ue.interface.onMockResponse === 'function') {
          window.ue.interface.onMockResponse(eventName, {
            success: true,
            message: '模拟响应',
            originalEvent: eventName,
            timestamp: Date.now()
          });
        }
      }, 100);
    };
  }
}

/**
 * UE通信器主类
 */
class UECommunicator {
  constructor(config = {}) {
    this.config = { ...UE_CONFIG, ...config };
    this.eventListeners = new Map();
    this.pendingRequests = new Map();
    this.isInitialized = false;
    
    this.logger = new Logger('[UE-Communicator]');
    this.init();
  }

  /**
   * 初始化通信器
   */
  init() {
    try {
      // 验证并初始化UE接口
      this.isInitialized = UEInterfaceValidator.initialize();
      
      // 设置全局错误处理
      this.setupErrorHandling();
      
      this.logger.info('UE通信器初始化完成');
      this.logger.debug('配置:', this.config);
      
      return true;
    } catch (error) {
      this.logger.error('初始化失败:', error);
      return false;
    }
  }

  /**
   * 设置错误处理
   */
  setupErrorHandling() {
    window.addEventListener('error', (event) => {
      this.logger.error('全局错误捕获:', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.logger.error('未处理的Promise拒绝:', event.reason);
    });
  }

  /**
   * 发送消息到UE
   * @param {string} eventName - 事件名称
   * @param {any} data - 要发送的数据
   * @param {Object} options - 选项
   * @returns {Promise} Promise对象
   */
  send(eventName, data = null, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        // 参数验证
        if (!eventName || typeof eventName !== 'string') {
          throw new Error('事件名称必须是有效的字符串');
        }

        // 序列化数据
        const payload = data !== null ? JSON.stringify(data) : '';
        
        this.logger.debug('发送消息:', {
          event: eventName,
          data: data,
          hasPayload: payload.length > 0
        });

        // 发送消息到UE
        if (typeof window.ue4 === 'function') {
          window.ue4(eventName, data);
          this.logger.info(`消息已发送: ${eventName}`);
          resolve({ success: true, event: eventName });
        } else {
          throw new Error('UE4接口不可用');
        }
      } catch (error) {
        this.logger.error('发送消息失败:', error);
        reject(error);
      }
    });
  }

  /**
   * 发送消息并期待响应（带超时）
   * @param {string} eventName - 事件名称
   * @param {any} data - 要发送的数据
   * @param {number} timeout - 超时时间（毫秒）
   * @returns {Promise} Promise对象
   */
  sendWithResponse(eventName, data = null, timeout = null) {
    const timeoutMs = timeout || this.config.TIMEOUT;
    const requestId = this.generateRequestId();
    
    return new Promise((resolve, reject) => {
      // 设置超时计时器
      const timeoutTimer = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error(`请求超时: ${eventName}`));
      }, timeoutMs);

      // 保存请求信息
      this.pendingRequests.set(requestId, {
        resolve,
        reject,
        timeoutTimer,
        eventName
      });

      // 发送消息
      this.send(eventName, data).catch(reject);
    });
  }

  /**
   * 注册事件监听器
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 回调函数
   */
  on(eventName, callback) {
    if (typeof callback !== 'function') {
      throw new Error('回调必须是函数');
    }

    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }

    this.eventListeners.get(eventName).push(callback);
    this.logger.debug(`注册监听器: ${eventName}`);
  }

  /**
   * 移除事件监听器
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 回调函数（可选）
   */
  off(eventName, callback = null) {
    if (!this.eventListeners.has(eventName)) {
      return;
    }

    if (callback) {
      // 移除特定回调
      const callbacks = this.eventListeners.get(eventName);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    } else {
      // 移除所有回调
      this.eventListeners.delete(eventName);
    }

    this.logger.debug(`移除监听器: ${eventName}`);
  }

  /**
   * 触发事件（内部使用）
   * @param {string} eventName - 事件名称
   * @param {any} data - 事件数据
   */
  emit(eventName, data) {
    const callbacks = this.eventListeners.get(eventName);
    if (!callbacks || callbacks.length === 0) {
      this.logger.debug(`没有监听器: ${eventName}`);
      return;
    }

    this.logger.debug(`触发事件: ${eventName}`, data);
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        this.logger.error(`事件处理错误 [${eventName}]:`, error);
      }
    });
  }

  /**
   * 处理UE响应
   * @param {string} requestId - 请求ID
   * @param {any} response - 响应数据
   */
  handleResponse(requestId, response) {
    const request = this.pendingRequests.get(requestId);
    if (!request) {
      this.logger.warn(`未知请求ID: ${requestId}`);
      return;
    }

    // 清除超时计时器
    clearTimeout(request.timeoutTimer);
    this.pendingRequests.delete(requestId);

    // 解析响应
    try {
      const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
      request.resolve(parsedResponse);
    } catch (error) {
      request.resolve(response);
    }
  }

  /**
   * 生成请求ID
   * @returns {string} 请求ID
   */
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取连接状态
   * @returns {Object} 状态信息
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      ueAvailable: UEInterfaceValidator.isAvailable(),
      listenersCount: this.eventListeners.size,
      pendingRequests: this.pendingRequests.size
    };
  }

  /**
   * 清理资源
   */
  destroy() {
    // 清理所有挂起的请求
    this.pendingRequests.forEach((request, requestId) => {
      clearTimeout(request.timeoutTimer);
      request.reject(new Error('通信器已销毁'));
    });
    this.pendingRequests.clear();

    // 清理事件监听器
    this.eventListeners.clear();

    this.logger.info('通信器已销毁');
  }
}

// 自动注册全局UE消息处理函数
window.addEventListener('DOMContentLoaded', () => {
  // 创建默认通信器实例
  window.ueCommunicator = new UECommunicator();
  
  // 注册测试响应处理（用于开发和测试）
  window.ue.interface = window.ue.interface || {};
  window.ue.interface.onTestResponse = function(data) {
    console.log('[UE Test Response]:', data);
  };
});

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    UECommunicator,
    UEInterfaceValidator,
    UE_CONFIG
  };
}

// ES6模块导出
if (typeof export !== 'undefined') {
  export { UECommunicator, UEInterfaceValidator, UE_CONFIG };
}
