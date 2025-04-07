import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavBar, Image, DotLoading, Toast } from 'antd-mobile';
import { NewsService, NewsItem } from '../services/newsService';

// 图标组件
const TimeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>;
const SourceIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>;

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadNewsDetail();
  }, [id]);
  
  const loadNewsDetail = async () => {
    if (!id) return;
    
    try {
      const newsId = parseInt(id);
      const detail = await NewsService.getNewsDetail(newsId);
      
      if (detail) {
        setNews(detail);
      } else {
        Toast.show({
          content: '新闻不存在',
          duration: 2000,
        });
        navigate('/news');
      }
    } catch (error) {
      console.error('加载新闻详情失败:', error);
      Toast.show({
        content: '加载失败，请重试',
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="news-detail-container">
      <NavBar onBack={() => navigate(-1)}>新闻详情</NavBar>
      
      {loading ? (
        <div className="loading">
          <DotLoading />
          <span>加载中...</span>
        </div>
      ) : news ? (
        <div className="news-content">
          <h1 className="news-title">{news.title}</h1>
          
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
          
          {news.imageUrl && (
            <div className="news-image">
              <Image src={news.imageUrl} fit="cover" />
            </div>
          )}
          
          <div className="news-text">
            {news.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <p>新闻不存在</p>
        </div>
      )}
      
      {/* 新闻详情样式 */}
      <style jsx>{`
        .news-detail-container {
          min-height: 100vh;
          background-color: white;
        }
        
        .news-content {
          padding: var(--spacing-lg);
        }
        
        .news-title {
          font-size: var(--font-size-xl);
          font-weight: bold;
          margin-bottom: var(--spacing-md);
          line-height: 1.4;
        }
        
        .news-meta {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          color: var(--text-color-secondary);
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-lg);
        }
        
        .news-time,
        .news-source {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }
        
        .news-image {
          margin: var(--spacing-lg) 0;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
        }
        
        .news-text {
          font-size: var(--font-size-base);
          line-height: 1.8;
          color: var(--text-color);
        }
        
        .news-text p {
          margin-bottom: var(--spacing-md);
        }
        
        .loading,
        .empty-state {
          text-align: center;
          padding: var(--spacing-xl);
          color: var(--text-color-secondary);
        }
      `}</style>
    </div>
  );
};

export default NewsDetail;