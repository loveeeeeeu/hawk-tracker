import { HawkTracker } from '../index';
// 声明一个模块，扩展 window 接口
declare global {
  interface Window {
    hawkTracker: HawkTracker;
    _hawkTrackerInit_: boolean;
  }
}
