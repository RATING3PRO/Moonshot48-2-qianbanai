// 远程Ollama API服务

import { OLLAMA_API } from '../config/api';
import { isAndroid } from '../utils/platform';

// Ollama响应接口
interface OllamaResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_duration?: number;
  eval_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
}

// 聊天历史消息接口
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// 远程Ollama服务类
export class RemoteOllamaService {
  private static _remoteURL: string | null = localStorage.getItem('remote_ollama_url');

  // 获取远程URL
  public static get remoteURL(): string | null {
    return this._remoteURL;
  }

  // 设置远程URL
  public static set remoteURL(url: string | null) {
    this._remoteURL = url;
    if (url) {
      localStorage.setItem('remote_ollama_url', url);
    } else {
      localStorage.removeItem('remote_ollama_url');
    }
  }

  // 获取当前使用的API URL
  private static getApiUrl(): string {
    // 在Android环境中，如果未设置远程URL，使用OLLAMA_API中的配置
    if (!this._remoteURL && isAndroid()) {
      // 安全地处理BASE_URL，无论是函数还是字符串
      if (typeof OLLAMA_API.BASE_URL === 'object' && OLLAMA_API.BASE_URL !== null) {
        return String(OLLAMA_API.BASE_URL);
      }
      return String(OLLAMA_API.BASE_URL);
    }
    
    const baseUrl = this._remoteURL || OLLAMA_API.BASE_URL;
    // 安全地处理不同类型的baseUrl
    let urlToUse = '';
    if (typeof baseUrl === 'object' && baseUrl !== null) {
      urlToUse = String(baseUrl);
    } else {
      urlToUse = String(baseUrl);
    }
    
    // 确保URL不以/结尾
    let cleanUrl = urlToUse.trim();
    if (cleanUrl.endsWith('/')) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    
    // 如果URL中不包含/api，添加它
    if (!cleanUrl.includes('/api')) {
      return `${cleanUrl}/api`;
    }
    
    return cleanUrl;
  }

  // 检查是否已设置远程URL
  public static hasRemoteURL(): boolean {
    return !!this._remoteURL;
  }

