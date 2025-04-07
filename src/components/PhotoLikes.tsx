import React from 'react';
import { Avatar, Badge, Button } from 'antd-mobile';

interface PhotoLikesProps {
  likes: string[];
  currentUserId: string;
  onLike: () => void;
}

// 点赞图标
const LikeIcon = ({ active = false }: { active?: boolean }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill={active ? "#ff4d4f" : "none"}
    stroke={active ? "#ff4d4f" : "currentColor"}
    strokeWidth="2"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const PhotoLikes: React.FC<PhotoLikesProps> = ({ 
  likes, 
  currentUserId, 
  onLike 
}) => {
  const hasLiked = likes.includes(currentUserId);
  
  return (
    <div className="photo-likes">
      <div className="likes-header">
        <div className="likes-count">
          <LikeIcon active={true} />
          <span>{likes.length} 人点赞</span>
        </div>
        <Button
          size="mini"
          color={hasLiked ? "primary" : "default"}
          onClick={onLike}
          className="like-button"
        >
          {hasLiked ? '已点赞' : '点赞'}
        </Button>
      </div>
      
      {likes.length > 0 && (
        <div className="likes-avatars">
          {/* 显示最多5个头像 */}
          {[...Array(Math.min(likes.length, 5))].map((_, index) => (
            <Badge
              key={index}
              className="avatar-badge"
              content={index === 4 && likes.length > 5 ? `+${likes.length - 5}` : ''}
            >
              <Avatar
                src={`https://via.placeholder.com/40?text=${likes[index].substring(0, 2)}`}
                style={{ 
                  borderRadius: '50%',
                  border: likes[index] === currentUserId ? '2px solid #ff4d4f' : 'none'
                }}
              />
            </Badge>
          ))}
        </div>
      )}
      
      <style>{`
        .photo-likes {
          background-color: white;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        
        .likes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .likes-count {
          display: flex;
          align-items: center;
          color: #ff4d4f;
          font-weight: 500;
        }
        
        .likes-count svg {
          margin-right: 8px;
        }
        
        .like-button {
          font-size: 12px;
          padding: 0 12px;
        }
        
        .likes-avatars {
          display: flex;
          flex-wrap: wrap;
        }
        
        .avatar-badge {
          margin-right: 8px;
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};

export default PhotoLikes; 