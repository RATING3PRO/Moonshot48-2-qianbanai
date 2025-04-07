import React, { useState, useEffect } from 'react';
import { NavBar, Tabs, Image, Button, Dialog, Toast, List, TextArea, Tag, Space, Popup, Empty } from 'antd-mobile';
import { useNavigate, useParams } from 'react-router-dom';
import { Album, Photo, PrivacySetting, getUserAlbums, getAlbumById, addPhotoToAlbum, updatePhotoPrivacy, likePhoto, commentOnPhoto } from '../services/albumService';
import PhotoUpload from '../components/PhotoUpload';
import PhotoComment from '../components/PhotoComment';
import PhotoLikes from '../components/PhotoLikes';

// 图标组件
const BackIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>;
const AddIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const LikeIcon = ({ active = false }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#ff4d4f" : "currentColor"}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>;
const CommentIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>;
const PrivacyIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>;

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

// 相册页面组件
const AlbumPage: React.FC = () => {
  const navigate = useNavigate();
  const { albumId } = useParams<{ albumId: string }>();
  
  // 状态管理
  const [album, setAlbum] = useState<Album | null>(null);
  const [activeTab, setActiveTab] = useState('photos');
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [newComment, setNewComment] = useState('');
  const [newPhotoDescription, setNewPhotoDescription] = useState('');
  const [newPhotoPrivacy, setNewPhotoPrivacy] = useState<PrivacySetting>(PrivacySetting.PRIVATE);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  // 模拟当前用户
  const currentUser = {
    id: 'user1',
    name: '张大爷',
    avatar: 'https://via.placeholder.com/50'
  };
  
  // 加载相册数据
  useEffect(() => {
    if (albumId) {
      const albumData = getAlbumById(albumId);
      if (albumData) {
        setAlbum(albumData);
      } else {
        Toast.show({
          content: '相册不存在',
          position: 'bottom',
        });
        navigate('/profile');
      }
    } else {
      // 如果没有albumId，加载用户的所有相册
      const userAlbums = getUserAlbums(currentUser.id);
      if (userAlbums.length > 0) {
        setAlbum(userAlbums[0]);
      } else {
        // 创建一个默认相册
        Toast.show({
          content: '创建默认相册',
          position: 'bottom',
        });
      }
    }
  }, [albumId, navigate]);
  
  // 处理图片文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // 创建预览URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 上传图片
  const handleUploadPhoto = async () => {
    if (!album || !imageFile) return;
    
    // 在实际项目中，这里会调用API上传图片
    // 这里模拟上传成功，使用预览URL作为图片URL
    const newPhoto = addPhotoToAlbum(album.id, {
      userId: currentUser.id,
      url: previewUrl,
      description: newPhotoDescription,
      privacy: newPhotoPrivacy
    });
    
    if (newPhoto) {
      // 更新相册数据
      setAlbum(prev => prev ? {
        ...prev,
        photos: [...prev.photos, newPhoto]
      } : null);
      
      // 重置状态
      setImageFile(null);
      setPreviewUrl('');
      setNewPhotoDescription('');
      setNewPhotoPrivacy(PrivacySetting.PRIVATE);
      setShowUploadPopup(false);
      
      Toast.show({
        content: '照片上传成功',
        position: 'bottom',
      });
    }
  };

  // 处理点赞
  const handleLike = (photo: Photo) => {
    if (!album) return;
    
    const success = likePhoto(album.id, photo.id, currentUser.id);
    if (success) {
      // 更新相册数据
      setAlbum(prev => {
        if (!prev) return null;
        return {
          ...prev,
          photos: prev.photos.map(p => 
            p.id === photo.id ? {
              ...p,
              likes: p.likes.includes(currentUser.id)
                ? p.likes.filter(id => id !== currentUser.id)
                : [...p.likes, currentUser.id]
            } : p
          )
        };
      });
    }
  };

  // 处理评论弹窗
  const openCommentPopup = (photo: Photo) => {
    setSelectedPhoto(photo);
    setNewComment('');
    setShowCommentPopup(true);
  };

  // 处理隐私设置
  const handlePrivacyChange = (photo: Photo, privacy: PrivacySetting) => {
    if (!album) return;
    
    const success = updatePhotoPrivacy(album.id, photo.id, privacy);
    if (success) {
      // 更新相册数据
      setAlbum(prev => {
        if (!prev) return null;
        return {
          ...prev,
          photos: prev.photos.map(p =>
            p.id === photo.id ? { ...p, privacy } : p
          )
        };
      });
      
      setShowPrivacyPopup(false);
      
      Toast.show({
        content: '隐私设置已更新',
        position: 'bottom',
      });
    }
  };
  

  
  // 提交评论
  const handleSubmitComment = () => {
    if (!album || !selectedPhoto || !newComment.trim()) {
      Toast.show({
        content: '请输入评论内容',
        position: 'bottom',
      });
      return;
    }
    
    const comment = commentOnPhoto(album.id, selectedPhoto.id, {
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: newComment
    });
    
    if (comment) {
      // 更新相册状态
      setAlbum(prev => {
        if (!prev) return null;
        return {
          ...prev,
          photos: prev.photos.map(p => {
            if (p.id === selectedPhoto.id) {
              return {
                ...p,
                comments: [...p.comments, comment]
              };
            }
            return p;
          })
        };
      });
      
      // 重置表单
      setNewComment('');
      setShowCommentPopup(false);
      
      Toast.show({
        content: '评论成功',
        position: 'bottom',
      });
    } else {
      Toast.show({
        content: '评论失败，请重试',
        position: 'bottom',
      });
    }
  };
  
  // 打开隐私设置弹窗
  const openPrivacyPopup = (photo: Photo) => {
    setSelectedPhoto(photo);
    setNewPhotoPrivacy(photo.privacy);
    setShowPrivacyPopup(true);
  };
  
  // 更新隐私设置
  const handleUpdatePrivacy = () => {
    if (!album || !selectedPhoto) return;
    
    const success = updatePhotoPrivacy(album.id, selectedPhoto.id, newPhotoPrivacy);
    if (success) {
      // 更新相册状态
      setAlbum(prev => {
        if (!prev) return null;
        return {
          ...prev,
          photos: prev.photos.map(p => {
            if (p.id === selectedPhoto.id) {
              return {
                ...p,
                privacy: newPhotoPrivacy
              };
            }
            return p;
          })
        };
      });
      
      setShowPrivacyPopup(false);
      
      Toast.show({
        content: '隐私设置已更新',
        position: 'bottom',
      });
    } else {
      Toast.show({
        content: '更新失败，请重试',
        position: 'bottom',
      });
    }
  };

  // 处理批量上传照片
  const handleMultipleUpload = (photos: { url: string; privacy: PrivacySetting }[]) => {
    if (!album) return;
    
    const uploadPromises = photos.map(photo => 
      addPhotoToAlbum(album.id, {
        userId: currentUser.id,
        url: photo.url,
        description: '新上传的照片',
        privacy: photo.privacy,
        likes: [],
        comments: []
      })
    );
    
    // 添加所有照片
    const newPhotos = uploadPromises.filter(photo => photo !== null) as Photo[];
    
    // 更新相册数据
    setAlbum(prev => prev ? {
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    } : null);
    
    Toast.show({
      content: `成功上传 ${newPhotos.length} 张照片`,
      position: 'bottom',
    });
    
    setShowUploadPopup(false);
  };
  
  // 处理评论提交
  const handleAddComment = (photoId: string, content: string) => {
    if (!album) return;
    
    const comment = commentOnPhoto(album.id, photoId, {
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: content
    });
    
    if (comment) {
      // 更新相册状态
      setAlbum(prev => {
        if (!prev) return null;
        return {
          ...prev,
          photos: prev.photos.map(p => {
            if (p.id === photoId) {
              return {
                ...p,
                comments: [...p.comments, comment]
              };
            }
            return p;
          })
        };
      });
      
      Toast.show({
        content: '评论成功',
        position: 'bottom',
      });
    }
  };
  
  // 过滤照片根据隐私级别
  const getFilteredPhotos = () => {
    if (!album) return [];
    
    switch (activeTab) {
      case 'private':
        return album.photos.filter(photo => photo.privacy === PrivacySetting.PRIVATE);
      case 'friends':
        return album.photos.filter(photo => photo.privacy === PrivacySetting.FRIENDS);
      case 'public':
        return album.photos.filter(photo => photo.privacy === PrivacySetting.PUBLIC);
      case 'all':
      default:
        return album.photos;
    }
  };

  // 如果相册数据未加载，显示加载中
  if (!album) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="album-page">
      {/* 顶部导航栏 */}
      <NavBar 
        back={<BackIcon />} 
        onBack={() => navigate('/profile')} 
        right={<Button size="small" onClick={() => setShowUploadPopup(true)}><AddIcon /> 上传</Button>}
      >
        {album.name}
      </NavBar>
      
      {/* 相册内容 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.Tab title="照片" key="photos">
          <div className="photo-grid">
            {album.photos.length > 0 ? (
              album.photos.map(photo => (
                <div key={photo.id} className="photo-item">
                  <div className="photo-container">
                    <Image src={photo.url} fit="cover" />
                    <div className="photo-overlay">
                      <div className="photo-actions">
                        <Button 
                          className="action-btn"
                          onClick={() => handleLike(photo)}
                        >
                          <LikeIcon active={photo.likes.includes(currentUser.id)} />
                          <span>{photo.likes.length}</span>
                        </Button>
                        <Button 
                          className="action-btn"
                          onClick={() => openCommentPopup(photo)}
                        >
                          <CommentIcon />
                          <span>{photo.comments.length}</span>
                        </Button>
                        <Button 
                          className="action-btn"
                          onClick={() => openPrivacyPopup(photo)}
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
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>还没有照片，点击上传按钮添加照片</p>
                <Button color="primary" onClick={() => setShowUploadPopup(true)}>
                  <AddIcon /> 上传照片
                </Button>
              </div>
            )}
          </div>
        </Tabs.Tab>
        <Tabs.Tab title="相册信息" key="info">
          <div className="album-info">
            <List header="相册详情">
              <List.Item>名称: {album.name}</List.Item>
              <List.Item>描述: {album.description}</List.Item>
              <List.Item>创建时间: {album.createdAt.toLocaleDateString()}</List.Item>
              <List.Item>照片数量: {album.photos.length}</List.Item>
              <List.Item>
                隐私设置: <Tag color={getPrivacyColor(album.privacy)}>{getPrivacyLabel(album.privacy)}</Tag>
              </List.Item>
            </List>
          </div>
        </Tabs.Tab>
      </Tabs>
      
      {/* 上传照片弹窗 */}
      <Popup
        visible={showUploadPopup}
        onMaskClick={() => setShowUploadPopup(false)}
        bodyStyle={{ height: '80vh' }}
      >
        <div className="upload-popup">
          <NavBar onBack={() => setShowUploadPopup(false)}>上传照片</NavBar>
          <div className="upload-content">
            <div className="upload-preview">
              {previewUrl ? (
                <Image src={previewUrl} fit="contain" />
              ) : (
                <div className="upload-placeholder" onClick={() => document.getElementById('photo-upload')?.click()}>
                  <AddIcon />
                  <p>点击选择照片</p>
                </div>
              )}
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
            
            <List header="照片信息">
              <List.Item>
                <TextArea
                  placeholder="添加描述..."
                  value={newPhotoDescription}
                  onChange={val => setNewPhotoDescription(val)}
                  rows={3}
                />
              </List.Item>
              <List.Item title="隐私设置">
                <Space wrap>
                  {privacyOptions.map(option => (
                    <Tag 
                      key={option.value}
                      color={option.color}
                      onClick={() => setNewPhotoPrivacy(option.value)}
                      style={{ 
                        opacity: newPhotoPrivacy === option.value ? 1 : 0.6,
                        padding: '6px 12px'
                      }}
                    >
                      {option.label}
                    </Tag>
                  ))}
                </Space>
              </List.Item>
            </List>
            
            <Button 
              block 
              color="primary" 
              size="large"
              onClick={handleUploadPhoto}
              disabled={!imageFile}
              style={{ marginTop: '16px' }}
            >
              上传
            </Button>
          </div>
        </div>
      </Popup>
      
      {/* 评论弹窗 */}
      <Popup
        visible={showCommentPopup}
        onMaskClick={() => setShowCommentPopup(false)}
        bodyStyle={{ height: '60vh' }}
      >
        <div className="comment-popup">
          <NavBar onBack={() => setShowCommentPopup(false)}>评论</NavBar>
          <div className="comment-list">
            {selectedPhoto && selectedPhoto.comments.length > 0 ? (
              selectedPhoto.comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-avatar">
                    <Image src={comment.userAvatar} width={40} height={40} fit="cover" style={{ borderRadius: '50%' }} />
                  </div>
                  <div className="comment-content">
                    <div className="comment-name">{comment.userName}</div>
                    <div className="comment-text">{comment.content}</div>
                    <div className="comment-time">{comment.createdAt.toLocaleDateString()}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-comment">暂无评论</div>
            )}
          </div>
          <div className="comment-input">
            <TextArea
              placeholder="添加评论..."
              value={newComment}
              onChange={val => setNewComment(val)}
              rows={2}
            />
            <Button color="primary" onClick={handleSubmitComment}>发送</Button>
          </div>
        </div>
      </Popup>
      
      {/* 隐私设置弹窗 */}
      <Popup
        visible={showPrivacyPopup}
        onMaskClick={() => setShowPrivacyPopup(false)}
        bodyStyle={{ height: '40vh' }}
      >
        <div className="privacy-popup">
          <NavBar onBack={() => setShowPrivacyPopup(false)}>隐私设置</NavBar>
          <List header="选择谁可以看到这张照片">
            {privacyOptions.map(option => (
              <List.Item
                key={option.value}
                prefix={<div className="privacy-color-dot" style={{ backgroundColor: option.color }}></div>}
                onClick={() => setNewPhotoPrivacy(option.value)}
                extra={newPhotoPrivacy === option.value ? '✓' : ''}
              >
                {option.label}
              </List.Item>
            ))}
          </List>
          <Button 
            block 
            color="primary" 
            size="large"
            onClick={handleUpdatePrivacy}
            style={{ margin: '16px' }}
          >
            保存
          </Button>
        </div>
      </Popup>
      
      {/* 样式 */}
      <style jsx>{`
        .album-page {
          min-height: 100vh;
          background-color: #f5f5f5;
          padding-bottom: 60px;
        }
        
        .photo-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          padding: 8px;
        }
        
        .photo-item {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
        
        .empty-state {
          grid-column: span 2;
          text-align: center;
          padding: 40px 16px;
        }
        
        .album-info {
          padding: 16px;
        }
        
        .upload-popup {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .upload-content {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
        }
        
        .upload-preview {
          aspect-ratio: 1;
          margin-bottom: 16px;
          border: 1px dashed #ddd;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .upload-placeholder {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #f5f5f5;
          cursor: pointer;
        }
        
        .comment-popup {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .comment-list {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
        }
        
        .comment-item {
          display: flex;
          margin-bottom: 16px;
        }
        
        .comment-avatar {
          margin-right: 12px;
        }
        
        .comment-content {
          flex: 1;
        }
        
        .comment-name {
          font-weight: bold;
          margin-bottom: 4px;
        }
        
        .comment-text {
          margin-bottom: 4px;
        }
        
        .comment-time {
          font-size: 12px;
          color: #999;
        }
        
        .empty-comment {
          text-align: center;
          padding: 40px 0;
          color: #999;
        }
        
        .comment-input {
          display: flex;
          padding: 12px;
          border-top: 1px solid #eee;
          background: white;
        }
        
        .comment-input .adm-text-area {
          flex: 1;
          margin-right: 12px;
        }
        
        .privacy-popup {
          height: 100%;
        }
        
        .privacy-color-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
      `}</style>
    </div>
  );
};

export default AlbumPage;