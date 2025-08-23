### Hawk Tracker 小型演示：按控制台输出的讲解流程

本文基于你给出的控制台输出，提供一份可直接照读的讲稿。每一步包含：你做什么、你会看到什么日志、背后的原理。

---

### 0. 预备

- **页面**: 打开 `examples/test/index.html`（通过 `pnpm dev` 启动的本地地址）
- **控制台**: 打开浏览器 DevTools Console，观察实时日志

---

### 1) 安装 BehaviorPlugin 并订阅事件

- **你做什么**: 页面加载（无需手动操作）
- **你会看到**:
  - 多条来自 `eventCenter.ts:11` 的日志：
    - `subscribeEvent xxxxx {handler: {…}}`（会出现多次）
  - 一条来自插件的日志：
    - `index.ts:100 [BehaviorPlugin] 事件订阅完成`
- **为什么**:
  - `BehaviorPlugin.install` 中依次向事件中心 `eventCenter` 订阅多个监听类型（click、load、beforeunload、hashchange、history、fetch、xhr、online/offline 等）。
  - 每订阅一次，`packages/core/src/lib/eventCenter.ts` 第 11 行会打印一条 `subscribeEvent` 日志。
  - 订阅完毕后，插件自身打印“事件订阅完成”。
- **关联文件**: `packages/plugin-behavior/src/index.ts`、`packages/core/src/lib/eventCenter.ts`

---

### 2) 首次页面加载事件写入“插件行为栈”

- **你做什么**: 页面首屏加载（无需手动）
- **你会看到**:
  - 来自行为栈的日志：
    - `behaviorStack.ts:69 [BehaviorStack:plugin:behavior:main] 事件已添加 { type: 'load', id: '...', currentSize: 1, totalEvents: 1 }`
- **为什么**:
  - AOP 初始化后，`load` 事件被捕获并通过 `eventCenter.emit` 发送到插件。
  - `BehaviorPlugin` 的 `handlePageLoadEvent` 将结构化的 `load` 行为写入其专属行为栈 `plugin:behavior:main`。
- **关联文件**: `packages/core/src/lib/AOPFactory.ts`、`packages/plugin-behavior/src/index.ts`、`packages/core/src/lib/behaviorStack.ts`

---

### 3) 读取统计与快照（默认栈 vs 插件栈）

- **你做什么**: 页面加载完成后，UI 会自动渲染统计与快照（或点击“立即刷新视图”）
- **你会看到**:
  - 默认栈统计（为空）：
    - `behaviorStack.ts:173 [BehaviorStack:default] 统计信息 { totalEvents: 0, currentEvents: 0, ... }`
  - 插件栈统计（有 1 条 load 事件）：
    - `behaviorStack.ts:173 [BehaviorStack:plugin:behavior:main] 统计信息 { totalEvents: 1, currentEvents: 1, ... }`
  - 获取快照：
    - `behaviorStack.ts:142 [BehaviorStack:default] 获取快照 { originalCount: 0, filteredCount: 0, options: {…} }`
    - `behaviorStack.ts:142 [BehaviorStack:plugin:behavior:main] 获取快照 { originalCount: 1, filteredCount: 1, options: {…} }`
- **为什么**:
  - 默认栈此时还未写入任何事件，所以统计为 0、快照为空。
  - 插件栈已写入首屏 `load` 事件，所以统计为 1，快照中有 1 条。
- **关联文件**: `packages/core/src/lib/behaviorStack.ts`（`getStats`、`getSnapshot`）

---

### 4) 继续演示（可选扩展）

- **添加自定义事件**（点击“添加自定义事件”）
  - 观察“默认栈统计/快照”发生变化（`custom_button_click` 事件入栈）。
- **触发 fetch 请求**（点击“触发 fetch 请求”）
  - 由 AOP 替换的 `fetch` 被捕获，`BehaviorPlugin` 写入网络类行为；“插件栈”统计增加。
- **history.pushState / hashchange**
  - 触发路由相关事件，观察“插件栈”中 `route_change` 类型的记录及其上下文（from/to）。
- **清空默认栈**（点击“清空默认栈”）
  - 观察“默认栈”的统计和快照清零。

---

### 5) 一张图概括链路

- 监听替换（AOP）→ 事件中心（`eventCenter.emit`）→ 插件订阅回调（`BehaviorPlugin.install`）→ 行为栈写入（`BehaviorStack.addEvent`）→ UI 调用 `getStats`/`getSnapshot` 展示。

---

- **“订阅多次”不是 Bug**：每条 `subscribeEvent` 对应订阅一个监听类型，这是插件安装的必要步骤。
- **“两条栈线”更清晰**：默认栈用于全局统一回溯；插件栈用于特定功能域（本演示中为“用户行为”）。
- **“快照/统计”是回放钥匙**：错误发生时可回看用户上下文（谁、在哪、做了什么）。

---

### Q&A

- Q: 为什么默认栈一开始是 0？
  - A: 默认栈在本演示中由 UI 或手动操作写入；首屏的 `load` 由 `BehaviorPlugin` 写入其专属栈。
- Q: `subscribeEvent` 为什么出现很多条？
  - A: 插件订阅了多个 `LISTEN_TYPES`；每次订阅都会打印一次。
- Q: 我如何证明 AOP 生效？
  - A: 触发 `fetch`/`history.pushState`/`hashchange`，在“插件栈快照”里能看到相应事件及上下文信息。

---

### 参考文件（便于翻阅源码）

- `packages/core/src/lib/eventCenter.ts`
- `packages/core/src/lib/AOPFactory.ts`
- `packages/plugin-behavior/src/index.ts`
- `packages/core/src/lib/behaviorStack.ts`
- `examples/test/index.js`、`index.html`、`index.css`