  // 检查URL是否有效
  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  // 发送消息到远程Ollama API
  public static async sendMessage(
    message: string, 
    history: { role: string; content: string }[] = [],
    model: string = 'gemma3:7b-instruct',
    interestPrompt: string = '' // 添加兴趣提示词参数
  ): Promise<string> {
    try {
      const apiUrl = RemoteOllamaService.getApiUrl();
      
      // 检查API URL是否有效
      if (!apiUrl) {
        throw new Error('未设置远程Ollama API地址');
      }
      
      // 构建系统提示词
      let systemPrompt = `你是一个友好、温暖的AI助手，名叫"牵伴"。你的目标是成为老年人的贴心伙伴，
提供情感支持、日常对话和实用信息。请用简单、直接、温暖的语言回应，避免过于复杂或技术性的表达。
回答应该简洁明了，避免过长的段落。使用礼貌、尊重的语气，偶尔可以使用一些适合老年人的幽默。
`;

      // 如果有兴趣提示词，添加到系统提示中
      if (interestPrompt) {
        systemPrompt += interestPrompt;
      }

      // 构建请求体
      const requestBody = {
        model: model,
        messages: [
          ...history,
          { role: 'user', content: message }
        ],
        stream: false,
        options: {
          temperature: OLLAMA_API.PARAMETERS.temperature,
          top_p: OLLAMA_API.PARAMETERS.top_p,
          num_predict: OLLAMA_API.PARAMETERS.max_tokens,
          frequency_penalty: OLLAMA_API.PARAMETERS.frequency_penalty
        }
      };

      const platform = isAndroid() ? 'Android' : '浏览器';
      console.log(`[${platform}] 使用${this._remoteURL ? '远程' : '本地'}模型 ${model} 生成回复...`, requestBody);

      // 确保URL末尾没有斜杠
      const cleanApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

      // 发送请求到Ollama API，添加CORS头和更长超时
      const response = await fetch(
        `${cleanApiUrl}/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': window.location.origin
          },
          body: JSON.stringify(requestBody),
          // 增加超时时间
          signal: AbortSignal.timeout(isAndroid() ? 90000 : 60000) // Android环境下使用更长的超时
        }
      );

      if (!response.ok) {
        console.error('Ollama API响应错误:', response.status, response.statusText);
        const text = await response.text();
        console.error('错误详情:', text);
        
        // 针对Android环境的错误信息
        if (isAndroid()) {
          return `Android应用无法连接到Ollama服务 (${response.status})。请确保：
1. 在设置中输入了正确的远程服务器地址
2. 远程服务器可以从公网访问
3. 服务器已安装并运行Ollama，且已下载模型 ${model}`;
        }
        
        return `与Ollama服务通信失败 (${response.status}): ${response.statusText}。请确保Ollama服务正在运行，且已下载模型 ${model}。`;
      }

      // 解析响应
      const data: OllamaResponse = await response.json();
      console.log('Ollama API响应:', data);
      
      // 从响应中提取文本
      if (data && data.message && data.message.content) {
        return data.message.content;
      }
      
      return '抱歉，收到了空响应。请检查Ollama服务是否正确运行，以及是否已下载模型 ' + model;
    } catch (error) {
      // 详细记录错误信息
      console.error(`[${isAndroid() ? 'Android' : '浏览器'}] 调用Ollama API失败:`, error);
      
      // 网络错误处理
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const apiType = this._remoteURL ? '远程' : '本地';
        const apiUrl = this.getApiUrl();
        
        // 针对Android的特定错误消息
        if (isAndroid()) {
          return `Android应用无法连接到${apiType}Ollama服务。请确保：
1. 已在设置中填写正确的远程服务器地址
2. 网络连接正常并能访问该服务器
3. 服务器防火墙未阻止连接`;
        }
        
        return `无法连接到${apiType}Ollama服务。请确保：
1. ${apiType === '本地' ? 'Ollama已安装并正在运行' : '远程服务器正在运行并可访问'}
2. 服务地址正确(${apiUrl})
3. ${apiType === '本地' ? '没有防火墙阻止连接' : '网络连接正常'}`;
      }
      
      // 超时错误处理
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        return isAndroid() 
          ? '与远程服务器连接超时，请确保远程服务器响应正常，或检查您的网络连接。'
          : '连接Ollama服务超时，请检查服务器负载或网络连接。';
      }
      
      return `与Ollama服务通信时出现问题: ${error instanceof Error ? error.message : String(error)}。请确保Ollama服务正在运行。`;
    }
  }

  // 测试Ollama服务连接
  public static async testConnection(testUrl?: string): Promise<{success: boolean, message: string}> {
    try {
      const url = testUrl || this.getApiUrl();
      
      if (!url) {
        return {success: false, message: '未设置API地址'};
      }
      
      if (!this.isValidUrl(url)) {
        return {success: false, message: `无效的URL格式: ${url}`};
      }
      
      // 确保URL包含/api路径
      const apiUrl = url.includes('/api') ? url : `${url}/api`;
      
      // 确保URL末尾没有斜杠
      const cleanApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
      
      console.log(`[${isAndroid() ? 'Android' : '浏览器'}] 测试Ollama连接: ${cleanApiUrl}/tags`);
      
      // 添加更多请求头以支持CORS和移动环境
      const response = await fetch(`${cleanApiUrl}/tags`, {
        headers: {
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        signal: AbortSignal.timeout(isAndroid() ? 15000 : 10000) // Android环境下使用更长的超时
      });
      
      if (response.ok) {
        return {success: true, message: `成功连接到${testUrl ? '测试' : this._remoteURL ? '远程' : '本地'}Ollama服务`};
      } else {
        return {success: false, message: `Ollama服务返回错误: ${response.status} ${response.statusText}`};
      }
    } catch (error) {
      console.error(`[${isAndroid() ? 'Android' : '浏览器'}] 测试Ollama连接失败:`, error);
      const apiType = testUrl ? '测试' : (this._remoteURL ? '远程' : '本地');
      
      // 针对Android的特定错误消息
      if (isAndroid()) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          return {success: false, message: `Android应用无法连接到${apiType}Ollama服务。请检查URL格式和服务器状态。`};
        }
        return {success: false, message: `连接测试失败: ${error instanceof Error ? error.message : String(error)}`};
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {success: false, message: `无法连接到${apiType}Ollama服务。请确保服务正在运行。`};
      }
      return {success: false, message: `连接测试失败: ${error instanceof Error ? error.message : String(error)}`};
    }
  }

  // 获取可用模型列表
  public static async getModels(): Promise<string[]> {
    try {
      const apiUrl = this.getApiUrl();
      
      if (!apiUrl) {
        console.error('未设置API地址');
        return [];
      }
      
      // 确保URL末尾没有斜杠
      const cleanApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
      
      console.log(`[${isAndroid() ? 'Android' : '浏览器'}] 获取模型列表: ${cleanApiUrl}/tags`);
      
      // 添加更多请求头以支持CORS和移动环境
      const response = await fetch(`${cleanApiUrl}/tags`, {
        headers: {
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        signal: AbortSignal.timeout(isAndroid() ? 15000 : 10000) // Android环境下使用更长的超时
      });
      
      if (!response.ok) {
        console.error('获取模型列表失败:', response.status, response.statusText);
        return [];
      }
      
      const data = await response.json();
      console.log('获取到的模型列表:', data);
      
      if (data && data.models) {
        return data.models.map((model: any) => model.name);
      }
      
      return [];
    } catch (error) {
      console.error(`[${isAndroid() ? 'Android' : '浏览器'}] 获取Ollama模型列表失败:`, error);
      return [];
    }
  }

  // 设置并验证远程URL
  public static async setAndValidateRemoteURL(url: string): Promise<{success: boolean, message: string}> {
    // 清除URL前后的空格
    const trimmedUrl = url.trim();
    
    // 检查URL格式是否有效
    if (!this.isValidUrl(trimmedUrl)) {
      return {success: false, message: '无效的URL格式。请输入完整的URL，包括http://或https://'};
    }
    
    // 测试连接
    const testResult = await this.testConnection(trimmedUrl);
    
    if (testResult.success) {
      // 连接成功，保存URL
      this.remoteURL = trimmedUrl;
      return {success: true, message: `成功连接到远程Ollama服务: ${trimmedUrl}`};
    } else {
      // 连接失败
      return testResult;
    }
  }

  // 清除远程URL设置
  public static clearRemoteURL(): void {
    this.remoteURL = null;
  }
}