// 测试 Hawk Tracker Core 行为栈系统
import { init, BehaviorPlugin } from '../../packages/core/src/index';

console.log('🚀 开始测试 Hawk Tracker Core 行为栈系统');

// 初始化 SDK
const tracker = init({
  dsn: 'https://test-dsn.com',
  appName: 'BehaviorStackTest',
  appVersion: '1.0.0',
  debug: true,
  behavior: {
    core: true,
    maxSize: 200,
    maxAge: 10 * 60 * 1000, // 10分钟
    debug: true,
  },
});

console.log('✅ SDK 初始化完成', tracker);

// 测试行为栈管理器
console.log('📊 测试行为栈管理器...');

// 获取默认栈
const defaultStack = tracker.getBehaviorStack();
console.log('默认栈:', defaultStack?.getName(), defaultStack?.getStats());

// 创建自定义栈
const customStack = tracker.createBehaviorStack('custom_test', {
  maxSize: 50,
  maxAge: 5 * 60 * 1000,
  debug: true,
});
console.log('自定义栈:', customStack.getName(), customStack.getStats());

// 创建错误栈
const errorStack = tracker.createBehaviorStack('error_tracking', {
  maxSize: 30,
  maxAge: 15 * 60 * 1000,
  debug: true,
});
console.log('错误栈:', errorStack.getName(), errorStack.getStats());

// 测试添加事件
console.log('📝 测试添加事件...');

// 添加自定义事件到默认栈
defaultStack.addCustomEvent('test_start', {
  message: '开始测试行为栈系统',
  timestamp: Date.now(),
});

// 添加自定义事件到自定义栈
customStack.addCustomEvent('user_action', {
  action: 'button_click',
  buttonId: 'test-btn',
  position: { x: 100, y: 200 },
});

// 添加错误事件到错误栈
errorStack.addCustomEvent('test_error', {
  errorType: 'test_error',
  message: '这是一个测试错误',
  stack: 'Error: test error\n    at test.js:1:1',
});

// 查看栈状态
console.log('📊 栈状态概览:');
console.log('默认栈:', defaultStack.getStats());
console.log('自定义栈:', customStack.getStats());
console.log('错误栈:', errorStack.getStats());

// 测试快照功能
console.log('📸 测试快照功能...');

const defaultSnapshot = defaultStack.getSnapshot({ maxCount: 5 });
const customSnapshot = customStack.getSnapshot({ maxCount: 5 });
const errorSnapshot = errorStack.getSnapshot({ maxCount: 5 });

console.log('默认栈快照:', defaultSnapshot);
console.log('自定义栈快照:', customSnapshot);
console.log('错误栈快照:', errorSnapshot);

// 测试过滤器
console.log('🔍 测试过滤器...');

const filteredStack = tracker.createBehaviorStack('filtered_events', {
  maxSize: 100,
  filter: (event) => {
    // 只保留包含 customData 的事件
    return (
      event.context?.customData &&
      Object.keys(event.context.customData).length > 0
    );
  },
});

filteredStack.addCustomEvent('filtered_event_1', { data: 'will_be_kept' });
filteredStack.addCustomEvent('filtered_event_2', {}); // 没有 customData，会被过滤
filteredStack.addCustomEvent('filtered_event_3', { data: 'will_be_kept_too' });

console.log('过滤后的事件:', filteredStack.getSnapshot());

// 测试插件系统
console.log('🔌 测试插件系统...');

// 使用 BehaviorPlugin
const behaviorPlugin = new BehaviorPlugin({
  stackName: 'plugin_behavior',
  maxSize: 100,
  debug: true,
});

behaviorPlugin.install(tracker);
window.behaviorPlugin = behaviorPlugin;
// 模拟一些用户行为
setTimeout(() => {
  console.log('⏰ 模拟用户行为...');

  // 模拟点击事件
  const clickEvent = new MouseEvent('click', {
    clientX: 150,
    clientY: 250,
  });

  // 手动触发点击事件处理
  if (behaviorPlugin.handleClickEvent) {
    behaviorPlugin.handleClickEvent(clickEvent);
  }

  // 查看插件的行为栈
  const pluginStats = behaviorPlugin.getBehaviorStats();
  console.log('插件行为栈统计:', pluginStats);

  // 获取插件行为快照
  const pluginSnapshot = behaviorPlugin.getBehaviorSnapshot();
  console.log('插件行为快照:', pluginSnapshot);
}, 1000);

// 测试管理器功能
console.log('🎛️ 测试管理器功能...');

const manager = tracker.behaviorStackManager;
console.log('栈数量:', manager.getBehaviorStackCount());
console.log('所有栈名称:', manager.getBehaviorStackNames());
console.log('所有栈统计:', manager.getAllBehaviorStackStats());

// 测试栈销毁
console.log('🗑️ 测试栈销毁...');

const testStack = tracker.createBehaviorStack('temp_stack', { maxSize: 10 });
console.log('临时栈创建成功:', testStack.getName());

tracker.behaviorStackManager.destroyBehaviorStack('temp_stack');
console.log('临时栈已销毁');

// 最终状态
console.log('🏁 最终状态:');
console.log('剩余栈数量:', manager.getBehaviorStackCount());
console.log('剩余栈名称:', manager.getBehaviorStackNames());

console.log('🎉 行为栈系统测试完成！');

// 导出到全局，方便在控制台调试
window.tracker = tracker;
window.defaultStack = defaultStack;
window.customStack = customStack;
window.errorStack = errorStack;
window.behaviorPlugin = behaviorPlugin;
