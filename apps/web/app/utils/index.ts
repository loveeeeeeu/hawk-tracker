//拼接多个css类名，并且会自动过滤掉空值，假值
// 类型定义，方便类型检查
type ClassValue = string | boolean | undefined | null;

// cn 函数定义
export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ');
}
