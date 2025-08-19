<template>
  <div class="home">
    <h1>Vue3 监控系统集成演示</h1>
    
    <div class="info-cards">
      <div class="card">
        <h3>🔧 源码引用方式</h3>
        <p>在monorepo工作空间中，直接引用workspace包：</p>
        <pre><code>// package.json
"dependencies": {
  "@hawk-tracker/core": "workspace:*",
  "@hawk-tracker/plugin-error": "workspace:*"
}

// main.ts
import { init } from '@hawk-tracker/core'
import { ErrorPlugin } from '@hawk-tracker/plugin-error'</code></pre>
      </div>
      
      <div class="card">
        <h3>📦 非源码引用方式</h3>
        <p>如果包已发布到npm，可以这样引用：</p>
        <pre><code>// package.json
"dependencies": {
  "@hawk-tracker/core": "^1.0.0",
  "@hawk-tracker/plugin-error": "^1.0.0"
}

// main.ts
import { init } from '@hawk-tracker/core'
import { ErrorPlugin } from '@hawk-tracker/plugin-error'</code></pre>
      </div>
    </div>
    
    <div class="usage-demo">
      <h2>使用示例</h2>
      <div class="demo-buttons">
        <button @click="testManualTracking">手动上报测试</button>
        <button @click="testConsoleError">Console错误测试</button>
        <router-link to="/error-demo" class="button">
          查看错误演示页面
        </router-link>
      </div>
    </div>
    
    <div class="config-display">
      <h2>当前监控配置</h2>
      <pre><code>{{ monitorConfig }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const monitorConfig = ref({
  dsn: 'https://your-api-endpoint.com/track',
  appName: 'vue3-monitor-demo',
  appVersion: '1.0.0',
  debug: true,
  sampleRate: 1.0,
  plugins: ['ErrorPlugin'],
  features: {
    errorMonitoring: true,
    performanceMonitoring: false,
    userBehavior: false
  }
})

const testManualTracking = () => {
  // 获取全局监控实例并手动上报
  const hawkTracker = (window as any).__HAWK_TRACKER__
  if (hawkTracker) {
    hawkTracker.track('custom', {
      event: 'manual_test',
      data: {
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    })
    alert('手动上报已发送！请查看控制台')
  }
}

const testConsoleError = () => {
  console.error('这是一个测试错误信息', {
    type: 'test',
    severity: 'low',
    context: 'home-page-demo'
  })
  alert('Console错误已触发！请查看控制台')
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.info-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 2rem 0;
}

.card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #42b883;
}

.card h3 {
  margin-top: 0;
  color: #2c3e50;
}

.card pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.9rem;
}

.usage-demo {
  margin: 3rem 0;
}

.demo-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.demo-buttons button,
.demo-buttons .button {
  background: #42b883;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.3s;
}

.demo-buttons button:hover,
.demo-buttons .button:hover {
  background: #369870;
}

.config-display {
  margin: 3rem 0;
}

.config-display pre {
  background: #f1f3f4;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
}
</style> 