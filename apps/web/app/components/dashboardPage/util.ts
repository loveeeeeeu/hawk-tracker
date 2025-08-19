// apps/web/app/dashboardPage/utils.ts
import { useState, useEffect } from 'react';

// 数据类型定义
export type MetricCard = {
  id: string;
  title: string;
  description: string;
  value: string | number;
  metric: string;
  badge: string;
};

// Mock 数据（开发环境用）
const MOCK_METRICS: MetricCard[] = [
  {
    id: 'active-users',
    title: '活跃用户数',
    description: 'The number of active users',
    value: '1,284',
    metric: 'UV',
    badge: 'UV',
  },
  {
    id: 'page-views',
    title: '页面浏览量',
    description: 'Total page views',
    value: '5,678',
    metric: 'PV',
    badge: 'PV',
  },
  {
    id: 'new-events',
    title: '新增事件数',
    description: 'Number of new events',
    value: '65%',
    metric: 'PP%',
    badge: 'EV',
  },
  {
    id: 'errors',
    title: '最新上报的错误',
    description: 'Recently reported errors',
    value: 12,
    metric: '个',
    badge: 'ER',
  },
];

// 环境判断（可根据实际项目调整）
const isDev = process.env.NODE_ENV === 'development';

// 自定义 Hook 核心逻辑
export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0); // 重试计数

  // 实际 API 请求函数（生产环境用）
  const fetchRealData = async () => {
    try {
      // 替换为真实后端接口
      const response = await fetch('/api/');
      if (!response.ok) throw new Error(`HTTP 错误: ${response.status}`);
      const data = await response.json();
      setMetrics(data); // 假设后端返回结构与 MetricCard[] 一致
    } catch (err: any) {
      throw new Error(`获取数据失败: ${err.message}`);
    }
  };

  // 数据获取统一入口
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isDev) {
        // 开发环境用 Mock 数据（模拟延迟）
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setMetrics(MOCK_METRICS);
      } else {
        // 生产环境调用真实 API
        await fetchRealData();
      }
    } catch (err: any) {
      setError(err.message);
      // 自动重试（最多3次）
      if (retryCount < 3) {
        setRetryCount((prev) => prev + 1);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 重试间隔
        await fetchData(); // 递归重试
      }
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchData();
  }, []);

  // 手动刷新
  const refreshData = async () => {
    setRetryCount(0); // 重置重试计数
    await fetchData();
  };

  return {
    metrics,
    loading,
    error,
    refreshData,
  };
}
