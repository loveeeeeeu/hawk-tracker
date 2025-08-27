<template>
  <div class="error-demo">
    <h1>错误监控演示</h1>
    <p>点击下面的按钮来测试不同类型的错误监控功能：</p>
    
    <div class="error-types">
      <div class="error-section">
        <h3>JavaScript 错误</h3>
        <div class="button-group">
          <button @click="triggerReferenceError">引用错误</button>
          <button @click="triggerTypeError">类型错误</button>
          <button @click="triggerSyntaxError">语法错误</button>
          <button @click="triggerRangeError">范围错误</button>
        </div>
      </div>
      
      <div class="error-section">
        <h3>Promise 错误</h3>
        <div class="button-group">
          <button @click="triggerUnhandledRejection">未处理的Promise拒绝</button>
          <button @click="triggerAsyncError">异步函数错误</button>
        </div>
      </div>
      
      <div class="error-section">
        <h3>Vue 组件错误</h3>
        <div class="button-group">
          <button @click="triggerVueError">组件渲染错误</button>
          <button @click="triggerLifecycleError">生命周期错误</button>
        </div>
      </div>
      
      <div class="error-section">
        <h3>网络错误</h3>
        <div class="button-group">
          <button @click="triggerFetchError">Fetch 错误</button>
          <button @click="triggerXHRError">XHR 错误</button>
        </div>
      </div>
      
      <div class="error-section">
        <h3>资源加载错误</h3>
        <div class="button-group">
          <button @click="triggerImageError">图片加载错误</button>
          <button @click="triggerScriptError">脚本加载错误</button>
        </div>
      </div>
    </div>
    
    <div class="error-log">
      <h3>错误日志</h3>
      <div class="log-container">
        <div v-for="(log, index) in errorLogs" :key="index" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-type">{{ log.type }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const errorLogs = ref<Array<{time: string, type: string, message: string}>>([])

const addLog = (type: string, message: string) => {
  errorLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    type,
    message
  })
}

// JavaScript 错误
const triggerReferenceError = () => {
  try {
    // @ts-ignore
    console.log(undefinedVariable.property)
  } catch (error) {
    addLog('ReferenceError', '尝试访问未定义的变量')
    throw error
  }
}

const triggerTypeError = () => {
  try {
    const obj = null
    // @ts-ignore
    obj.someMethod()
  } catch (error) {
    addLog('TypeError', '尝试调用null对象的方法')
    throw error
  }
}

const triggerSyntaxError = () => {
  try {
    eval('const obj = {')
  } catch (error) {
    addLog('SyntaxError', '执行包含语法错误的代码')
    throw error
  }
}

const triggerRangeError = () => {
  try {
    const arr = new Array(-1)
  } catch (error) {
    addLog('RangeError', '创建负长度数组')
    throw error
  }
}

// Promise 错误
const triggerUnhandledRejection = () => {
  addLog('Promise', '触发未处理的Promise拒绝')
  Promise.reject(new Error('这是一个未处理的Promise拒绝'))
}

const triggerAsyncError = async () => {
  addLog('AsyncError', '异步函数中的错误')
  throw new Error('异步函数中发生的错误')
}

// Vue 组件错误
const triggerVueError = () => {
  addLog('VueError', '触发Vue组件错误')
  throw new Error('Vue组件中的错误')
}

const triggerLifecycleError = () => {
  addLog('LifecycleError', '生命周期错误')
  // 模拟生命周期中的错误
  throw new Error('组件生命周期中的错误')
}

// 网络错误
const triggerFetchError = async () => {
  addLog('NetworkError', '触发Fetch错误')
  try {
    await fetch('https://nonexistent-domain-12345.com/api/data')
  } catch (error) {
    console.error('Fetch error:', error)
  }
}

const triggerXHRError = () => {
  addLog('XHRError', '触发XHR错误')
  const xhr = new XMLHttpRequest()
  xhr.open('GET', 'https://nonexistent-domain-12345.com/api/data')
  xhr.send()
}

// 资源加载错误
const triggerImageError = () => {
  addLog('ResourceError', '触发图片加载错误')
  const img = new Image()
  img.src = 'https://nonexistent-domain-12345.com/image.jpg'
  document.body.appendChild(img)
}

const triggerScriptError = () => {
  addLog('ScriptError', '触发脚本加载错误')
  const script = document.createElement('script')
  script.src = 'https://nonexistent-domain-12345.com/script.js'
  document.head.appendChild(script)
}

onMounted(() => {
  addLog('Info', '错误监控演示页面已加载')
})
</script>

<style scoped>
.error-demo {
  max-width: 1000px;
  margin: 0 auto;
}

.error-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.error-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #dc3545;
}

.error-section h3 {
  margin-top: 0;
  color: #dc3545;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.button-group button {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button-group button:hover {
  background: #c82333;
}

.error-log {
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
  display: block;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid #4a5568;
}

.log-time {
  color: #9ca3af;
  margin-right: 1rem;
}

.log-type {
  color: #f59e0b;
  margin-right: 1rem;
  font-weight: bold;
}

.log-message {
  color: #e2e8f0;
}
</style> 