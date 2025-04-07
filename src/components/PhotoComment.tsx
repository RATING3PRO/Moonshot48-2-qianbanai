import React, { useState } from 'react';
import { List, Input, Button, Avatar, Space, Toast } from 'antd-mobile';
import { Comment } from '../services/albumService';

interface PhotoCommentProps {
  comments: Comment[];
  photoId: string;
  onAddComment: (photoId: string, content: string) => void;
}

const PhotoComment: React.FC<PhotoCommentProps> = ({ 
  comments, 
  photoId, 
  onAddComment 
}) => {
  const [newComment, setNewComment] = useState('');
  
  const handleSubmit = () => {
    if (!newComment.trim()) {
      Toast.show('评论内容不能为空');
      return;
    }
    
    onAddComment(photoId, newComment.trim());
    setNewComment('');
  };
  
  return (
    <div className="photo-comment">
      <List header="评论" className="comment-list">
        {comments.length > 0 ? (
          comments.map(comment => (
            <List.Item
              key={comment.id}
              prefix={
                <Avatar
                  src={comment.userAvatar}
                  style={{ borderRadius: '50%' }}
                />
              }
              description={
                <div className="comment-time">
                  {new Date(comment.createdAt).toLocaleString()}
                </div>
              }
            >
              <div className="comment-user">{comment.userName}</div>
              <div className="comment-content">{comment.content}</div>
            </List.Item>
          ))
        ) : (
          <div className="empty-comment">暂无评论，快来抢沙发吧~</div>
        )}
      </List>
      
      <div className="comment-input">
        <Space align="center" block>
          <Input
            placeholder="写下你的评论..."
            value={newComment}
            onChange={setNewComment}
            clearable
          />
          <Button 
            color="primary" 
            onClick={handleSubmit}
            disabled={!newComment.trim()}
          >
            发布
          </Button>
        </Space>
      </div>
      
      <style>{`
        .photo-comment {
          margin-top: 16px;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .comment-list {
          margin-bottom: 8px;
        }
        
        .comment-user {
          font-weight: bold;
          margin-bottom: 4px;
        }
        
        .comment-content {
          color: #333;
          line-height: 1.5;
        }
        
        .comment-time {
          color: #999;
          font-size: 12px;
        }
        
        .empty-comment {
          text-align: center;
          color: #999;
          padding: 16px;
        }
        
        .comment-input {
          padding: 8px 16px 16px;
          border-top: 1px solid #f5f5f5;
        }
      `}</style>
    </div>
  );
};

export default PhotoComment; 