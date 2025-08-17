<template>
  <div class="monitor-example">
    <h2>监控系统使用示例</h2>
    
    <div class="example-sections">
      <!-- 基础使用 -->
      <div class="section">
        <h3>1. 基础事件追踪</h3>
        <div class="example-code">
          <pre><code>// 手动追踪自定义事件
hawkTracker.track('custom', {
  event: 'button_click',
  target: 'example_button',
  timestamp: Date.now()
});</code></pre>
        </div>
        <button @click="trackBasicEvent" class="demo-btn">
          测试基础事件追踪
        </button>
      </div>

      <!-- 错误追踪 -->
      <div class="section">
        <h3>2. 错误追踪</h3>
        <div class="example-code">
          <pre><code>// 手动上报错误
hawkTracker.track('error', {
  message: error.message,
  stack: error.stack,
  type: 'manual-error',
  timestamp: Date.now()
});</code></pre>
        </div>
        <button @click="trackManualError" class="demo-btn error">
          测试手动错误追踪
        </button>
      </div>

      <!-- 性能监控 -->
      <div class="section">
        <h3>3. 性能监控</h3>
        <div class="example-code">
          <pre><code>// 性能数据追踪
const startTime = performance.now();
// 执行操作...
const duration = performance.now() - startTime;

hawkTracker.track('performance', {
  name: 'operation_name',
  duration,
  timestamp: Date.now()
});</code></pre>
        </div>
        <button @click="trackPerformance" class="demo-btn performance">
          测试性能监控
        </button>
      </div>

      <!-- 用户行为 -->
      <div class="section">
        <h3>4. 用户行为追踪</h3>
        <div class="example-code">
          <pre><code>// 用户行为追踪
hawkTracker.track('user-behavior', {
  action: 'page_view',
  page: '/example',
  referrer: document.referrer,
  timestamp: Date.now()
});</code></pre>
        </div>
        <button @click="trackUserBehavior" class="demo-btn behavior">
          测试用户行为追踪
        </button>
      </div>

      <!-- 网络请求监控 -->
      <div class="section">
        <h3>5. 网络请求监控</h3>
        <div class="example-code">
          <pre><code>// 网络请求监控
const startTime = performance.now();
try {
  const response = await fetch('/api/data');
  const duration = performance.now() - startTime;
  
  hawkTracker.track('api-success', {
    url: '/api/data',
    duration,
    status: response.status
  });
} catch (error) {
  hawkTracker.track('api-error', {
    url: '/api/data',
    error: error.message
  });
}</code></pre>
        </div>
        <button @click="trackNetworkRequest" class="demo-btn network">
          测试网络请求监控
        </button>
      </div>
    </div>

    <!-- 实时日志 -->
    <div class="logs-section">
      <h3>实时监控日志</h3>
      <div class="logs-container">
        <div 
          v-for="(log, index) in logs" 
          :key="index" 
          :class="['log-item', `log-${log.type}`]"
        >
          <span class="log-time">{{ log.time }}</span>
          <span class="log-type">{{ log.type }}</span>
          <span class="log-message">{{ log.message }}</span>
          <details class="log-details">
            <summary>详细信息</summary>
            <pre>{{ JSON.stringify(log.data, null, 2) }}</pre>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 模拟获取全局监控实例
const getHawkTracker = () => {
  return (window as any).__HAWK_TRACKER__ || {
    track: (type: string, data: any) => {
      console.log('Monitor Track:', type, data);
      addLog(type, `追踪事件: ${type}`, data);
    }
  };
};

const logs = ref<Array<{
  time: string;
  type: string;
  message: string;
  data: any;
}>>([]);

const addLog = (type: string, message: string, data: any) => {
  logs.value.unshift({
    time: new Date().toLocaleTimeString(),
    type,
    message,
    data
  });
  
  // 限制日志数量
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(0, 50);
  }
};

// 1. 基础事件追踪
const trackBasicEvent = () => {
  const hawkTracker = getHawkTracker();
  
  hawkTracker.track('custom', {
    event: 'button_click',
    target: 'basic_event_button',
    page: window.location.pathname,
    timestamp: Date.now(),
    userAgent: navigator.userAgent
  });
};

