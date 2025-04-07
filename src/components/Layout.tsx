import React, { useState, useContext } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Badge, TabBar, Popover, Button } from 'antd-mobile';
import { 
  AppOutline, 
  MessageOutline, 
  UserOutline, 
  UnorderedListOutline,
  SetOutline,
  TextOutline
} from 'antd-mobile-icons';
import { FontSizeContext } from '../App';
import '../styles/Layout.css';

// 图标组件
const HomeIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
const ChatIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>;
const VideoIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>;
const ProfileIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;
const GroupIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
const MicIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>;
const PhotoIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>;

// 好友图标
const FriendsIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
      fill={active ? "#1677ff" : "#999"}
    />
  </svg>
);

// AI助手图标
const AIAssistantIcon = ({ active }: { active: boolean }) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM13.88 12.88L12 11V8H13V10.5L14.5 12L13.88 12.88ZM16.4 16.8C15.63 16.8 15 16.17 15 15.4C15 15.06 15.1 14.73 15.3 14.46L14.5 13.66C14.06 14.09 13.81 14.69 13.81 15.36C13.81 16.85 15.02 18.05 16.51 18.05C17.21 18.05 17.84 17.79 18.27 17.34L17.46 16.53C17.18 16.71 16.81 16.8 16.4 16.8ZM17.36 12.7C17.73 12.89 18.04 13.15 18.29 13.46C18.47 13.7 18.7 14.31 18.7 15.36C18.7 15.87 18.59 16.31 18.36 16.67L19.55 17.86C20.13 17.13 20.51 16.14 20.51 14.9L20.5 14.9C20.5 13.4 20 12.19 19.03 11.21L18.23 12.01C17.96 12.28 17.63 12.5 17.36 12.7ZM15.6 11.5C16.37 11.5 17 12.13 17 12.9C17 13.24 16.9 13.57 16.7 13.84L17.5 14.64C17.94 14.21 18.19 13.61 18.19 12.94C18.19 11.45 16.98 10.25 15.49 10.25C14.79 10.25 14.16 10.51 13.73 10.96L14.54 11.77C14.82 11.59 15.19 11.5 15.6 11.5ZM14.64 9.5C14.27 9.31 13.96 9.05 13.71 8.74C13.53 8.5 13.3 7.89 13.3 6.84C13.3 6.33 13.41 5.89 13.64 5.53L12.45 4.34C11.87 5.07 11.49 6.06 11.49 7.3L11.5 7.3C11.5 8.8 12 10.01 12.97 10.99L13.77 10.19C14.04 9.93 14.38 9.7 14.64 9.5ZM16.4 7.3C15.63 7.3 15 6.67 15 5.9C15 5.56 15.1 5.23 15.3 4.96L14.5 4.16C14.06 4.59 13.81 5.19 13.81 5.86C13.81 7.35 15.02 8.55 16.51 8.55C17.21 8.55 17.84 8.29 18.27 7.84L17.46 7.03C17.18 7.22 16.8 7.3 16.4 7.3Z"
        fill={active ? "#1677ff" : "#999"}
      />
    </svg>
  );
};

// 定义Layout组件的Props类型
interface LayoutProps {
  children?: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // 示例：是否有新消息
  const [hasNewMessages] = useState(true);
  // 使用字体大小上下文
  const { fontSize, setFontSize } = useContext(FontSizeContext);

  // Tab栏变化处理
  const onTabBarChange = (key: string) => {
    navigate(key);
  };

  // 设置页面标题
  React.useEffect(() => {
    if (title) {
      document.title = `${title} - AI牵伴`;
    } else {
      document.title = 'AI牵伴';
    }
  }, [title]);

  // 字体大小调整
  const changeFontSize = (size: number) => {
    if (fontSize + size >= 0.8 && fontSize + size <= 1.8) {
      setFontSize(fontSize + size);
    }
  };

  // 底部导航项
  const tabs = [
    {
      key: '/',
      title: '首页',
      icon: <AppOutline />,
    },
    {
      key: '/activity',
      title: '活动',
      icon: <UnorderedListOutline />,
    },
    {
      key: '/chat',
      title: '聊天',
      icon: <MessageOutline />,
    },
    {
      key: '/ai-chat',
      title: 'AI助手',
      icon: <SetOutline />,
    },
    {
      key: '/profile',
      title: '我的',
      icon: <UserOutline />,
    },
  ];

  return (
    <div className="layout-container">
      <div className="top-right-tools">
        <Popover
          content={
            <div className="font-size-tools">
              <div className="font-size-title">字体大小</div>
              <div className="font-size-controls">
                <Button 
                  shape="rounded" 
                  size="mini" 
                  onClick={() => changeFontSize(-0.1)}
                >
                  A-
                </Button>
                <span className="font-size-value">{Math.round(fontSize * 100)}%</span>
                <Button 
                  shape="rounded" 
                  size="mini" 
                  onClick={() => changeFontSize(0.1)}
                >
                  A+
                </Button>
              </div>
            </div>
          }
          trigger="click"
          placement="bottom-end"
        >
          <div className="font-size-button">
            <TextOutline fontSize={26} />
          </div>
        </Popover>
      </div>
      
      <div className="main-content">
        <Outlet />
      </div>
      
      <TabBar 
        className="tab-bar"
        activeKey={location.pathname}
        onChange={value => navigate(value)}
      >
        {tabs.map(item => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
      
      {/* 语音提示弹窗 */}
      <div className="voice-popup" style={{ display: 'none' }}>
        <div className="voice-popup-inner">
          <div className="voice-icon">
            <MicIcon />
          </div>
          <div className="voice-text">正在聆听...</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;