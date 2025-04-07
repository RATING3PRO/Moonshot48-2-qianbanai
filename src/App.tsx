import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd-mobile';
import zhCN from 'antd-mobile/es/locales/zh-CN';
import Layout from './components/Layout';
import Loading from './components/Loading';
import AIChat from './pages/AIChat';
import RemoteAI from './pages/RemoteAI';
import NetworkAccess from './pages/NetworkAccess';

// 页面组件懒加载
const Home = lazy(() => import('./pages/Home'));
const Chat = lazy(() => import('./pages/Chat'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const RemoteChat = lazy(() => import('./pages/RemoteChat'));
const HuggingFaceChat = lazy(() => import('./pages/HuggingFaceChat'));
const HealthRecord = lazy(() => import('./pages/HealthRecord'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Friends = lazy(() => import('./pages/Friends'));
const PrivateChat = lazy(() => import('./pages/PrivateChat'));
const Activity = lazy(() => import('./pages/Activity'));
const Neighbor = lazy(() => import('./pages/Neighbor'));
const Social = lazy(() => import('./pages/Social'));
const Groups = lazy(() => import('./pages/Groups'));
const GroupChat = lazy(() => import('./pages/GroupChat'));
const Albums = lazy(() => import('./pages/Albums'));
const Album = lazy(() => import('./pages/Album'));

// 全局样式
import './styles/App.css';

// 创建字体比例上下文
export const FontSizeContext = React.createContext({
  fontSize: 1.0,
  setFontSize: (size: number) => {}
});

const App: React.FC = () => {
  // 存储字体大小比例，默认为1.2（比原来大20%）
  const [fontSize, setFontSize] = useState<number>(
    parseFloat(localStorage.getItem('app_font_size') || '1.2')
  );
  
  // 当字体大小变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem('app_font_size', fontSize.toString());
    // 应用到根元素
    document.documentElement.style.fontSize = `${fontSize * 100}%`;
  }, [fontSize]);
  
  // 字体大小上下文值
  const fontSizeContextValue = { fontSize, setFontSize };
  
  return (
    <FontSizeContext.Provider value={fontSizeContextValue}>
      <ConfigProvider locale={zhCN}>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* 认证页面 */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* 管理面板 */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* 主应用布局 */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<Home />} />
              <Route path="chat" element={<Chat />} />
              <Route path="chat/:friendId" element={<PrivateChat />} />
              <Route path="ai-chat" element={<AIChat />} />
              <Route path="remote-chat" element={<RemoteChat />} />
              <Route path="huggingface-chat" element={<HuggingFaceChat />} />
              <Route path="profile" element={<Profile />} />
              <Route path="health-record" element={<HealthRecord />} />
              <Route path="friends" element={<Friends />} />
              <Route path="activity" element={<Activity />} />
              <Route path="neighbor" element={<Neighbor />} />
              <Route path="social" element={<Social />} />
              <Route path="groups" element={<Groups />} />
              <Route path="group-chat/:groupId" element={<GroupChat />} />
              <Route path="albums" element={<Albums />} />
              <Route path="album/:albumId" element={<Album />} />
            </Route>
            
            {/* 添加局域网访问相关路由 */}
            <Route path="/remote-ai" element={<RemoteAI />} />
            <Route path="/network-access" element={<NetworkAccess />} />
            
            {/* 默认重定向到首页 */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Suspense>
      </ConfigProvider>
    </FontSizeContext.Provider>
  );
};

export default App;