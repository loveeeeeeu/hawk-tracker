import { Plugin } from 'vite';
import { watch } from 'fs';
import { resolve } from 'path';

export function sdkWatcherPlugin(): Plugin {
  return {
    name: 'sdk-watcher',
    configureServer(server) {
      console.log('🔄 SDK 监听插件已启动');
      
      const sdkPaths = [
        resolve(__dirname, '../../packages/core/dist'),
        resolve(__dirname, '../../packages/plugin-error/dist'),
      ];

      sdkPaths.forEach((path, index) => {
        const packageName = index === 0 ? 'core' : 'plugin-error';
        
        watch(path, { recursive: true }, (eventType, filename) => {
          if (filename && (filename.endsWith('.js') || filename.endsWith('.mjs'))) {
            console.log(` ${packageName} 包文件变化: ${filename}`);
            
            // 只清除 SDK 相关的模块缓存
            const moduleGraph = server.moduleGraph;
            for (const [id, module] of moduleGraph.idToModuleMap) {
              if (id.includes('@hawk-tracker/core') || id.includes('@hawk-tracker/plugin-error')) {
                moduleGraph.invalidateModule(module);
              }
            }
            
            // 触发页面完全刷新
            server.ws.send({
              type: 'full-reload',
              path: '*',
            });
            
            console.log(`✅ 已清除 SDK 缓存并触发浏览器刷新`);
          }
        });
        
        console.log(` 正在监听 ${packageName} 包: ${path}`);
      });
    },
  };
}