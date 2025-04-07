import React, { useState, useEffect } from 'react';
import { NavBar, Grid, Card, Button, Dialog, Form, Input, Toast, Selector, Tabs } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { Album, PrivacySetting, getUserAlbums, createAlbum } from '../services/albumService';

// 图标组件
const BackIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>;
const AddIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const PhotoIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>;

// 隐私设置选项
const privacyOptions = [
  { value: PrivacySetting.PRIVATE, label: '仅自己可见' },
  { value: PrivacySetting.FRIENDS, label: '朋友可见' },
  { value: PrivacySetting.PUBLIC, label: '所有人可见' },
];

// 相册列表页面组件
const AlbumsPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [albums, setAlbums] = useState<Album[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // 模拟当前用户
  const currentUser = {
    id: 'user1',
    name: '张大爷',
  };
  
  // 加载用户相册
  useEffect(() => {
    const userAlbums = getUserAlbums(currentUser.id);
    setAlbums(userAlbums);
  }, []);
  
  // 创建新相册
  const handleCreateAlbum = async () => {
    try {
      const values = await form.validateFields();
      
      const newAlbum = createAlbum({
        userId: currentUser.id,
        name: values.name,
        description: values.description,
        coverUrl: 'https://via.placeholder.com/300', // 默认封面
        privacy: values.privacy[0] as PrivacySetting, // Selector返回数组
        photos: []
      });
      
      // 更新相册列表
      setAlbums(prev => [...prev, newAlbum]);
      
      // 关闭对话框并重置表单
      setShowCreateDialog(false);
      form.resetFields();
      
      Toast.show({
        content: '相册创建成功',
        position: 'bottom',
      });
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };
  
  // 打开相册详情
  const handleOpenAlbum = (albumId: string) => {
    navigate(`/album/${albumId}`);
  };

  // 根据隐私设置过滤相册
  const getFilteredAlbums = () => {
    switch (activeTab) {
      case 'private':
        return albums.filter(album => album.privacy === PrivacySetting.PRIVATE);
      case 'friends':
        return albums.filter(album => album.privacy === PrivacySetting.FRIENDS);
      case 'public':
        return albums.filter(album => album.privacy === PrivacySetting.PUBLIC);
      case 'all':
      default:
        return albums;
    }
  };

  const filteredAlbums = getFilteredAlbums();

  return (
    <div className="albums-page">
      {/* 顶部导航栏 */}
      <NavBar 
        back={<BackIcon />} 
        onBack={() => navigate('/profile')} 
        right={
          <Button 
            size="small" 
            onClick={() => setShowCreateDialog(true)}
          >
            <AddIcon /> 新建
          </Button>
        }
      >
        我的相册
      </NavBar>
      
      {/* 隐私分类标签页 */}
      <Tabs 
        activeKey={activeTab}
        onChange={setActiveTab}
        className="privacy-tabs"
      >
        <Tabs.Tab title="全部" key="all" />
        <Tabs.Tab 
          title={`仅自己可见 (${albums.filter(a => a.privacy === PrivacySetting.PRIVATE).length})`}
          key="private" 
        />
        <Tabs.Tab 
          title={`朋友可见 (${albums.filter(a => a.privacy === PrivacySetting.FRIENDS).length})`}
          key="friends" 
        />
        <Tabs.Tab 
          title={`所有人可见 (${albums.filter(a => a.privacy === PrivacySetting.PUBLIC).length})`}
          key="public" 
        />
      </Tabs>
      
      {/* 相册列表 */}
      <div className="albums-container">
        {filteredAlbums.length > 0 ? (
          <Grid columns={2} gap={8}>
            {filteredAlbums.map(album => (
              <Grid.Item key={album.id}>
                <Card 
                  onClick={() => handleOpenAlbum(album.id)}
                  className="album-card"
                >
                  <div className="album-cover">
                    <img src={album.coverUrl} alt={album.name} />
                    <div className="album-photo-count">
                      <PhotoIcon />
                      <span>{album.photos.length}</span>
                    </div>
                  </div>
                  <div className="album-info">
                    <div className="album-name">{album.name}</div>
                    <div className="album-privacy">
                      {album.privacy === PrivacySetting.PRIVATE && '仅自己可见'}
                      {album.privacy === PrivacySetting.FRIENDS && '朋友可见'}
                      {album.privacy === PrivacySetting.PUBLIC && '所有人可见'}
                    </div>
                    <div className="album-date">{album.createdAt.toLocaleDateString()}</div>
                  </div>
                </Card>
              </Grid.Item>
            ))}
          </Grid>
        ) : (
          <div className="empty-state">
            <PhotoIcon />
            <p>您还没有创建{activeTab !== 'all' ? (
              activeTab === 'private' ? '仅自己可见的' : 
              activeTab === 'friends' ? '朋友可见的' : '所有人可见的'
            ) : ''}相册</p>
            <Button color="primary" onClick={() => setShowCreateDialog(true)}>
              <AddIcon /> 创建相册
            </Button>
          </div>
        )}
      </div>
      
      {/* 创建相册对话框 */}
      <Dialog
        visible={showCreateDialog}
        title="创建新相册"
        content={
          <Form
            form={form}
            layout="vertical"
            footer={
              <Button block type="submit" color="primary" onClick={handleCreateAlbum}>
                创建
              </Button>
            }
          >
            <Form.Item
              name="name"
              label="相册名称"
              rules={[{ required: true, message: '请输入相册名称' }]}
            >
              <Input placeholder="请输入相册名称" />
            </Form.Item>
            
            <Form.Item
              name="description"
              label="相册描述"
            >
              <Input placeholder="请输入相册描述" />
            </Form.Item>
            
            <Form.Item
              name="privacy"
              label="隐私设置"
              rules={[{ required: true, message: '请选择隐私设置' }]}
              initialValue={[PrivacySetting.PRIVATE]}
            >
              <Selector
                options={privacyOptions}
                showCheckMark={false}
              />
            </Form.Item>
          </Form>
        }
        closeOnAction
        actions={[
          {
            key: 'cancel',
            text: '取消',
            onClick: () => {
              setShowCreateDialog(false);
              form.resetFields();
            }
          }
        ]}
      />
      
      {/* 样式 */}
      <style>
        {`
          .albums-page {
            min-height: 100vh;
            background-color: #f5f5f5;
            padding-bottom: 60px;
          }
          
          .privacy-tabs {
            background: white;
            position: sticky;
            top: 0;
            z-index: 10;
            margin-bottom: 8px;
          }
          
          .albums-container {
            padding: 16px;
          }
          
          .album-card {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .album-cover {
            position: relative;
            aspect-ratio: 1;
            background-color: #eee;
          }
          
          .album-cover img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .album-photo-count {
            position: absolute;
            bottom: 8px;
            right: 8px;
            background-color: rgba(0, 0, 0, 0.6);
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            font-size: 12px;
          }
          
          .album-photo-count svg {
            width: 16px;
            height: 16px;
            margin-right: 4px;
          }
          
          .album-info {
            padding: 8px;
          }
          
          .album-name {
            font-weight: bold;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .album-privacy {
            font-size: 12px;
            color: #666;
            margin-bottom: 4px;
          }
          
          .album-date {
            font-size: 12px;
            color: #999;
          }
          
          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 64px 0;
            color: #999;
          }
          
          .empty-state svg {
            width: 48px;
            height: 48px;
            margin-bottom: 16px;
            opacity: 0.5;
          }
          
          .empty-state p {
            margin-bottom: 16px;
          }
        `}
      </style>
    </div>
  );
};

export default AlbumsPage;