<template>
  <div class="performance-demo">
    <h1>性能监控演示</h1>
    <p>这个页面演示了如何监控各种性能指标（需要集成性能监控插件）</p>
    
    <div class="performance-sections">
      <div class="section">
        <h3>页面加载性能</h3>
        <div class="metrics">
          <div class="metric">
            <label>DOMContentLoaded:</label>
            <span>{{ performanceMetrics.domContentLoaded }}ms</span>
          </div>
          <div class="metric">
            <label>Load Event:</label>
            <span>{{ performanceMetrics.loadEvent }}ms</span>
          </div>
          <div class="metric">
            <label>First Paint:</label>
            <span>{{ performanceMetrics.firstPaint }}ms</span>
          </div>
          <div class="metric">
            <label>First Contentful Paint:</label>
            <span>{{ performanceMetrics.firstContentfulPaint }}ms</span>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h3>资源加载测试</h3>
        <div class="button-group">
          <button @click="loadLargeImage">加载大图片</button>
          <button @click="loadMultipleResources">加载多个资源</button>
          <button @click="simulateSlowAPI">模拟慢API调用</button>
        </div>
      </div>
      
      <div class="section">
        <h3>用户交互性能</h3>
        <div class="button-group">
          <button @click="heavyComputation">重计算任务</button>
          <button @click="memoryIntensiveTask">内存密集任务</button>
          <button @click="domManipulation">DOM操作测试</button>
        </div>
      </div>
    </div>
    
    <div class="performance-log">
      <h3>性能日志</h3>
      <div class="log-container">
        <div v-for="(log, index) in performanceLogs" :key="index" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-type">{{ log.type }}</span>
          <span class="log-message">{{ log.message }}</span>
          <span class="log-duration">{{ log.duration }}ms</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const performanceMetrics = ref({
  domContentLoaded: 0,
  loadEvent: 0,
  firstPaint: 0,
  firstContentfulPaint: 0
})

const performanceLogs = ref<Array<{
  time: string
  type: string
  message: string
  duration: number
}>>([])

const addLog = (type: string, message: string, duration: number = 0) => {
  performanceLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    type,
    message,
    duration
  })
}

const measurePerformance = async (name: string, fn: () => Promise<void> | void) => {
  const start = performance.now()
  try {
    await fn()
  } finally {
    const end = performance.now()
    const duration = Math.round(end - start)
    addLog('Performance', name, duration)
  }
}

const loadLargeImage = () => {
  measurePerformance('加载大图片', () => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => resolve()
      img.src = 'https://picsum.photos/2000/2000?' + Date.now()
    })
  })
}

const loadMultipleResources = async () => {
  await measurePerformance('加载多个资源', async () => {
    const promises = Array.from({ length: 5 }, (_, i) => 
      fetch(`https://jsonplaceholder.typicode.com/posts/${i + 1}`)
        .then(r => r.json())
        .catch(() => {})
    )
    await Promise.all(promises)
  })
}

const simulateSlowAPI = async () => {
  await measurePerformance('模拟慢API调用', async () => {
    await new Promise(resolve => setTimeout(resolve, 2000))
  })
}

const heavyComputation = () => {
  measurePerformance('重计算任务', () => {
    let result = 0
    for (let i = 0; i < 10000000; i++) {
      result += Math.sqrt(i) * Math.sin(i)
    }
    console.log('计算结果:', result)
  })
}

const memoryIntensiveTask = () => {
  measurePerformance('内存密集任务', () => {
    const largeArray = Array.from({ length: 1000000 }, (_, i) => ({
      id: i,
      data: `item-${i}`,
      timestamp: Date.now(),
      random: Math.random()
    }))
    console.log('创建了大数组，长度:', largeArray.length)
  })
}

const domManipulation = () => {
  measurePerformance('DOM操作测试', () => {
    const container = document.createElement('div')
    for (let i = 0; i < 1000; i++) {
      const element = document.createElement('div')
      element.textContent = `Element ${i}`
      element.style.background = `hsl(${i % 360}, 50%, 50%)`
      container.appendChild(element)
    }
    document.body.appendChild(container)
    setTimeout(() => document.body.removeChild(container), 100)
  })
}

const getPerformanceMetrics = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    if (navigation) {
      performanceMetrics.value = {
        domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.navigationStart),
        loadEvent: Math.round(navigation.loadEventEnd - navigation.navigationStart),
        firstPaint: 0,
        firstContentfulPaint: 0
      }
    }
    
    // 获取Paint指标
    const paintEntries = performance.getEntriesByType('paint')
    paintEntries.forEach((entry) => {
      if (entry.name === 'first-paint') {
        performanceMetrics.value.firstPaint = Math.round(entry.startTime)
      } else if (entry.name === 'first-contentful-paint') {
        performanceMetrics.value.firstContentfulPaint = Math.round(entry.startTime)
      }
    })
  }
}

onMounted(() => {
  getPerformanceMetrics()
  addLog('Info', '性能监控演示页面已加载')
})
</script>

<style scoped>
.performance-demo {
  max-width: 1000px;
  margin: 0 auto;
}

.performance-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.section h3 {
  margin-top: 0;
  color: #007bff;
}

.metrics {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.metric {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
}

.metric label {
  font-weight: bold;
  color: #495057;
}

.metric span {
  color: #007bff;
  font-family: 'Courier New', monospace;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.button-group button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button-group button:hover {
  background: #0056b3;
}

.performance-log {
  margin: 3rem 0;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  background: #2d3748;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.log-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid #4a5568;
}

.log-time {
  color: #9ca3af;
  margin-right: 1rem;
  min-width: 80px;
}

.log-type {
  color: #10b981;
  margin-right: 1rem;
  font-weight: bold;
  min-width: 100px;
}

.log-message {
  color: #e2e8f0;
  flex: 1;
}

.log-duration {
  color: #f59e0b;
  margin-left: 1rem;
  font-weight: bold;
  min-width: 60px;
  text-align: right;
}
</style> 