const KoaRouter = require('@koa/router');

// 定义数据存储类型
interface DataStore {
  events: any[];
  errors: any[];
  performance: any[];
  behaviors: any[];
}

// 从外部导入数据存储
let dataStore: DataStore;

// 延迟初始化数据存储
function getDataStore(): DataStore {
  if (!dataStore) {
    dataStore = {
      events: [],
      errors: [],
      performance: [],
      behaviors: []
    };
  }
  return dataStore;
}

const router = new KoaRouter();

// 基础路由
router.get('/', (ctx: any) => {
  ctx.body = {
    message: 'Hawk Tracker Server',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  };
});

// 健康检查
router.get('/health', (ctx: any) => {
  ctx.body = {
    status: 'healthy',
    timestamp: new Date().toISOString()
  };
});

// API路由组
const apiRouter = new KoaRouter({ prefix: '/api' });

// 通用数据接收端点 - SDK 会发送到这里
apiRouter.post('/', async (ctx: any) => {
  try {
    const data = ctx.request.body;
    console.log('📦 收到 SDK 数据包:', data);
    
    // 解析 SDK 发送的数据结构
    const { dataQueue = [], baseInfo = {} } = data;
    
    if (!Array.isArray(dataQueue)) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: '数据格式错误：dataQueue 必须是数组'
      };
      return;
    }
    
    // 处理数据队列中的每个项目
    for (const item of dataQueue) {
      const { type, subType, ...itemData } = item;
      
      // 根据类型分发到不同的存储
      switch (type) {
        case 'error':
          const errorData = {
            ...itemData,
            id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            receivedAt: new Date().toISOString(),
            subType,
            baseInfo
          };
          getDataStore().errors.push(errorData);
          console.log('❌ 处理错误数据:', errorData);
          break;
          
        case 'performance':
          const perfData = {
            ...itemData,
            id: `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            receivedAt: new Date().toISOString(),
            subType,
            baseInfo
          };
          getDataStore().performance.push(perfData);
          console.log('⚡ 处理性能数据:', perfData);
          break;
          
        case 'behavior':
          const behaviorData = {
            ...itemData,
            id: `behavior_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            receivedAt: new Date().toISOString(),
            subType,
            baseInfo
          };
          getDataStore().behaviors.push(behaviorData);
          console.log('🎯 处理行为数据:', behaviorData);
          break;
          
        default:
          const eventData = {
            ...itemData,
            id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            receivedAt: new Date().toISOString(),
            type,
            subType,
            baseInfo
          };
          getDataStore().events.push(eventData);
          console.log('📊 处理事件数据:', eventData);
          break;
      }
    }
    
    ctx.body = {
      success: true,
      message: `成功处理 ${dataQueue.length} 条数据`,
      processed: dataQueue.length
    };
  } catch (error) {
    console.error('❌ 处理 SDK 数据失败:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: '服务器内部错误'
    };
  }
});

// 接收埋点数据
apiRouter.post('/track', async (ctx: any) => {
  try {
    const data = ctx.request.body;
    const eventData = {
      ...data,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      receivedAt: new Date().toISOString()
    };
    
    getDataStore().events.push(eventData);
    console.log('📊 收到埋点数据:', eventData);
    
    ctx.body = {
      success: true,
      message: '数据接收成功',
      dataId: eventData.id
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      error: '数据格式错误'
    };
  }
});

// 接收错误数据
apiRouter.post('/error', async (ctx: any) => {
  try {
    const data = ctx.request.body;
    const errorData = {
      ...data,
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      receivedAt: new Date().toISOString()
    };
    
    getDataStore().errors.push(errorData);
    console.log('❌ 收到错误数据:', errorData);
    
    ctx.body = {
      success: true,
      message: '错误数据接收成功',
      dataId: errorData.id
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      error: '数据格式错误'
    };
  }
});

// 接收性能数据
apiRouter.post('/performance', async (ctx: any) => {
  try {
    const data = ctx.request.body;
    const perfData = {
      ...data,
      id: `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      receivedAt: new Date().toISOString()
    };
    
    getDataStore().performance.push(perfData);
    console.log('⚡ 收到性能数据:', perfData);
    
    ctx.body = {
      success: true,
      message: '性能数据接收成功',
      dataId: perfData.id
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      error: '数据格式错误'
    };
  }
});

// 接收用户行为数据
apiRouter.post('/behavior', async (ctx: any) => {
  try {
    const data = ctx.request.body;
    const behaviorData = {
      ...data,
      id: `behavior_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      receivedAt: new Date().toISOString()
    };
    
    getDataStore().behaviors.push(behaviorData);
    console.log('🎯 收到用户行为数据:', behaviorData);
    
    ctx.body = {
      success: true,
      message: '用户行为数据接收成功',
      dataId: behaviorData.id
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      error: '数据格式错误'
    };
  }
});

// 获取所有数据（供前端查询）
apiRouter.get('/data', async (ctx: any) => {
  const { type = 'all', limit = 100, page = 1 } = ctx.query;
  
  let data: any[] = [];
  let total = 0;
  const store = getDataStore();
  
  switch (type) {
    case 'events':
      data = store.events;
      break;
    case 'errors':
      data = store.errors;
      break;
    case 'performance':
      data = store.performance;
      break;
    case 'behaviors':
      data = store.behaviors;
      break;
    default:
      data = [
        ...store.events.map((item: any) => ({ ...item, type: 'event' })),
        ...store.errors.map((item: any) => ({ ...item, type: 'error' })),
        ...store.performance.map((item: any) => ({ ...item, type: 'performance' })),
        ...store.behaviors.map((item: any) => ({ ...item, type: 'behavior' }))
      ];
  }
  
  // 按时间倒序排列
  data.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
  
  total = data.length;
  
  // 分页
  const start = (parseInt(page as string) - 1) * parseInt(limit as string);
  const end = start + parseInt(limit as string);
  const paginatedData = data.slice(start, end);
  
  ctx.body = {
    success: true,
    data: {
      list: paginatedData,
      total,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(total / parseInt(limit as string))
    }
  };
});

// 获取统计数据
apiRouter.get('/stats', async (ctx: any) => {
  const store = getDataStore();
  const stats = {
    events: store.events.length,
    errors: store.errors.length,
    performance: store.performance.length,
    behaviors: store.behaviors.length,
    total: store.events.length + store.errors.length + store.performance.length + store.behaviors.length
  };
  
  ctx.body = {
    success: true,
    data: stats
  };
});

// 清空数据（开发用）
apiRouter.delete('/data', async (ctx: any) => {
  const store = getDataStore();
  store.events = [];
  store.errors = [];
  store.performance = [];
  store.behaviors = [];
  
  ctx.body = {
    success: true,
    message: '数据已清空'
  };
});

// 使用API路由
router.use(apiRouter.routes());
router.use(apiRouter.allowedMethods());

export default router;
