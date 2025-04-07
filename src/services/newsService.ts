import { NEWS_API } from '../config/api';
import axios from 'axios';

// 新闻类型定义
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  publishTime: string;
  imageUrl?: string;
  category: string;
  url: string;
  author?: string;
}

// NewsAPI响应类型
interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: {
    source: {
      id: string | null;
      name: string;
    };
    author: string | null;
    title: string;
    description: string;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string;
  }[];
}

// 新闻服务类
export class NewsService {
  private static newsCache: Map<string, NewsItem[]> = new Map();
  private static lastFetchTime: Map<string, number> = new Map();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

  // 获取新闻分类列表
  static getCategories(): string[] {
    return NEWS_API.CATEGORIES.map(cat => cat.name);
  }

  // 检查缓存是否有效
  private static isCacheValid(cacheKey: string): boolean {
    const now = Date.now();
    const lastFetch = this.lastFetchTime.get(cacheKey) || 0;
    return now - lastFetch < this.CACHE_DURATION;
  }

  // 获取新闻列表
  static async getNewsList(category?: string): Promise<NewsItem[]> {
    const cacheKey = category ? `news_${category}` : 'news_all';

    // 检查缓存
    if (this.isCacheValid(cacheKey)) {
      const cachedNews = this.newsCache.get(cacheKey);
      if (cachedNews) return cachedNews;
    }

    try {
      // 获取分类ID
      const categoryId = category
        ? NEWS_API.CATEGORIES.find(cat => cat.name === category)?.id
        : undefined;

      // 调用NewsAPI
      const response = await axios.get<NewsAPIResponse>(`${NEWS_API.BASE_URL}/top-headlines`, {
        params: {
          apiKey: NEWS_API.KEY,
          country: NEWS_API.COUNTRY,
          language: NEWS_API.LANGUAGE,
          category: categoryId
        }
      });

      // 转换数据格式
      const news = response.data.articles.map(article => ({
        id: article.url, // 使用URL作为唯一标识
        title: article.title,
        summary: article.description || '',
        content: article.content || '',
        source: article.source.name,
        publishTime: new Date(article.publishedAt).toLocaleString('zh-CN'),
        imageUrl: article.urlToImage || undefined,
        category: categoryId || '综合',
        url: article.url,
        author: article.author || undefined
      }));

      // 更新缓存
      this.newsCache.set(cacheKey, news);
      this.lastFetchTime.set(cacheKey, Date.now());

      return news;
    } catch (error) {
      console.error('获取新闻失败:', error);
      return [];
    }
  }

  // 搜索新闻
  static async searchNews(keyword: string): Promise<NewsItem[]> {
    if (!keyword.trim()) return [];

    try {
      const response = await axios.get<NewsAPIResponse>(`${NEWS_API.BASE_URL}/everything`, {
        params: {
          apiKey: NEWS_API.KEY,
          q: keyword,
          language: NEWS_API.LANGUAGE,
          sortBy: 'relevancy'
        }
      });

      return response.data.articles.map(article => ({
        id: article.url,
        title: article.title,
        summary: article.description || '',
        content: article.content || '',
        source: article.source.name,
        publishTime: new Date(article.publishedAt).toLocaleString('zh-CN'),
        imageUrl: article.urlToImage || undefined,
        category: '搜索结果',
        url: article.url,
        author: article.author || undefined
      }));
    } catch (error) {
      console.error('搜索新闻失败:', error);
      return [];
    }
  }

  // 获取新闻详情
  static async getNewsDetail(id: string): Promise<NewsItem | null> {
    try {
      const response = await axios.get<NewsAPIResponse>(`${NEWS_API.BASE_URL}/everything`, {
        params: {
          apiKey: NEWS_API.KEY,
          qInTitle: id, // 使用标题精确匹配
          language: NEWS_API.LANGUAGE
        }
      });

      const article = response.data.articles[0];
      if (!article) return null;

      return {
        id: article.url,
        title: article.title,
        summary: article.description || '',
        content: article.content || '',
        source: article.source.name,
        publishTime: new Date(article.publishedAt).toLocaleString('zh-CN'),
        imageUrl: article.urlToImage || undefined,
        category: '详情',
        url: article.url,
        author: article.author || undefined
      };
    } catch (error) {
      console.error('获取新闻详情失败:', error);
      return null;
    }
  }
}