/**
 * 平台检测工具，用于判断应用运行的平台环境
 */

/**
 * 检测当前是否在Android环境中运行
 * @returns {boolean} 如果在Android环境中运行，返回true，否则返回false
 */
export const isAndroid = (): boolean => {
  // Capacitor在Android环境中会设置特定的全局对象
  return typeof (window as any).androidBridge !== 'undefined' || 
    // 检查用户代理
    /android/i.test(navigator.userAgent) || 
    // Capacitor的平台信息
    (window as any).Capacitor?.getPlatform() === 'android';
};

/**
 * 检测当前是否在iOS环境中运行
 * @returns {boolean} 如果在iOS环境中运行，返回true，否则返回false
 */
export const isIOS = (): boolean => {
  // 检查iOS特定标识
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iOS 13+ 上的iPad检测
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
    // Capacitor的平台信息
    (window as any).Capacitor?.getPlatform() === 'ios';
};

/**
 * 检测当前是否在原生移动应用中运行（Android或iOS）
 * @returns {boolean} 如果在移动应用中运行，返回true，否则返回false
 */
export const isNative = (): boolean => {
  return isAndroid() || isIOS() || 
    // Capacitor的环境检测
    !!(window as any).Capacitor;
};

/**
 * 检测当前是否在浏览器环境中运行
 * @returns {boolean} 如果在浏览器中运行，返回true，否则返回false
 */
export const isBrowser = (): boolean => {
  return !isNative() && typeof window !== 'undefined';
};

/**
 * 获取当前运行平台名称
 * @returns {string} 当前运行平台的名称：'android', 'ios', 'web'或'unknown'
 */
export const getPlatform = (): string => {
  if (isAndroid()) return 'android';
  if (isIOS()) return 'ios';
  if (isBrowser()) return 'web';
  return 'unknown';
}; 