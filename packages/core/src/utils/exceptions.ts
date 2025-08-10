import { VoidFun } from '../types/common';

/**
 * try catch的封装
 * @param fn
 * @param errFn
 */
export function nativeTryCatch(fn: VoidFun, errFn?: (err: any) => void): void {
  try {
    fn();
  } catch (err) {
    if (errFn) {
      errFn(err);
    }
  }
}
