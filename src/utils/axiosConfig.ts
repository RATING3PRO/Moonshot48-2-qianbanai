import axios from 'axios';
import { isAndroid } from '../utils/platform';
import { Toast } from 'antd-mobile';

// 获取适合当前环境的API基础URL
const getBaseUrl = () => {
  // 尝试从本地存储读取自定义服务器地址
  const customServerUrl = localStorage.getItem('custom_server_url');
  if (customServerUrl) {
    console.log('使用自定义服务器地址:', customServerUrl);
    return customServerUrl;
  }

  // 在Android环境中，不能使用localhost，需要使用实际IP地址或域名
  if (isAndroid()) {
    // 部署在本地局域网的服务器地址 - 使用您的电脑在局域网中的IP地址
    // 请替换为您电脑的实际IP地址，确保手机和电脑在同一个WiFi网络下
    return 'http://192.168.0.196:5000';
  }
  // 在开发环境中使用localhost
  return 'http://localhost:5000';
};

// 配置axios基础URL，确保请求发送到正确的后端
axios.defaults.baseURL = getBaseUrl();

// 超时时间设置为10秒
axios.defaults.timeout = 10000;

// 添加调试日志
console.log(`[${isAndroid() ? 'Android' : 'Web'}] API基础URL: ${axios.defaults.baseURL}`);

// 检查服务器健康状态
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    await axios.get('/api/health', { timeout: 3000 });
    return true;
  } catch (error) {
    console.error('服务器健康检查失败:', error);
    return false;
  }
};

// 检查是否是游客模式
const isGuestMode = () => {
  return localStorage.getItem('isGuest') === 'true';
};

// 配置axios请求拦截器，自动添加token到请求头
axios.interceptors.request.use(
  (config) => {
    console.log('发起请求:', config.method?.toUpperCase(), config.url);
    
    // 如果是游客模式，跳过需要认证的请求
    if (isGuestMode() && config.url?.startsWith('/api/') && 
        !config.url.includes('/public/') && 
        !config.url.includes('/auth/') &&
        !config.url.includes('/health')) {
      
      console.log('游客模式 - 模拟数据请求:', config.url);
      
      // 对于某些请求，直接返回模拟数据，防止发送到服务器
      if (config.url.includes('/user/') || config.url.includes('/profile/')) {
        throw {
          response: {
            status: 200,
            data: {
              success: true,
              data: { 
                guest: true,
                message: '游客模式下不可用' 
              }
            }
          },
          isGuest: true
        };
      }
    }
    
    // 优先从localStorage获取token，其次从sessionStorage获取
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('请求携带授权token');
    }
    
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器，处理401未授权错误和登录成功
axios.interceptors.response.use(
  (response) => {
    console.log('收到响应:', response.status, response.config.url);
    
    // 如果是登录请求，保存token和用户信息
    if (response.config.url === '/api/auth/login' && response.data.success) {
      const { token, user } = response.data.data;
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      
      console.log('登录成功，保存用户信息，用户ID:', user.id);
      
      // 清除游客模式标记
      localStorage.removeItem('isGuest');
      
      // 根据是否记住我，决定存储位置
      if (rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id.toString());
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userData', JSON.stringify(user)); // 同时保存到userData
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userId', user.id.toString());
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('userData', JSON.stringify(user)); // 同时保存到userData
      }
    }
    
    // 如果是注册请求并成功，也保存相关信息
    if (response.config.url === '/api/auth/register' && response.data.success) {
      const { token, user } = response.data.data;
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      
      // 清除游客模式标记
      localStorage.removeItem('isGuest');
      
      if (rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id.toString());
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userData', JSON.stringify(user)); // 同时保存到userData
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userId', user.id.toString());
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('userData', JSON.stringify(user)); // 同时保存到userData
      }
    }
    
    return response;
  },
  (error) => {
    // 游客模式模拟响应
    if (error.isGuest) {
      return Promise.resolve(error.response);
    }
    
    console.error('响应错误:', error);
    
    if (error.response) {
      console.error('错误状态码:', error.response.status);
      console.error('错误详情:', error.response.data);
    }
    
    // 网络错误特殊处理
    if (error.message && error.message.includes('Network Error')) {
      console.error('网络连接失败，可能是后端服务不可用或网络问题');
      
      // 在Android环境中提供更具体的错误信息
      if (isAndroid()) {
        Toast.show({
          icon: 'fail',
          content: '连接服务器失败，请检查网络设置或服务器状态',
          duration: 3000,
        });
      } else {
        Toast.show({
          icon: 'fail',
          content: '网络连接失败，请检查后端服务是否启动',
          duration: 3000,
        });
      }
    }
    
    // 请求超时处理
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      Toast.show({
        icon: 'fail',
        content: '请求超时，服务器响应时间过长',
        duration: 3000,
      });
    }
    
    if (error.response && error.response.status === 401) {
      console.log('检测到401未授权错误，清除登录信息');
      // 清除存储的用户信息和token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userData');
      localStorage.removeItem('userId');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userData');
      sessionStorage.removeItem('userId');
      
      // 如果不是游客模式，重定向到登录页
      if (!isGuestMode()) {
        Toast.show({
          content: '登录已过期，请重新登录',
          duration: 2000,
        });
        
        // 为防止循环重定向，加入延迟
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    }
    return Promise.reject(error);
  }
);

// 设置自定义服务器地址的函数
export const setCustomServerUrl = (url: string) => {
  if (url && url.trim()) {
    localStorage.setItem('custom_server_url', url.trim());
    axios.defaults.baseURL = url.trim();
    console.log('已设置自定义服务器地址:', url.trim());
  } else {
    localStorage.removeItem('custom_server_url');
    axios.defaults.baseURL = getBaseUrl();
    console.log('已恢复默认服务器地址:', axios.defaults.baseURL);
  }
};

export default axios; 