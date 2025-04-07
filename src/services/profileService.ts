import axios from 'axios';

// 用户兴趣爱好类型
export interface UserInterest {
  category: string; // 兴趣类别，如：阅读、旅游、健身等
  name: string;     // 具体兴趣名称
  level: 1 | 2 | 3; // 兴趣程度: 1-一般 2-喜欢 3-热爱
}

// 用户简介类型
export interface UserProfile {
  id?: number;
  user_id: number;
  display_name: string;
  avatar: string;
  bio: string;         // 个人简介
  interests: UserInterest[];
  birthday?: string;
  location?: string;
  tags?: string[];     // 标签
}

// 对话历史记录类型
export interface ChatHistory {
  id: number;
  user_id: number;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
  title: string;       // 对话标题
}

// 对话消息类型
export interface ChatMessage {
  id: number;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

// 个人资料服务
export class ProfileService {
  // 获取用户个人资料
  static async getUserProfile(userId: number): Promise<{profile: UserProfile | null, error: any}> {
    try {
      const response = await axios.get(`/api/user/profile/${userId}`);
      
      if (response.data.success) {
        return { profile: response.data.data, error: null };
      } else {
        return { profile: null, error: response.data.message };
      }
    } catch (error) {
      console.error('获取用户资料失败:', error);
      return { profile: null, error };
    }
  }
  
  // 更新用户个人资料
  static async updateUserProfile(profile: UserProfile): Promise<{success: boolean, error: any}> {
    try {
      const response = await axios.put(`/api/user/profile/${profile.user_id}`, profile);
      
      if (response.data.success) {
        return { success: true, error: null };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('更新用户资料失败:', error);
      return { success: false, error };
    }
  }
  
  // 根据收集到的兴趣爱好生成个人简介
  static async generateUserBio(userId: number, interests: UserInterest[]): Promise<{bio: string, error: any}> {
    try {
      const response = await axios.post(`/api/user/generate-bio`, {
        user_id: userId,
        interests
      });
      
      if (response.data.success) {
        return { bio: response.data.data.bio, error: null };
      } else {
        return { bio: '', error: response.data.message };
      }
    } catch (error) {
      console.error('生成个人简介失败:', error);
      return { bio: '', error };
    }
  }
  
  // 保存对话历史记录
  static async saveChatHistory(userId: number, messages: ChatMessage[], title?: string): Promise<{success: boolean, chatId?: number, error: any}> {
    try {
      // 如果没有提供标题，使用默认标题
      const chatTitle = title || `与AI助手的对话 - ${new Date().toLocaleString()}`;
      
      const response = await axios.post(`/api/chat/history`, {
        user_id: userId,
        messages,
        title: chatTitle
      });
      
      if (response.data.success) {
        return { 
          success: true, 
          chatId: response.data.data.id,
          error: null 
        };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('保存对话历史失败:', error);
      return { success: false, error };
    }
  }
  
  // 获取用户的对话历史列表
  static async getChatHistoryList(userId: number): Promise<{histories: ChatHistory[], error: any}> {
    try {
      const response = await axios.get(`/api/chat/history/user/${userId}`);
      
      if (response.data.success) {
        return { histories: response.data.data, error: null };
      } else {
        return { histories: [], error: response.data.message };
      }
    } catch (error) {
      console.error('获取对话历史列表失败:', error);
      return { histories: [], error };
    }
  }
  
  // 获取特定对话历史详情
  static async getChatHistoryDetail(chatId: number): Promise<{history: ChatHistory | null, error: any}> {
    try {
      const response = await axios.get(`/api/chat/history/${chatId}`);
      
      if (response.data.success) {
        return { history: response.data.data, error: null };
      } else {
        return { history: null, error: response.data.message };
      }
    } catch (error) {
      console.error('获取对话历史详情失败:', error);
      return { history: null, error };
    }
  }
  
  // 删除对话历史
  static async deleteChatHistory(chatId: number): Promise<{success: boolean, error: any}> {
    try {
      const response = await axios.delete(`/api/chat/history/${chatId}`);
      
      if (response.data.success) {
        return { success: true, error: null };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('删除对话历史失败:', error);
      return { success: false, error };
    }
  }
}

// AI主动对话相关服务
export class AIConversationService {
  // 获取AI主动开始的对话问候语
  static async getAIGreeting(userId: number): Promise<{message: string, error: any}> {
    try {
      const response = await axios.get(`/api/ai/greeting/${userId}`);
      
      if (response.data.success) {
        return { message: response.data.data.message, error: null };
      } else {
        return { message: '您好！我是您的AI助手，很高兴认识您。', error: response.data.message };
      }
    } catch (error) {
      console.error('获取AI问候语失败:', error);
      // 返回默认问候语
      return { 
        message: '您好！我是您的AI助手，很高兴认识您。我能帮您解答问题，也很想了解您的兴趣爱好，这样我可以为您提供更好的服务。', 
        error 
      };
    }
  }
  
  // 分析用户对话，提取兴趣爱好
  static async analyzeUserInterests(userId: number, messages: ChatMessage[]): Promise<{interests: UserInterest[], error: any}> {
    try {
      const response = await axios.post(`/api/ai/analyze-interests`, {
        user_id: userId,
        messages
      });
      
      if (response.data.success) {
        return { interests: response.data.data.interests, error: null };
      } else {
        return { interests: [], error: response.data.message };
      }
    } catch (error) {
      console.error('分析用户兴趣爱好失败:', error);
      return { interests: [], error };
    }
  }
  
  // 获取用户兴趣爱好收集的推荐问题
  static async getInterestQuestions(userId: number, currentInterests: UserInterest[]): Promise<{questions: string[], error: any}> {
    try {
      const response = await axios.post(`/api/ai/interest-questions`, {
        user_id: userId,
        current_interests: currentInterests
      });
      
      if (response.data.success) {
        return { questions: response.data.data.questions, error: null };
      } else {
        return { 
          questions: [
            '您平时有什么爱好吗？',
            '您喜欢什么类型的书籍或电影？',
            '您有什么特长或技能吗？'
          ], 
          error: response.data.message 
        };
      }
    } catch (error) {
      console.error('获取兴趣问题失败:', error);
      // 返回默认问题
      return { 
        questions: [
          '您平时有什么爱好吗？',
          '您喜欢什么类型的书籍或电影？',
          '您有什么特长或技能吗？'
        ], 
        error 
      };
    }
  }
} 