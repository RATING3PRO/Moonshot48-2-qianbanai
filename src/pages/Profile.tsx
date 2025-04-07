import React, { useState, useEffect } from 'react';
import { List, Avatar, Button, Dialog, Toast, Switch } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SetOutline, QuestionCircleOutline, InformationCircleOutline, CloseCircleOutline } from 'antd-mobile-icons';

// 图标组件
const UserIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;
const SettingsIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>;
const SecurityIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>;
const HelpIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>;
const NotificationIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>;
const LogoutIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>;
const PhotoIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>;
const HealthIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/></svg>;
const FriendsIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;

// AI助手图标
const AIAssistantIcon = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM13.88 12.88L12 11V8H13V10.5L14.5 12L13.88 12.88ZM16.4 16.8C15.63 16.8 15 16.17 15 15.4C15 15.06 15.1 14.73 15.3 14.46L14.5 13.66C14.06 14.09 13.81 14.69 13.81 15.36C13.81 16.85 15.02 18.05 16.51 18.05C17.21 18.05 17.84 17.79 18.27 17.34L17.46 16.53C17.18 16.71 16.81 16.8 16.4 16.8Z"
      />
    </svg>
  );
};

// 定义用户数据接口
interface UserData {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  created_at: string;
  profile: {
    display_name: string;
    avatar: string;
    phone: string;
  };
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [largeTextMode, setLargeTextMode] = useState(false);
  
  // 用户数据状态
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 在组件挂载时获取用户数据
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // 从localStorage或sessionStorage获取用户数据
        const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        console.log('存储的用户数据(userData):', storedUserData);
        console.log('存储的用户数据(user):', storedUser);
        console.log('存储的用户ID:', userId);
        console.log('存储的token:', token);
        
