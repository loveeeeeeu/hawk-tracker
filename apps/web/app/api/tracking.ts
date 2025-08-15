import type {
  TrackingEvent,
  CreateTrackingEventPayload,
  UpdateTrackingEventPayload,
} from '@/types/tracking';

// 模拟数据存储
let mockTrackingEvents: TrackingEvent[] = [
  {
    id: '1',
    name: '加入购物车',
    identifier: 'cart_add',
    type: 'click',
    description: '用户点击加入购物车按钮',
    active: true,
    projectId: '1',
    createdAt: '2023-01-01',
  },
  {
    id: '2',
    name: '商品详情浏览',
    identifier: 'item_view',
    type: 'pageview',
    description: '用户浏览商品详情页',
    active: true,
    projectId: '1',
    createdAt: '2023-01-02',
  },
  {
    id: '3',
    name: '支付成功',
    identifier: 'payment_succ',
    type: 'custom',
    description: '用户完成支付',
    active: false,
    projectId: '1',
    createdAt: '2023-01-03',
  },
];

// 格式化日期
function formatDate(date: string): string {
  return new Date(date).toISOString().split('T')[0] || '';
}

// 获取项目的所有埋点事件
export async function getTrackingEvents(
  projectId: string,
): Promise<TrackingEvent[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const events = mockTrackingEvents.filter(
        (event) => event.projectId === projectId,
      );
      resolve(
        events.map((event) => ({
          ...event,
          createdAt: formatDate(event.createdAt),
        })),
      );
    }, 300);
  });
}

// 创建埋点事件
export async function createTrackingEvent(
  projectId: string,
  data: CreateTrackingEventPayload,
): Promise<TrackingEvent> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEvent: TrackingEvent = {
        id: Date.now().toString(),
        ...data,
        active: true,
        projectId,
        createdAt: formatDate(new Date().toISOString()),
      };
      mockTrackingEvents.push(newEvent);
      resolve(newEvent);
    }, 300);
  });
}

// 更新埋点事件
export async function updateTrackingEvent(
  id: string,
  data: UpdateTrackingEventPayload,
): Promise<TrackingEvent> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTrackingEvents.findIndex((e) => e.id === id);
      if (index === -1) {
        reject(new Error('事件不存在'));
        return;
      }

      const currentEvent = mockTrackingEvents[index]!;
      const updatedEvent: TrackingEvent = {
        ...currentEvent,
        name: data.name !== undefined ? data.name : currentEvent.name,
        identifier:
          data.identifier !== undefined
            ? data.identifier
            : currentEvent.identifier,
        type: data.type !== undefined ? data.type : currentEvent.type,
        description:
          data.description !== undefined
            ? data.description
            : currentEvent.description,
        active: data.active !== undefined ? data.active : currentEvent.active,
      };

      mockTrackingEvents[index] = updatedEvent;
      resolve(updatedEvent);
    }, 300);
  });
}

// 删除埋点事件
export async function deleteTrackingEvent(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTrackingEvents.findIndex((e) => e.id === id);
      if (index === -1) {
        reject(new Error('事件不存在'));
        return;
      }
      mockTrackingEvents.splice(index, 1);
      resolve();
    }, 300);
  });
}

// 切换事件状态
export async function toggleTrackingEventStatus(
  id: string,
): Promise<TrackingEvent> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTrackingEvents.findIndex((e) => e.id === id);
      if (index === -1) {
        reject(new Error('事件不存在'));
        return;
      }

      const currentEvent = mockTrackingEvents[index]!;
      const updatedEvent: TrackingEvent = {
        ...currentEvent,
        active: !currentEvent.active,
      };

      mockTrackingEvents[index] = updatedEvent;
      resolve(updatedEvent);
    }, 300);
  });
}
