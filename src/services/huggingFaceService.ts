// Hugging Face API服务

import { HUGGINGFACE_API } from '../config/api';

// 聊天消息接口
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Hugging Face服务类
export class HuggingFaceService {
  private static _selectedModel: string = localStorage.getItem('hf_selected_model') || HUGGINGFACE_API.MODELS.DEFAULT;

  // 获取选中的模型
  public static getSelectedModel(): string {
    return this._selectedModel;
  }

  // 设置选中的模型
  public static setSelectedModel(modelId: string): void {
    this._selectedModel = modelId;
    localStorage.setItem('hf_selected_model', modelId);
  }

  // 获取可用模型列表
  public static getAvailableModels(): {id: string, name: string}[] {
    return [
      { id: HUGGINGFACE_API.MODELS.TINY_LLAMA, name: 'TinyLlama-1.1B (小型英文模型)' },
      { id: HUGGINGFACE_API.MODELS.GEMMA_2B, name: 'Gemma-2B (谷歌小型模型)' },
      { id: HUGGINGFACE_API.MODELS.BLOOMZ_560M, name: 'BLOOMZ-560M (超小型多语言)' },
      { id: HUGGINGFACE_API.MODELS.CHAT_GLM, name: 'ChatGLM3-6B (中文为主)' },
      { id: HUGGINGFACE_API.MODELS.MISTRAL, name: 'Mistral-7B (高性能英文)' }
    ];
  }

