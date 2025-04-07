import { OllamaService } from './ollamaService';
import { RemoteOllamaService } from './remoteOllamaService';

// 用户兴趣爱好类型
export interface UserInterest {
  category: string; // 兴趣类别，如：阅读、旅游、健身等
  name: string;     // 具体兴趣名称
  level: 1 | 2 | 3; // 兴趣程度: 1-一般 2-喜欢 3-热爱
}

// 兴趣收集服务
export class InterestCollector {
  // 已收集的兴趣爱好
  private static _interests: UserInterest[] = [];
  
  // 已询问的问题计数
  private static _askedQuestions: number = 0;
  
  // 预设的询问兴趣的问题
  private static _interestQuestions = [
    '您平时有哪些休闲活动或爱好呢？',
    '您喜欢什么类型的书籍或者电影？',
    '您平时有没有运动的习惯，比如散步、太极或者其他运动？',
    '您有没有特别喜欢的艺术活动，比如书法、绘画或者音乐？',
    '您对烹饪或美食有兴趣吗？有什么特别喜欢做的菜或吃的食物？',
    '您平时喜欢去哪些地方旅行或者游玩？',
    '您有养花种草或园艺方面的爱好吗？',
    '您喜欢什么样的音乐或者戏曲？',
    '您有收藏什么东西的习惯吗？比如邮票、纪念币等。',
    '您对手工艺品制作有兴趣吗，比如编织、剪纸或者其他手工活动？'
  ];
  
  // 获取当前收集的兴趣爱好
  public static getInterests(): UserInterest[] {
    return this._interests;
  }
  
  // 设置兴趣爱好
  public static setInterests(interests: UserInterest[]): void {
    // 清空现有兴趣
    this.clearInterests();
    
    // 设置新兴趣
    this._interests = [...interests];
    
    // 保存到本地存储
    this.saveInterestsToStorage();
  }
  
  // 添加单个兴趣爱好
  public static addInterest(interest: UserInterest): void {
    // 检查是否已存在相同类别和名称的兴趣
    const existingIndex = this._interests.findIndex(
      i => i.category === interest.category && i.name === interest.name
    );
    
    if (existingIndex >= 0) {
      // 更新已有兴趣的级别为较高的级别
      this._interests[existingIndex].level = Math.max(
        this._interests[existingIndex].level as number,
        interest.level as number
      ) as 1 | 2 | 3;
    } else {
      // 添加新兴趣
      this._interests.push(interest);
    }
    
    // 保存到本地存储
    this.saveInterestsToStorage();
  }
  
  // 清空收集的兴趣爱好
  public static clearInterests(): void {
    this._interests = [];
    this._askedQuestions = 0;
    
    // 从本地存储中删除
    this.clearInterestsFromStorage();
  }
  
  // 保存兴趣到本地存储
  private static saveInterestsToStorage(): void {
    try {
      localStorage.setItem('userInterests', JSON.stringify(this._interests));
    } catch (error) {
      console.error('保存兴趣到本地存储失败:', error);
    }
  }
  
  // 从本地存储中清除兴趣
  private static clearInterestsFromStorage(): void {
    try {
      localStorage.removeItem('userInterests');
    } catch (error) {
      console.error('从本地存储中清除兴趣失败:', error);
    }
  }
  
  // 从本地存储加载兴趣
  public static loadInterestsFromStorage(): void {
    try {
      const savedInterests = localStorage.getItem('userInterests');
      if (savedInterests) {
        this._interests = JSON.parse(savedInterests) as UserInterest[];
      }
    } catch (error) {
      console.error('从本地存储加载兴趣失败:', error);
    }
  }
  
  // 初始化 - 从本地存储加载兴趣
  static {
    // 在类初始化时加载兴趣
    if (typeof window !== 'undefined' && window.localStorage) {
      this.loadInterestsFromStorage();
    }
  }
  
  // 判断是否应该显示兴趣收集的弹窗
  public static shouldShowInterestDialog(): boolean {
    // 当收集到至少5个兴趣，或者询问了至少5个问题时，应该显示弹窗
    return this._interests.length >= 5 || this._askedQuestions >= 5;
  }
  
  // 获取下一个兴趣问题
  public static getNextQuestion(): string {
    if (this._askedQuestions < this._interestQuestions.length) {
      const question = this._interestQuestions[this._askedQuestions];
      this._askedQuestions++;
      return question;
    }
    
    // 如果已经问完所有问题，返回一个通用的问题
    return '您还有其他兴趣爱好想和我分享吗？';
  }
  
  // 分析用户消息中的兴趣爱好
  public static async analyzeInterests(message: string, isLocal: boolean = true): Promise<UserInterest[]> {
    try {
      // 构建提示词，让AI识别兴趣爱好
      const prompt = `
请从以下用户消息中识别出可能的兴趣爱好，并按以下JSON格式返回：
[
  {
    "category": "兴趣类别，如阅读、旅游、健身等",
    "name": "具体兴趣名称",
    "level": "兴趣程度，1-一般，2-喜欢，3-热爱"
  }
]

只返回JSON数组，不要有其他文字。如果没有识别到兴趣爱好，返回空数组[]。

用户消息：${message}
`;

      // 使用本地或远程模型进行分析
      let response = '';
      if (isLocal) {
        response = await OllamaService.sendMessage(prompt, [], 'gemma3:12b');
      } else {
        response = await RemoteOllamaService.sendMessage(prompt, [], 'gemma3:12b');
      }
      
      // 提取JSON部分
      const jsonMatch = response.match(/\[\s*\{.*\}\s*\]/s);
      if (jsonMatch) {
        try {
          const interests = JSON.parse(jsonMatch[0]) as UserInterest[];
          
          // 合并兴趣到当前收集的列表中，避免重复
          interests.forEach(newInterest => {
            const existingIndex = this._interests.findIndex(
              i => i.category === newInterest.category && i.name === newInterest.name
            );
            
            if (existingIndex >= 0) {
              // 更新已存在的兴趣级别为较高的级别
              this._interests[existingIndex].level = Math.max(
                this._interests[existingIndex].level as number, 
                newInterest.level as number
              ) as 1 | 2 | 3;
            } else {
              // 添加新的兴趣
              this._interests.push(newInterest);
            }
          });
          
          return interests;
        } catch (error) {
          console.error('解析兴趣JSON失败:', error);
          return [];
        }
      }
      
      return [];
    } catch (error) {
      console.error('分析兴趣爱好失败:', error);
      return [];
    }
  }
  
  // 生成用于AI回复的兴趣推荐提示词
  public static generateInterestPrompt(): string {
    if (this._interests.length === 0) {
      return '';
    }
    
    // 按兴趣级别排序
    const sortedInterests = [...this._interests].sort((a, b) => b.level - a.level);
    
    // 根据不同级别的兴趣推荐不同的回复
    return `
我观察到用户对以下兴趣爱好表现出兴趣:
${sortedInterests.map(i => `- ${i.category}/${i.name} (级别:${i.level})`).join('\n')}

请在回复中自然地引用这些兴趣，让用户感到你理解他们的喜好。如果合适，继续提问收集更多兴趣爱好信息。
`;
  }
} 