import React, { useState } from 'react';
import { Image, Button, Tag } from 'antd-mobile';
import { Photo, PrivacySetting } from '../services/albumService';

// 图标组件
const LikeIcon = ({ active = false }: { active?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#ff4d4f" : "currentColor"}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const CommentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
  </svg>
);

const PrivacyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
  </svg>
);

// 隐私设置选项
const privacyOptions = [
  { value: PrivacySetting.PRIVATE, label: '仅自己可见', color: '#108ee9' },
  { value: PrivacySetting.FRIENDS, label: '朋友可见', color: '#87d068' },
  { value: PrivacySetting.PUBLIC, label: '所有人可见', color: '#f50' },
];

// 获取隐私设置标签颜色
const getPrivacyColor = (privacy: PrivacySetting): string => {
  const option = privacyOptions.find(opt => opt.value === privacy);
  return option ? option.color : '#108ee9';
};

// 获取隐私设置标签文本
const getPrivacyLabel = (privacy: PrivacySetting): string => {
  const option = privacyOptions.find(opt => opt.value === privacy);
  return option ? option.label : '仅自己可见';
};

interface PhotoItemProps {
  photo: Photo;
  currentUserId: string;
  onLike: (photo: Photo) => void;
  onComment: (photo: Photo) => void;
  onPrivacy: (photo: Photo) => void;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ 
  photo, 
  currentUserId, 
  onLike, 
  onComment, 
  onPrivacy 
}) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="photo-item">
      <div className="photo-container">
        <Image src={photo.url} fit="cover" />
        <div className="photo-overlay">
          <div className="photo-actions">
            <Button 
              className="action-btn"
              onClick={() => onLike(photo)}
            >
              <LikeIcon active={photo.likes.includes(currentUserId)} />
              <span>{photo.likes.length}</span>
            </Button>
            <Button 
              className="action-btn"
              onClick={() => {
                setShowComments(!showComments);
                onComment(photo);
              }}
            >
              <CommentIcon />
              <span>{photo.comments.length}</span>
            </Button>
            <Button 
              className="action-btn"
              onClick={() => onPrivacy(photo)}
            >
              <PrivacyIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="photo-info">
        <div className="photo-description">{photo.description}</div>
        <Tag color={getPrivacyColor(photo.privacy)}>{getPrivacyLabel(photo.privacy)}</Tag>
      </div>
      
      {/* 评论列表 */}
      {showComments && photo.comments.length > 0 && (
        <div className="comments-list">
          {photo.comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-user">
                <Image src={comment.userAvatar} width={24} height={24} style={{ borderRadius: '50%' }} />
                <span className="username">{comment.userName}</span>
              </div>
              <div className="comment-content">{comment.content}</div>
              <div className="comment-time">{new Date(comment.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}

      {/* 样式 */}
      <style>
        {`
          .photo-item {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin-bottom: 16px;
          }
          
          .photo-container {
            position: relative;
            aspect-ratio: 1;
          }
          
          .photo-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
            padding: 8px;
            opacity: 0;
            transition: opacity 0.3s;
          }
          
          .photo-container:hover .photo-overlay {
            opacity: 1;
          }
          
          .photo-actions {
            display: flex;
            justify-content: space-around;
          }
          
          .action-btn {
            background: transparent;
            color: white;
            display: flex;
            align-items: center;
            gap: 4px;
          }
          
          .photo-info {
            padding: 8px;
          }
          
          .photo-description {
            margin-bottom: 8px;
            font-size: 14px;
            color: #333;
          }

          .comments-list {
            padding: 12px;
            border-top: 1px solid #f0f0f0;
          }

          .comment-item {
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #f5f5f5;
          }

          .comment-user {
            display: flex;
            align-items: center;
            margin-bottom: 4px;
          }

          .username {
            margin-left: 8px;
            font-weight: 500;
            color: #333;
          }

          .comment-content {
            margin-left: 32px;
            color: #666;
            font-size: 14px;
          }

          .comment-time {
            margin-left: 32px;
            margin-top: 4px;
            color: #999;
            font-size: 12px;
          }
        `}
      </style>
    </div>
  );
};

export default PhotoItem;