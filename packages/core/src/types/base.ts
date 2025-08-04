/**
 * 基础信息接口，继承自Device接口，包含额外的追踪信息，如当前SDK和应用信息，用户信息等
 */
export interface IBaseInfo extends Device {
  // userUuid: string        // 业务层面的用户UUID
  // sdkUserUuid: string     // SDK生成的用户UUID
  // ext: AnyObj              // 扩展字段，用于存储自定义数据
  // appName: string         // 应用名称
  // appCode: string         // 应用代码标识符
  // pageId: string          // 当前页面的唯一标识符
  // sessionId: string       // 会话ID，用于浏览器与服务器间的通信
  // sdkVersion: string      // SDK版本号
  // ip: string             // 用户IP地址
}

/**
 * 设备相关信息接口
 */
// 这些设备信息数据在前端监控中有以下作用:
// 1. 帮助定位和复现问题 - 通过设备信息可以了解用户的浏览环境,更容易复现和解决问题
// 2. 统计分析用户画像 - 了解用户使用的设备类型、屏幕尺寸等信息,为产品决策提供数据支持
// 3. 性能优化 - 根据不同设备的特点进行针对性的性能优化和适配
// 4. 问题追踪 - deviceId可以追踪特定设备的问题,vendor和platform可以发现浏览器兼容性问题

// deviceId如何获取？
// 1. 使用fingerprintjs获取设备唯一标识符 √
// 2. 使用uuid生成设备唯一标识符
// 3. 使用浏览器存储获取设备唯一标识符

export interface Device {
  // clientHeight: number    // 网页可见区高度（像素）
  // clientWidth: number     // 网页可见区宽度（像素）
  // colorDepth: number      // 显示屏幕调色板的比特深度
  // pixelDepth: number      // 显示屏幕的颜色分辨率（每像素的位数）
  // screenWidth: number     // 显示屏幕的宽度（像素）
  // screenHeight: number    // 显示屏幕的高度（像素）
  // deviceId: string        // 设备唯一标识符
  // vendor: string          // 浏览器厂商名称
  // platform: string        // 浏览器平台环境（不是操作系统架构）
}
