import { getCookie, generateUUID, getTimestamp } from './common';
import { SESSION_KEY, SURVIVIE_MILLI_SECONDS } from '../common/constant';

export function getOrCreateSessionId(): string {
  return getCookie(SESSION_KEY) || refreshSession();
}

/**
 * 获取会话ID
 * @returns
 */
export function getSessionId(): string {
  return getCookie(SESSION_KEY) || refreshSession();
}
/**
 * 刷新会话存续期
 */
function refreshSession() {
  const id = getCookie(SESSION_KEY) || `s_${generateUUID()}`;
  const expires = new Date(getTimestamp() + SURVIVIE_MILLI_SECONDS);
  document.cookie = `${SESSION_KEY}=${id};path=/;max-age=1800;expires=${expires.toUTCString()}`;
  return id;
}
