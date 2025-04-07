import React, { useState, useEffect } from 'react';
import { 
  NavBar, 
  List, 
  Avatar, 
  Button, 
  Badge, 
  SearchBar, 
  Tabs, 
  Empty, 
  Dialog, 
  Form, 
  Input, 
  Toast, 
  SwipeAction, 
  Popup,
  Space,
  DotLoading,
  Tag
} from 'antd-mobile';
import { AddOutline, DeleteOutline, MessageOutline, VideoOutline, UserAddOutline, UserContactOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 好友类型定义
interface Friend {
  id: number;
  username: string;
  phone: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen?: string;
  relationship: 'friend' | 'pending' | 'requested';
  tag?: string[];
  note?: string;
}

// 搜索用户结果类型
interface UserSearchResult {
  id: number;
  username: string;
  phone: string;
  avatar?: string;
  relationship?: 'friend' | 'pending' | 'requested' | 'none';
}

const Friends: React.FC = () => {
  const navigate = useNavigate();
  
  // 好友数据状态
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [sentRequests, setSentRequests] = useState<Friend[]>([]);
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState({
    friends: true,
    search: false,
    request: false
  });
  
  // UI 状态
  const [searchValue, setSearchValue] = useState('');
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [activeFriend, setActiveFriend] = useState<Friend | null>(null);
  const [activeTab, setActiveTab] = useState('friends');
  
  // 加载好友数据
  useEffect(() => {
    // 从localStorage或sessionStorage获取用户ID
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    if (userId) {
      fetchFriends(parseInt(userId));
    } else {
      Toast.show({
        content: '请先登录',
        afterClose: () => {
          navigate('/login');
        },
      });
    }
  }, []);
  
  // 从API获取好友列表
  const fetchFriends = async (userId: number) => {
    setLoading({...loading, friends: true});
    try {
      // 调用后端API获取好友数据
      const response = await axios.get(`/api/friends/${userId}`);
      
      if (response.data.success) {
        const data = response.data.data;
        setFriends(data.friends || []);
        setPendingRequests(data.pending || []);
        setSentRequests(data.requested || []);
      } else {
        Toast.show({
          icon: 'fail',
          content: response.data.message || '获取好友列表失败'
        });
      }
    } catch (error) {
      console.error('获取好友列表失败:', error);
      Toast.show({
        icon: 'fail',
        content: '获取好友列表失败'
      });
    } finally {
      setLoading({...loading, friends: false});
    }
  };
  
  // 搜索用户
  const searchUsers = async (searchText: string) => {
    if (!searchText.trim()) {
      setSearchResults([]);
      return;
    }
    
    setLoading({...loading, search: true});
    
    try {
      console.log('正在搜索用户:', searchText);
      // 调用后端API搜索用户
      const response = await axios.get(`/api/users/search?query=${encodeURIComponent(searchText)}`);
      
      console.log('搜索结果:', response.data);
      
      if (response.data.success) {
        // 处理搜索结果，添加relationship属性
        const results = response.data.data.map((user: any) => {
          // 检查是否已是好友
          const isFriend = friends.some(friend => friend.id === user.id);
          
          // 检查是否已发送请求
          const isRequested = sentRequests.some(req => req.id === user.id);
          
          // 检查是否有待处理的请求
          const isPending = pendingRequests.some(req => req.id === user.id);
          
          // 设置关系状态
          let relationship = 'none';
          if (isFriend) relationship = 'friend';
          else if (isRequested) relationship = 'requested';
          else if (isPending) relationship = 'pending';
          
          console.log(`用户 ${user.username} (ID: ${user.id}) 关系: ${relationship}`);
          
          return {
            ...user,
            relationship
          };
        });
        
        setSearchResults(results);
      } else {
        console.error('搜索失败:', response.data.message);
        Toast.show({
          icon: 'fail',
          content: response.data.message || '搜索失败'
        });
      }
    } catch (error: any) {
      console.error('搜索用户失败:', error);
      // 打印更详细的错误信息
      if (error.response) {
        // 服务器响应了，但状态码不是2xx
        console.error('错误响应:', error.response.data);
        console.error('错误状态码:', error.response.status);
      } else if (error.request) {
        // 请求已发送但没有收到响应
        console.error('没有收到响应:', error.request);
      } else {
        // 请求设置时发生错误
        console.error('请求错误:', error.message);
      }
      
      Toast.show({
        icon: 'fail',
        content: '搜索用户失败'
      });
    } finally {
      setLoading({...loading, search: false});
    }
  };
  
  // 发送好友请求
  const sendFriendRequest = async (userId: number) => {
    setLoading({...loading, request: true});
    
    try {
      // 调用后端API发送好友请求
      const response = await axios.post('/api/friends/request', { 
        userId: localStorage.getItem('userId') || sessionStorage.getItem('userId'),
        targetId: userId 
      });
      
      if (response.data.success) {
        // 找到被请求的用户
        const requestedUser = searchResults.find(user => user.id === userId);
        
        if (requestedUser) {
          // 创建新的请求记录
          const newRequest: Friend = {
            id: requestedUser.id,
            username: requestedUser.username,
            phone: requestedUser.phone,
            avatar: requestedUser.avatar || 'https://via.placeholder.com/40',
            status: 'offline',
            relationship: 'requested'
          };
          
          // 更新已发送请求列表
          setSentRequests([...sentRequests, newRequest]);
          
          // 更新搜索结果中的关系状态
          setSearchResults(
            searchResults.map(user => 
              user.id === userId 
                ? {...user, relationship: 'requested'} 
                : user
            )
          );
          
          Toast.show({
            icon: 'success',
            content: '已发送好友请求'
          });
        }
      } else {
        Toast.show({
          icon: 'fail',
          content: response.data.message || '发送请求失败'
        });
      }
    } catch (error) {
      console.error('发送好友请求失败:', error);
      Toast.show({
        icon: 'fail',
        content: '发送好友请求失败'
      });
    } finally {
      setLoading({...loading, request: false});
    }
  };
  
  // 接受好友请求
  const acceptFriendRequest = async (userId: number) => {
    try {
      // 获取当前用户ID
      const currentUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      if (!currentUserId) {
        Toast.show({
          content: '请先登录',
          afterClose: () => {
            navigate('/login');
          },
        });
        return;
      }
      
      // 调用后端API接受好友请求
      const response = await axios.post('/api/friends/accept', {
        userId: parseInt(currentUserId),
        requestId: userId
      });
      
      if (response.data.success) {
        // 在pendingRequests中找到对应的请求
        const acceptedRequest = pendingRequests.find(request => request.id === userId);
        
        if (acceptedRequest) {
          // 从待处理请求中移除
          setPendingRequests(pendingRequests.filter(request => request.id !== userId));
          
          // 添加到好友列表
          const newFriend: Friend = {
            ...acceptedRequest,
            relationship: 'friend'
          };
          
          setFriends([...friends, newFriend]);
          
          Toast.show({
            icon: 'success',
            content: '已添加为好友'
          });
        }
      } else {
        Toast.show({
          icon: 'fail',
          content: response.data.message || '操作失败'
        });
      }
    } catch (error) {
      console.error('接受好友请求失败:', error);
      Toast.show({
        icon: 'fail',
        content: '操作失败'
      });
    }
  };
  
  // 拒绝好友请求
  const rejectFriendRequest = async (userId: number) => {
    try {
      // 获取当前用户ID
      const currentUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      if (!currentUserId) {
        Toast.show({
          content: '请先登录',
          afterClose: () => {
            navigate('/login');
          },
        });
        return;
      }
      
      // 调用后端API拒绝好友请求
      const response = await axios.post('/api/friends/reject', {
        userId: parseInt(currentUserId),
        requestId: userId
      });
      
      if (response.data.success) {
        // 从待处理请求中移除
        setPendingRequests(pendingRequests.filter(request => request.id !== userId));
        
        Toast.show({
          content: '已拒绝请求'
        });
      } else {
        Toast.show({
          icon: 'fail',
          content: response.data.message || '操作失败'
        });
      }
    } catch (error) {
      console.error('拒绝好友请求失败:', error);
      Toast.show({
        icon: 'fail',
        content: '操作失败'
      });
    }
  };
  
  // 取消已发送的好友请求
  const cancelFriendRequest = async (userId: number) => {
    try {
      // 获取当前用户ID
      const currentUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      if (!currentUserId) {
        Toast.show({
          content: '请先登录',
          afterClose: () => {
            navigate('/login');
          },
        });
        return;
      }
      
      // 调用后端API取消好友请求
      const response = await axios.delete(`/api/friends/request/${currentUserId}/${userId}`);
      
      if (response.data.success) {
        // 从已发送请求中移除
        setSentRequests(sentRequests.filter(req => req.id !== userId));
        
        // 更新搜索结果中的关系状态
        setSearchResults(
          searchResults.map(user => 
            user.id === userId 
              ? {...user, relationship: 'none'} 
              : user
          )
        );
        
        Toast.show({
          content: '已取消请求'
        });
      } else {
        Toast.show({
          icon: 'fail',
          content: response.data.message || '操作失败'
        });
      }
    } catch (error) {
      console.error('取消好友请求失败:', error);
      Toast.show({
        icon: 'fail',
        content: '操作失败'
      });
    }
  };
  
  // 删除好友
  const deleteFriend = async (userId: number) => {
    Dialog.confirm({
      content: '确定要删除此好友吗？',
      onConfirm: async () => {
        try {
          // 获取当前用户ID
          const currentUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
          if (!currentUserId) {
            Toast.show({
              content: '请先登录',
              afterClose: () => {
                navigate('/login');
              },
            });
            return;
          }
          
          // 调用后端API删除好友
          const response = await axios.delete(`/api/friends/${currentUserId}/${userId}`);
          
          if (response.data.success) {
            // 从好友列表中移除
            setFriends(friends.filter(friend => friend.id !== userId));
            
            Toast.show({
              icon: 'success',
              content: '已删除好友'
            });
          } else {
            Toast.show({
              icon: 'fail',
              content: response.data.message || '操作失败'
            });
          }
        } catch (error) {
          console.error('删除好友失败:', error);
          Toast.show({
            icon: 'fail',
            content: '操作失败'
          });
        }
      }
    });
  };
  
  // 处理添加好友按钮点击
  const handleAddFriend = () => {
    setSearchValue('');
    setSearchResults([]);
    setShowAddPopup(true);
  };
  
  // 处理搜索输入变化
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    searchUsers(value);
  };
  
  // 显示用户状态图标
  const renderStatusIndicator = (status: string) => {
    const statusStyles = {
      online: { backgroundColor: '#10b981' },
      offline: { backgroundColor: '#9ca3af' },
      busy: { backgroundColor: '#f59e0b' }
    };
    
    return (
      <div 
        className="status-indicator" 
        style={status === 'online' ? statusStyles.online : 
               status === 'busy' ? statusStyles.busy : statusStyles.offline}
      />
    );
  };
  
  return (
    <div className="friends-container">
      <NavBar back={null}>好友</NavBar>
      
      {/* 搜索框和添加按钮 */}
      <div className="search-container">
        <SearchBar
          placeholder="搜索好友"
          value={searchValue}
          onChange={handleSearchChange}
          onSearch={(value) => searchUsers(value)}
          style={{ '--background': '#f5f5f5' }}
        />
        <Button 
          size="small"
          color="primary"
          onClick={handleAddFriend}
          style={{ marginLeft: '8px' }}
        >
          <AddOutline />
        </Button>
      </div>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.Tab title="好友" key="friends">
          {loading.friends ? (
            <div className="loading-container">
              <DotLoading />
              <span>加载中...</span>
            </div>
          ) : friends.length === 0 ? (
            <div className="empty-container">
              <Empty
                description="暂无好友"
                imageStyle={{ width: 128 }}
              />
              <Button 
                color="primary" 
                onClick={handleAddFriend}
                style={{ marginTop: '16px' }}
              >
                添加好友
              </Button>
            </div>
          ) : (
            <List>
              {friends.map(friend => (
                <SwipeAction
                  key={friend.id}
                  rightActions={[
                    {
                      key: 'delete',
                      text: '删除',
                      color: 'danger',
                      onClick: () => deleteFriend(friend.id)
                    }
                  ]}
                >
                  <List.Item
                    prefix={
                      <div className="avatar-container">
                        <Avatar src={friend.avatar} />
                        {renderStatusIndicator(friend.status)}
                      </div>
                    }
                    title={friend.username}
                    description={
                      <div className="friend-description">
                        <div>{friend.phone}</div>
                        {friend.tag && friend.tag.length > 0 && (
                          <Space wrap>
                            {friend.tag.map((tag, index) => (
                              <Tag key={index} color="primary" fill="outline" style={{ fontSize: '10px' }}>
                                {tag}
                              </Tag>
                            ))}
                          </Space>
                        )}
                      </div>
                    }
                    arrow={null}
                    extra={
                      <Space>
                        <Button 
                          size="mini" 
                          onClick={() => navigate(`/chat/${friend.id}`)}
                        >
                          <MessageOutline />
                        </Button>
                        <Button 
                          size="mini" 
                          onClick={() => navigate(`/videocall/${friend.id}`)}
                        >
                          <VideoOutline />
                        </Button>
                      </Space>
                    }
                  />
                </SwipeAction>
              ))}
            </List>
          )}
        </Tabs.Tab>
        
        <Tabs.Tab title={`新的好友请求 ${pendingRequests.length > 0 ? `(${pendingRequests.length})` : ''}`} key="requests">
          {loading.friends ? (
            <div className="loading-container">
              <DotLoading />
              <span>加载中...</span>
            </div>
          ) : pendingRequests.length === 0 ? (
            <Empty
              description="暂无好友请求"
              imageStyle={{ width: 128 }}
            />
          ) : (
            <List>
              {pendingRequests.map(request => (
                <List.Item
                  key={request.id}
                  prefix={<Avatar src={request.avatar} />}
                  title={request.username}
                  description={request.phone}
                  extra={
                    <Space>
                      <Button 
                        size="mini" 
                        color="primary"
                        onClick={() => acceptFriendRequest(request.id)}
                      >
                        接受
                      </Button>
                      <Button 
                        size="mini"
                        onClick={() => rejectFriendRequest(request.id)}
                      >
                        拒绝
                      </Button>
                    </Space>
                  }
                />
              ))}
            </List>
          )}
        </Tabs.Tab>
        
        <Tabs.Tab title="已发送请求" key="sent">
          {loading.friends ? (
            <div className="loading-container">
              <DotLoading />
              <span>加载中...</span>
            </div>
          ) : sentRequests.length === 0 ? (
            <Empty
              description="暂无已发送的请求"
              imageStyle={{ width: 128 }}
            />
          ) : (
            <List>
              {sentRequests.map(request => (
                <List.Item
                  key={request.id}
                  prefix={<Avatar src={request.avatar} />}
                  title={request.username}
                  description={request.phone}
                  extra={
                    <Button 
                      size="mini"
                      onClick={() => cancelFriendRequest(request.id)}
                    >
                      取消
                    </Button>
                  }
                />
              ))}
            </List>
          )}
        </Tabs.Tab>
      </Tabs>
      
      {/* 添加好友弹窗 */}
      <Popup
        visible={showAddPopup}
        onMaskClick={() => setShowAddPopup(false)}
        position="bottom"
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          minHeight: '40vh',
          maxHeight: '70vh',
          paddingBottom: '24px'
        }}
      >
        <div className="popup-header">
          <div className="popup-title">添加好友</div>
          <Button className="close-button" onClick={() => setShowAddPopup(false)}>
            关闭
          </Button>
        </div>
        
        <div className="popup-content">
          <SearchBar
            placeholder="搜索手机号或用户名添加好友"
            value={searchValue}
            onChange={handleSearchChange}
            style={{ '--background': '#f5f5f5' }}
            showCancelButton
          />
          
          {loading.search ? (
            <div className="loading-container">
              <DotLoading />
              <span>搜索中...</span>
            </div>
          ) : searchResults.length === 0 ? (
            <Empty
              description={searchValue ? "未找到相关用户" : "请输入手机号或用户名"}
              imageStyle={{ width: 128 }}
            />
          ) : (
            <List>
              {searchResults.map(user => (
                <List.Item
                  key={user.id}
                  prefix={<Avatar src={user.avatar || 'https://via.placeholder.com/40'} />}
                  title={user.username}
                  description={user.phone}
                  extra={
                    user.relationship === 'friend' ? (
                      <Button size="mini" disabled>已是好友</Button>
                    ) : user.relationship === 'requested' ? (
                      <Button 
                        size="mini"
                        onClick={() => cancelFriendRequest(user.id)}
                      >
                        取消请求
                      </Button>
                    ) : user.relationship === 'pending' ? (
                      <Space>
                        <Button 
                          size="mini" 
                          color="primary"
                          onClick={() => acceptFriendRequest(user.id)}
                        >
                          接受
                        </Button>
                        <Button 
                          size="mini"
                          onClick={() => rejectFriendRequest(user.id)}
                        >
                          拒绝
                        </Button>
                      </Space>
                    ) : (
                      <Button 
                        size="mini"
                        color="primary"
                        onClick={() => sendFriendRequest(user.id)}
                        loading={loading.request}
                      >
                        <UserAddOutline /> 添加
                      </Button>
                    )
                  }
                />
              ))}
            </List>
          )}
        </div>
      </Popup>
      
      {/* 样式 */}
      <style>{`
        .friends-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          padding-bottom: 60px;
        }
        
        .search-container {
          display: flex;
          padding: 12px;
          background-color: white;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 0;
          color: #999;
        }
        
        .empty-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 0;
        }
        
        .avatar-container {
          position: relative;
        }
        
        .status-indicator {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid white;
        }
        
        .friend-description {
          display: flex;
          flex-direction: column;
        }
        
        .popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .popup-title {
          font-size: 16px;
          font-weight: bold;
        }
        
        .close-button {
          font-size: 14px;
          color: #999;
          background: none;
          border: none;
        }
        
        .popup-content {
          padding: 16px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default Friends; 