// Ollama API服务

import { OLLAMA_API } from '../config/api';

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

// 当前使用的服务URL索引
let currentServerIndex = 0;

// Ollama服务类
export class OllamaService {
  // 获取当前服务URL
  private static getCurrentServerUrl(): string {
    if (currentServerIndex === 0) {
      return OLLAMA_API.BASE_URL;
    } else if (OLLAMA_API.BACKUP_URLS && OLLAMA_API.BACKUP_URLS.length > 0) {
      // 使用备用URL
      const index = currentServerIndex - 1;
      if (index < OLLAMA_API.BACKUP_URLS.length) {
        return OLLAMA_API.BACKUP_URLS[index];
      }
    }
    
    // 如果索引超出范围，重置为主URL
    currentServerIndex = 0;
    return OLLAMA_API.BASE_URL;
  }
  
  // 切换到下一个服务URL
  private static switchToNextServer(): string {
    // 计算备用URL的总数
    const totalUrls = 1 + (OLLAMA_API.BACKUP_URLS ? OLLAMA_API.BACKUP_URLS.length : 0);
    
    // 切换到下一个URL
    currentServerIndex = (currentServerIndex + 1) % totalUrls;
    
    // 返回当前URL
    return OllamaService.getCurrentServerUrl();
  }
  