        // 优先使用userData，其次使用user
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
          console.log('已从userData加载用户数据');
        } else if (storedUser) {
          const parsedUserData = JSON.parse(storedUser);
          setUserData(parsedUserData);
          console.log('已从user加载用户数据');
          
          // 同步到userData保持一致性
          const storage = localStorage.getItem('rememberMe') === 'true' ? localStorage : sessionStorage;
          storage.setItem('userData', storedUser);
        }
        
        // 如果有token和userId，尝试从API获取最新数据
        if (token && userId) {
          console.log('正在从API获取最新用户数据');
          const response = await axios.get(`/api/user/profile/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.data.success) {
            console.log('从API获取用户数据成功:', response.data.data);
            setUserData(response.data.data);
            // 更新本地存储
            const storage = localStorage.getItem('rememberMe') === 'true' ? localStorage : sessionStorage;
            storage.setItem('userData', JSON.stringify(response.data.data));
            storage.setItem('user', JSON.stringify(response.data.data)); // 同时更新user字段
          } else {
            console.error('获取用户数据失败:', response.data.message);
            Toast.show({
              icon: 'fail',
              content: '获取用户数据失败: ' + response.data.message,
            });
          }
        } else {
          console.error('没有找到用户凭证，无法获取用户数据');
          if (!storedUserData && !storedUser) {
            Toast.show({
              icon: 'fail',
              content: '请先登录',
            });
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('获取用户数据失败:', error);
        Toast.show({
          icon: 'fail',
          content: '获取用户数据失败',
          duration: 2000
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
  // 处理退出登录
  const handleLogout = () => {
    Dialog.confirm({
      content: '确定要退出登录吗？',
      confirmText: '退出',
      cancelText: '取消',
      onConfirm: () => {
        // 清除本地存储的用户信息
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userData');
        localStorage.removeItem('userId');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('userId');
        
        // 退出登录逻辑
        navigate('/login');
        Toast.show({
          content: '已退出登录',
          duration: 1500,
        });
      },
    });
  };
  
  // 切换高对比度模式
  const toggleHighContrastMode = (checked: boolean) => {
    setHighContrastMode(checked);
    // 实际项目中这里会修改全局样式
    document.body.classList.toggle('high-contrast', checked);
    Toast.show({
      content: checked ? '已开启高对比度模式' : '已关闭高对比度模式',
      duration: 1500,
    });
  };
  
  // 切换大字体模式
  const toggleLargeTextMode = (checked: boolean) => {
    setLargeTextMode(checked);
    // 实际项目中这里会修改全局字体大小
    document.body.style.fontSize = checked ? '1.2rem' : '';
    Toast.show({
      content: checked ? '已开启大字体模式' : '已关闭大字体模式',
      duration: 1500,
    });
  };

  // 格式化加入时间
  const formatJoinDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.getFullYear()}年${date.getMonth() + 1}月`;
    } catch (error) {
      return '未知';
    }
  };

  // 处理用户数据加载中或未找到的情况
  if (loading) {
    return (
      <div className="profile-container" style={{ textAlign: 'center', padding: '50px 0' }}>
        加载中...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="profile-container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <div>未找到用户信息，请重新登录</div>
        <Button 
          color="primary"
          onClick={() => navigate('/login')}
          style={{ marginTop: '20px' }}
        >
          返回登录页
        </Button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1 className="page-title">个人中心</h1>
      
      {/* 用户信息卡片 */}
      <div className="user-card">
        <Avatar 
          src={userData.profile?.avatar || ''} 
          className="user-avatar"
          style={{ width: '80px', height: '80px' }}
        />
        <div className="user-info">
          <div className="user-name">{userData.profile?.display_name || userData.username}</div>
          <div className="user-phone">{userData.phone || '未设置手机号'}</div>
          <div className="user-join-date">加入时间：{formatJoinDate(userData.created_at)}</div>
        </div>
      </div>
      
      {/* 设置列表 */}
      <div className="settings-section">
        <List header='设置'>
          <List.Item prefix={<FriendsIcon />} onClick={() => navigate('/friends')}>
            好友管理
          </List.Item>
          <List.Item prefix={<PhotoIcon />} onClick={() => navigate('/albums')}>
            我的相册
          </List.Item>
          <List.Item prefix={<AIAssistantIcon />} onClick={() => navigate('/chat')}>
            AI助手
          </List.Item>
          <List.Item prefix={<SetOutline />} onClick={() => navigate('/settings')}>
            系统设置
          </List.Item>
          <List.Item prefix={<QuestionCircleOutline />} onClick={() => navigate('/help')}>
            帮助中心
          </List.Item>
          <List.Item prefix={<InformationCircleOutline />} onClick={() => navigate('/about')}>
            关于我们
          </List.Item>
          <List.Item 
            prefix={<CloseCircleOutline />} 
            onClick={handleLogout}
            style={{ color: '#ff3141' }}
          >
            退出登录
          </List.Item>
        </List>
        
        <List header="辅助功能" className="accessibility-section">
          <List.Item 
            prefix={<SettingsIcon />}
            extra={<Switch checked={highContrastMode} onChange={toggleHighContrastMode} />}
          >
            高对比度模式
          </List.Item>
          <List.Item 
            prefix={<SettingsIcon />}
            extra={<Switch checked={largeTextMode} onChange={toggleLargeTextMode} />}
          >
            大字体模式
          </List.Item>
        </List>
        
        <List header="帮助与支持">
          <List.Item prefix={<HelpIcon />} onClick={() => Toast.show('使用帮助功能即将上线')}>使用帮助</List.Item>
          <List.Item prefix={<HelpIcon />} onClick={() => Toast.show('关于我们功能即将上线')}>关于我们</List.Item>
        </List>
      </div>
      
      {/* 退出登录按钮 */}
      <Button 
        className="logout-button" 
        block 
        color="danger" 
        onClick={handleLogout}
      >
        <LogoutIcon />
        <span className="logout-text">退出登录</span>
      </Button>
      
      {/* 个人中心样式 */}
      <style>{`
        .profile-container {
          padding: 16px;
          padding-bottom: 80px;
        }
        
        .user-card {
          display: flex;
          align-items: center;
          background-color: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .user-avatar {
          margin-right: 20px;
        }
        
        .user-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        
        .user-phone, .user-join-date {
          color: #999;
          margin-bottom: 4px;
        }
        
        .settings-section {
          margin-bottom: 20px;
        }
        
        .accessibility-section {
          margin-top: 16px;
        }
        
        .logout-button {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 32px;
          height: 50px;
          font-size: 16px;
        }
        
        .logout-text {
          margin-left: 8px;
        }
      `}</style>
    </div>
  );
};

export default Profile;