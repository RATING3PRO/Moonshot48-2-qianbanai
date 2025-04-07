import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, InfiniteScroll, PullToRefresh, SearchBar, Tabs, Image, DotLoading } from 'antd-mobile';
import { NewsService, NewsItem } from '../services/newsService';

// 图标组件
const TimeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>;
const SourceIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>;

const News: React.FC = () => {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  
  // 加载新闻分类
  useEffect(() => {
    const cats = NewsService.getCategories();
    setCategories(['全部', ...cats]);
  }, []);
  
  // 加载新闻列表
  const loadNewsList = async (refresh = false) => {
    if (loading) return;
    setLoading(true);
    
    try {
      let data: NewsItem[];
      if (searchKeyword) {
        data = await NewsService.searchNews(searchKeyword);
      } else if (activeCategory && activeCategory !== '全部') {
        data = await NewsService.getNewsList(activeCategory);
      } else {
        data = await NewsService.getNewsList();
      }
      
      setNewsList(refresh ? data : [...newsList, ...data]);
      setHasMore(false); // 模拟数据已全部加载
    } catch (error) {
      console.error('加载新闻列表失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 处理下拉刷新
  const onRefresh = async () => {
    await loadNewsList(true);
  };
  
  // 处理搜索
  const onSearch = (value: string) => {
    setSearchKeyword(value);
    loadNewsList(true);
  };
  
  // 处理分类切换
  const onCategoryChange = (category: string) => {
    setActiveCategory(category);
    loadNewsList(true);
  };
  
  // 跳转到新闻详情
  const goToDetail = (id: number) => {
    navigate(`/news/${id}`);
  };

  return (
    <div className="news-container">
      <h1 className="page-title">新闻资讯</h1>
      
      {/* 搜索栏 */}
      <div className="search-bar">
        <SearchBar
          placeholder="搜索新闻"
          value={searchKeyword}
          onChange={setSearchKeyword}
          onSearch={onSearch}
        />
      </div>
      
      {/* 分类标签 */}
      <Tabs
        activeKey={activeCategory || '全部'}
        onChange={onCategoryChange}
        className="category-tabs"
      >
        {categories.map(category => (
          <Tabs.Tab title={category} key={category} />
        ))}
      </Tabs>
      
      {/* 新闻列表 */}
      <PullToRefresh onRefresh={onRefresh}>
        <List className="news-list">
          {newsList.map(news => (
            <List.Item
              key={news.id}
              onClick={() => goToDetail(news.id)}
              className="news-item"
            >
              <div className="news-content">
                <div className="news-info">
                  <h3 className="news-title">{news.title}</h3>
                  <p className="news-summary">{news.summary}</p>
                  <div className="news-meta">
                    <span className="news-time">
                      <TimeIcon />
                      {news.publishTime}
                    </span>
                    <span className="news-source">
                      <SourceIcon />
                      {news.source}
                    </span>
                  </div>
                </div>
                {news.imageUrl && (
                  <div className="news-image">
                    <Image src={news.imageUrl} fit="cover" />
                  </div>
                )}
              </div>
            </List.Item>
          ))}
        </List>
        
        <InfiniteScroll loadMore={() => loadNewsList()} hasMore={hasMore}>
          {loading ? (
            <div className="loading">
              <DotLoading />
              <span>加载中...</span>
            </div>
          ) : null}
        </InfiniteScroll>
      </PullToRefresh>
      
      {/* 新闻列表样式 */}
      <style jsx>{`
        .news-container {
          min-height: 100vh;
          background-color: var(--background-color);
        }
        
        .search-bar {
          padding: var(--spacing-md);
          background-color: white;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .category-tabs {
          background-color: white;
          position: sticky;
          top: 64px;
          z-index: 99;
        }
        
        .news-list {
          margin-top: var(--spacing-md);
        }
        
        .news-item {
          background-color: white;
          margin-bottom: var(--spacing-sm);
        }
        
        .news-content {
          display: flex;
          gap: var(--spacing-md);
        }
        
        .news-info {
          flex: 1;
        }
        
        .news-title {
          font-size: var(--font-size-lg);
          font-weight: bold;
          margin-bottom: var(--spacing-sm);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .news-summary {
          font-size: var(--font-size-base);
          color: var(--text-color-secondary);
          margin-bottom: var(--spacing-sm);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .news-meta {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          color: var(--text-color-secondary);
          font-size: var(--font-size-sm);
        }
        
        .news-time,
        .news-source {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }
        
        .news-image {
          width: 120px;
          height: 90px;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          flex-shrink: 0;
        }
        
        .loading {
          text-align: center;
          padding: var(--spacing-lg);
          color: var(--text-color-secondary);
        }
      `}</style>
    </div>
  );
};

export default News;