  // 发送消息到Ollama并获取响应
  public static async sendMessage(
    message: string, 
    history: { role: string; content: string }[] = [],
    model: string = 'gemma3:7b-instruct',
    interestPrompt: string = '' // 添加兴趣提示词参数
  ): Promise<string> {
    // 记录初始服务器索引
    const initialServerIndex = currentServerIndex;
    // 尝试次数计数
    let attempts = 0;
    
    // 最多尝试所有可用的服务器
    const maxAttempts = 1 + (OLLAMA_API.BACKUP_URLS ? OLLAMA_API.BACKUP_URLS.length : 0);
    
    while (attempts < maxAttempts) {
      try {
        attempts++;
        // 获取当前服务URL
        const serverUrl = OllamaService.getCurrentServerUrl();
        console.log(`尝试使用服务器 ${serverUrl} 生成回复 (尝试 ${attempts}/${maxAttempts})...`);
        
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

        console.log(`使用模型 ${model} 生成回复...`, requestBody);

        // 发送请求到Ollama API
        const response = await fetch(
          `${serverUrl}/chat`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
            // 增加超时时间
            signal: AbortSignal.timeout(60000) // 增加到60秒超时
          }
        );

        if (!response.ok) {
          console.error('Ollama API响应错误:', response.status, response.statusText);
          const text = await response.text();
          console.error('错误详情:', text);
          
          // 如果服务器返回错误，尝试下一个服务器
          if (attempts < maxAttempts) {
            console.log(`切换到下一个服务器...`);
            OllamaService.switchToNextServer();
            continue;
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
        console.error('调用Ollama API失败:', error);
        
        // 超时或网络错误时，尝试切换服务器
        if ((error instanceof DOMException && error.name === 'TimeoutError') || 
            (error instanceof TypeError && error.message.includes('fetch'))) {
          
          // 如果还有其他服务器可以尝试
          if (attempts < maxAttempts) {
            console.log(`连接失败，切换到下一个服务器...`);
            OllamaService.switchToNextServer();
            continue;
          }
        }
        
        // 已尝试所有服务器仍然失败
        // 重置为初始服务器
        currentServerIndex = initialServerIndex;
        
        // 网络错误处理
        if (error instanceof TypeError && error.message.includes('fetch')) {
          return `无法连接到Ollama服务。请确保：
1. Ollama已安装并正在运行
2. 服务地址正确(已尝试 ${attempts} 个不同地址)
3. 没有防火墙阻止连接`;
        }
        
        // 超时错误处理
        if (error instanceof DOMException && error.name === 'TimeoutError') {
          return `连接Ollama服务超时。可能原因：
1. 服务器负载过高
2. 网络连接不稳定
3. 模型大小超出服务器处理能力

请尝试以下解决方案：
• 刷新页面重试
• 检查Ollama服务是否正常运行
• 尝试使用较小的模型（如gemma3:7b-instruct）`;
        }
        
        return `与Ollama服务通信时出现问题: ${error instanceof Error ? error.message : String(error)}。请确保Ollama服务正在运行。`;
      }
    }
    
    // 所有尝试都失败，重置服务器索引
    currentServerIndex = initialServerIndex;
    return `无法连接到任何Ollama服务。已尝试 ${attempts} 个不同地址，但都无法连接。请检查您的网络连接或Ollama服务状态。`;
  }

  // 测试Ollama服务连接
  public static async testConnection(): Promise<{success: boolean, message: string}> {
    // 记录初始服务器索引
    const initialServerIndex = currentServerIndex;
    // 尝试次数计数
    let attempts = 0;
    
    // 最多尝试所有可用的服务器
    const maxAttempts = 1 + (OLLAMA_API.BACKUP_URLS ? OLLAMA_API.BACKUP_URLS.length : 0);
    
    while (attempts < maxAttempts) {
      try {
        attempts++;
        // 获取当前服务URL
        const serverUrl = OllamaService.getCurrentServerUrl();
        console.log(`测试连接服务器 ${serverUrl} (尝试 ${attempts}/${maxAttempts})...`);
        
        const response = await fetch(`${serverUrl}/tags`, {
          signal: AbortSignal.timeout(10000) // 增加到10秒超时
        });
        
        if (response.ok) {
          // 连接成功，更新当前服务器索引为成功的服务器
          return {success: true, message: `成功连接到Ollama服务 (${serverUrl})`};
        } else {
          console.log(`服务器 ${serverUrl} 返回错误: ${response.status}，尝试下一个服务器...`);
          
          // 如果还有其他服务器可以尝试
          if (attempts < maxAttempts) {
            OllamaService.switchToNextServer();
            continue;
          }
          
          // 所有服务器都失败
          currentServerIndex = initialServerIndex;
          return {success: false, message: `所有Ollama服务均返回错误，最后尝试的服务器返回: ${response.status} ${response.statusText}`};
        }
      } catch (error) {
        console.error('测试Ollama连接失败:', error);
        
        // 超时或网络错误时，尝试切换服务器
        if ((error instanceof DOMException && error.name === 'TimeoutError') || 
            (error instanceof TypeError && error.message.includes('fetch'))) {
          
          // 如果还有其他服务器可以尝试
          if (attempts < maxAttempts) {
            console.log(`连接失败，切换到下一个服务器...`);
            OllamaService.switchToNextServer();
            continue;
          }
        }
        
        // 已尝试所有服务器仍然失败
        // 重置为初始服务器
        currentServerIndex = initialServerIndex;
        
        if (error instanceof TypeError && error.message.includes('fetch')) {
          return {success: false, message: `无法连接到任何Ollama服务。已尝试 ${attempts} 个不同地址，但都无法连接。`};
        }
        
        // 添加超时错误的专门处理
        if (error instanceof DOMException && error.name === 'TimeoutError') {
          return {success: false, message: `连接Ollama服务超时。请检查服务是否启动或尝试重启Ollama服务。`};
        }
        
        return {success: false, message: `连接测试失败: ${error instanceof Error ? error.message : String(error)}`};
      }
    }
    
    // 所有尝试都失败
    currentServerIndex = initialServerIndex;
    return {success: false, message: `无法连接到任何Ollama服务。已尝试 ${attempts} 个不同地址，但都无法连接。`};
  }

  // 获取可用模型列表
  public static async getModels(): Promise<string[]> {
    // 记录初始服务器索引
    const initialServerIndex = currentServerIndex;
    // 尝试次数计数
    let attempts = 0;
    
    // 最多尝试所有可用的服务器
    const maxAttempts = 1 + (OLLAMA_API.BACKUP_URLS ? OLLAMA_API.BACKUP_URLS.length : 0);
    
    while (attempts < maxAttempts) {
      try {
        attempts++;
        // 获取当前服务URL
        const serverUrl = OllamaService.getCurrentServerUrl();
        console.log(`获取模型列表从服务器 ${serverUrl} (尝试 ${attempts}/${maxAttempts})...`);
        
        const response = await fetch(`${serverUrl}/tags`, {
          signal: AbortSignal.timeout(15000) // 增加到15秒超时
        });
        
        if (!response.ok) {
          console.error('获取模型列表失败:', response.status, response.statusText);
          
          // 如果还有其他服务器可以尝试
          if (attempts < maxAttempts) {
            console.log(`切换到下一个服务器...`);
            OllamaService.switchToNextServer();
            continue;
          }
          
          // 所有服务器都失败
          currentServerIndex = initialServerIndex;
          return [];
        }
        
        const data = await response.json();
        console.log('获取到的模型列表:', data);
        
        if (data && data.models) {
          return data.models.map((model: any) => model.name);
        }
        
        return [];
      } catch (error) {
        console.error('获取Ollama模型列表失败:', error);
        
        // 超时或网络错误时，尝试切换服务器
        if ((error instanceof DOMException && error.name === 'TimeoutError') || 
            (error instanceof TypeError && error.message.includes('fetch'))) {
          
          // 如果还有其他服务器可以尝试
          if (attempts < maxAttempts) {
            console.log(`连接失败，切换到下一个服务器...`);
            OllamaService.switchToNextServer();
            continue;
          }
        }
        
        // 已尝试所有服务器仍然失败
        // 重置为初始服务器
        currentServerIndex = initialServerIndex;
        return [];
      }
    }
    
    // 所有尝试都失败
    currentServerIndex = initialServerIndex;
    return [];
  }
} 