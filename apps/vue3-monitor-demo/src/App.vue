<template>
  <div id="app">
    <nav class="navbar">
      <h1>Vue3 监控系统演示</h1>
      <div class="nav-links">
        <router-link to="/">首页</router-link>
        <router-link to="/error-demo">错误演示</router-link>
        <router-link to="/performance-demo">性能演示</router-link>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view />
    </main>
    
    <footer class="footer">
      <p>Powered by @hawk-tracker/core & @hawk-tracker/plugin-error</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 这里可以添加全局逻辑
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: #42b883;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar h1 {
  margin: 0;
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.footer {
  background-color: #f8f9fa;
  text-align: center;
  padding: 1rem;
  color: #6c757d;
}
</style> 