  // 发送消息到Hugging Face API
  public static async sendMessage(
    message: string, 
    history: ChatMessage[] = [], 
    modelId?: string,
    interestPrompt: string = '' // 添加兴趣提示词参数
  ): Promise<string> {
    try {
      // 使用提供的模型ID或默认模型
      const model = modelId || this._selectedModel;
      
      // 构建系统提示词
      let systemPrompt = `你是一个友好、温暖的AI助手，名叫"牵伴"。你的目标是成为老年人的贴心伙伴，
提供情感支持、日常对话和实用信息。请用简单、直接、温暖的语言回应，避免过于复杂或技术性的表达。
回答应该简洁明了，避免过长的段落。使用礼貌、尊重的语气，偶尔可以使用一些适合老年人的幽默。
`;

      // 如果有兴趣提示词，添加到系统提示中
      if (interestPrompt) {
        systemPrompt += interestPrompt;
      }
      
      // 构建请求体 - 不同模型有不同的输入格式
      let payload: any;
      
      // 针对不同模型构建不同的请求格式
      if (model === HUGGINGFACE_API.MODELS.CHAT_GLM) {
        // ChatGLM特定格式
        payload = {
          inputs: this.formatHistoryForChatGLM(history, message, systemPrompt)
        };
      } else if (model.includes('mistral')) {
        // Mistral模型特定格式
        payload = {
          inputs: this.formatHistoryForMistral(history, message, systemPrompt)
        };
      } else {
        // 通用格式（适用于大多数模型）
        payload = {
          inputs: this.formatGenericHistory(history, message, systemPrompt)
        };
      }
      
      console.log(`使用Hugging Face模型 ${model} 生成回复...`, payload);
      
      // 发送请求到Hugging Face API
      const response = await fetch(
        `${HUGGINGFACE_API.BASE_URL}/${model}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${HUGGINGFACE_API.TOKEN}`
          },
          body: JSON.stringify(payload),
          // 设置较长的超时时间，因为HF可能需要加载模型
          signal: AbortSignal.timeout(60000) // 60秒超时
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Hugging Face API响应错误:', response.status, errorText);
        throw new Error(`API错误 (${response.status}): ${response.statusText}`);
      }
      
      // 解析响应 - 根据模型类型解析不同的响应格式
      const data = await response.json();
      console.log('Hugging Face API响应:', data);
      
      // 从响应中提取生成的文本
      let generatedText = '';
      
      if (Array.isArray(data) && data.length > 0) {
        // 某些模型返回数组格式
        if (data[0].generated_text) {
          generatedText = data[0].generated_text;
        } else {
          generatedText = JSON.stringify(data[0]);
        }
      } else if (data.generated_text) {
        // 大多数模型返回的标准格式
        generatedText = data.generated_text;
      } else if (typeof data === 'string') {
        // 有些模型直接返回字符串
        generatedText = data;
      } else {
        // 尝试从其他可能的位置获取响应
        generatedText = JSON.stringify(data);
      }
      
      return this.cleanResponse(generatedText, message);
    } catch (error) {
      console.error('调用Hugging Face API失败:', error);
      return `与Hugging Face API通信失败: ${error instanceof Error ? error.message : String(error)}。请检查网络连接和API密钥。`;
    }
  }
  
  // 清理响应文本，移除提示词等
  private static cleanResponse(response: string, originalQuery: string): string {
    // 如果响应包含原始查询，尝试将其移除（某些模型会重复查询）
    if (response.startsWith(originalQuery)) {
      response = response.substring(originalQuery.length).trim();
    }
    
    // 移除常见的助手前缀
    const prefixes = [
      'Assistant:', 'AI:', 'Response:',
      '助手:', 'AI助手:', '回答:'
    ];
    
    for (const prefix of prefixes) {
      if (response.startsWith(prefix)) {
        response = response.substring(prefix.length).trim();
        break;
      }
    }
    
    return response;
  }
  
  // 格式化历史信息用于ChatGLM
  private static formatHistoryForChatGLM(
    history: ChatMessage[], 
    newMessage: string,
    systemPrompt: string = ''
  ): string {
    // ChatGLM通常接受格式为: [Human]: {msg}\n[AI]: {response}\n等
    let prompt = '';
    
    // 添加系统提示
    if (systemPrompt) {
      prompt += `[System]: ${systemPrompt}\n`;
    }
    
    // 添加历史消息
    for (const msg of history) {
      if (msg.role === 'user') {
        prompt += `[Human]: ${msg.content}\n`;
      } else if (msg.role === 'assistant') {
        prompt += `[AI]: ${msg.content}\n`;
      } else if (msg.role === 'system') {
        prompt += `[System]: ${msg.content}\n`;
      }
    }
    
    // 添加最新消息
    prompt += `[Human]: ${newMessage}\n[AI]:`;
    
    return prompt;
  }
  
  // 格式化历史信息用于Mistral
  private static formatHistoryForMistral(
    history: ChatMessage[], 
    newMessage: string,
    systemPrompt: string = ''
  ): string {
    // Mistral使用特殊的格式
    let prompt = '';
    
    // 添加系统提示
    if (systemPrompt) {
      prompt += `<s>[INST] ${systemPrompt} [/INST]</s>\n`;
    }
    
    // 添加历史消息
    for (let i = 0; i < history.length; i += 2) {
      const userMsg = history[i];
      const assistantMsg = i + 1 < history.length ? history[i + 1] : null;
      
      if (userMsg && userMsg.role === 'user') {
        prompt += `<s>[INST] ${userMsg.content} [/INST] `;
      }
      
      if (assistantMsg && assistantMsg.role === 'assistant') {
        prompt += `${assistantMsg.content}</s>\n`;
      }
    }
    
    // 添加最新消息
    prompt += `<s>[INST] ${newMessage} [/INST]`;
    
    return prompt;
  }
  
  // 通用历史格式化（适用于大多数模型）
  private static formatGenericHistory(
    history: ChatMessage[], 
    newMessage: string,
    systemPrompt: string = ''
  ): string {
    let prompt = '';
    
    // 添加系统提示
    if (systemPrompt) {
      prompt += `System: ${systemPrompt}\n`;
    }
    
    // 添加历史消息
    for (const msg of history) {
      if (msg.role === 'user') {
        prompt += `User: ${msg.content}\n`;
      } else if (msg.role === 'assistant') {
        prompt += `Assistant: ${msg.content}\n`;
      } else if (msg.role === 'system') {
        prompt += `System: ${msg.content}\n`;
      }
    }
    
    // 添加最新消息和提示
    prompt += `User: ${newMessage}\nAssistant:`;
    
    return prompt;
  }
} 