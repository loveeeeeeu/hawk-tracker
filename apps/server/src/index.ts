import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import router from './router';
import { gunzip } from 'zlib';
import { promisify } from 'util';

const gunzipAsync = promisify(gunzip);

const app = new Koa();

// 中间件
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);
// 原始数据处理中间件
app.use(async (ctx, next) => {
  if (ctx.path === '/api' && ctx.method === 'POST') {
    // 获取原始Buffer数据
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve) => {
      ctx.req.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });
      ctx.req.on('end', () => {
        resolve();
      });
    });
    
    const rawBuffer = Buffer.concat(chunks);
    console.log('📦 原始Buffer长度:', rawBuffer.length);
    console.log('📦 Content-Type:', ctx.headers['content-type']);
    console.log('📦 原始数据前20字节(hex):', rawBuffer.slice(0, 20).toString('hex'));
    
    // 检查Content-Encoding头
    const contentEncoding = ctx.headers['content-encoding'];
    console.log('📦 Content-Encoding:', contentEncoding);
    
    // 检查是否是gzip数据（以1f 8b开头）
    if (contentEncoding === 'gzip' || (rawBuffer.length >= 2 && rawBuffer[0] === 0x1f && rawBuffer[1] === 0x8b)) {
      console.log('🔍 检测到gzip压缩数据，正在解压...');
      try {
        const decompressed = await gunzipAsync(rawBuffer);
        const jsonData = decompressed.toString('utf8');
        console.log('✅ gzip解压成功，数据长度:', jsonData.length);
        console.log('📦 解压后的JSON数据:', jsonData.substring(0, 200) + '...');
        
        ctx.request.body = JSON.parse(jsonData);
        console.log('✅ JSON解析成功');
      } catch (error) {
        console.error('❌ gzip解压或JSON解析失败:', error);
        ctx.request.body = { rawData: rawBuffer.toString('base64') };
      }
    } else {
      // 尝试直接解析为JSON
      try {
        const jsonString = rawBuffer.toString('utf8');
        ctx.request.body = JSON.parse(jsonString);
        console.log('✅ 直接JSON解析成功');
      } catch (error) {
        console.log('❌ JSON解析失败，保存原始数据');
        ctx.request.body = { rawData: rawBuffer.toString('base64') };
      }
    }
  }
  await next();
});

app.use(bodyParser({
  enableTypes: ['json', 'form', 'text'],
  jsonLimit: '10mb',
  formLimit: '10mb',
  textLimit: '10mb',
  strict: false,
  onerror: function (err, ctx) {
    console.error('Body parser error:', err);
    ctx.throw(422, 'body parse error');
  }
}));

// 请求日志
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`);
});

// 错误处理
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err: any) {
    ctx.status = err.status || 500;
    ctx.body = {
      success: false,
      error: err.message || 'Internal Server Error',
    };
    console.error('Server Error:', err);
  }
});

// 路由
app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📊 API endpoints available at http://localhost:${port}/api`);
});