// 2. 错误追踪
const trackManualError = () => {
  const hawkTracker = getHawkTracker();
  
  const mockError = new Error('这是一个测试错误');
  
  hawkTracker.track('error', {
    message: mockError.message,
    stack: mockError.stack,
    type: 'manual-error',
    url: window.location.href,
    timestamp: Date.now(),
    severity: 'low'
  });
};

// 3. 性能监控
const trackPerformance = async () => {
  const hawkTracker = getHawkTracker();
  const startTime = performance.now();
  
  // 模拟一个耗时操作
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
  
  const duration = performance.now() - startTime;
  
  hawkTracker.track('performance', {
    name: 'simulated_operation',
    duration: Math.round(duration),
    type: 'async-operation',
    timestamp: Date.now(),
    metadata: {
      operationType: 'simulation',
      complexity: 'medium'
    }
  });
};

// 4. 用户行为追踪
const trackUserBehavior = () => {
  const hawkTracker = getHawkTracker();
  
  hawkTracker.track('user-behavior', {
    action: 'button_interaction',
    element: 'user_behavior_button',
    page: window.location.pathname,
    referrer: document.referrer,
    timestamp: Date.now(),
    sessionId: sessionStorage.getItem('sessionId') || 'unknown',
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  });
};

// 5. 网络请求监控
const trackNetworkRequest = async () => {
  const hawkTracker = getHawkTracker();
  const startTime = performance.now();
  const requestId = Math.random().toString(36).substr(2, 9);
  
  try {
    // 模拟网络请求
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    const duration = performance.now() - startTime;
    
    if (response.ok) {
      hawkTracker.track('api-success', {
        requestId,
        url: response.url,
        method: 'GET',
        status: response.status,
        duration: Math.round(duration),
        timestamp: Date.now(),
        responseSize: response.headers.get('content-length') || 'unknown'
      });
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    const duration = performance.now() - startTime;
    
    hawkTracker.track('api-error', {
      requestId,
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      method: 'GET',
      error: error instanceof Error ? error.message : String(error),
      duration: Math.round(duration),
      timestamp: Date.now()
    });
  }
};

onMounted(() => {
  addLog('info', '监控示例组件已加载', {
    component: 'MonitorUsageExample',
    timestamp: Date.now()
  });
});
</script>

<style scoped>
.monitor-example {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.example-sections {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.section h3 {
  margin-top: 0;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.example-code {
  background: #2d3748;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  overflow-x: auto;
}

.example-code pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.4;
}

.demo-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.demo-btn:hover {
  background: #0056b3;
}

.demo-btn.error {
  background: #dc3545;
}

.demo-btn.error:hover {
  background: #c82333;
}

.demo-btn.performance {
  background: #28a745;
}

.demo-btn.performance:hover {
  background: #1e7e34;
}

.demo-btn.behavior {
  background: #ffc107;
  color: #212529;
}

.demo-btn.behavior:hover {
  background: #e0a800;
}

.demo-btn.network {
  background: #6f42c1;
}

.demo-btn.network:hover {
  background: #5a32a3;
}

.logs-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #17a2b8;
}

.logs-section h3 {
  margin-top: 0;
  color: #2c3e50;
}

.logs-container {
  max-height: 400px;
  overflow-y: auto;
  background: #2d3748;
  border-radius: 4px;
  padding: 1rem;
}

.log-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #4a5568;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  color: #9ca3af;
  min-width: 80px;
  flex-shrink: 0;
}

.log-type {
  font-weight: bold;
  min-width: 100px;
  flex-shrink: 0;
}

.log-custom .log-type {
  color: #60a5fa;
}

.log-error .log-type {
  color: #f87171;
}

.log-performance .log-type {
  color: #34d399;
}

.log-user-behavior .log-type {
  color: #fbbf24;
}

.log-api-success .log-type {
  color: #a78bfa;
}

.log-api-error .log-type {
  color: #f87171;
}

.log-info .log-type {
  color: #6b7280;
}

.log-message {
  color: #e5e7eb;
  flex: 1;
}

.log-details {
  margin-left: auto;
}

.log-details summary {
  color: #9ca3af;
  cursor: pointer;
  font-size: 0.8rem;
}

.log-details pre {
  background: #1f2937;
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  max-width: 300px;
  overflow-x: auto;
}
</style> 