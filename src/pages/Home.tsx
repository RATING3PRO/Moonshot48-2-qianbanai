import React from 'react';
import { TabBar, Grid, Card } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppOutline,
  MessageOutline,
  UserOutline,
  TeamOutline,
  EnvironmentOutline,
  CalendarOutline,
  UserContactOutline,
} from 'antd-mobile-icons';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const features = [
    {
      icon: <CalendarOutline fontSize={32} color="#ff4d4f" />,
      title: '活动',
      desc: '参与社区活动',
      path: '/activity'
    },
    {
      icon: <EnvironmentOutline fontSize={32} color="#1890ff" />,
      title: '邻居',
      desc: '发现身边的朋友',
      path: '/neighbor'
    },
    {
      icon: <TeamOutline fontSize={32} color="#52c41a" />,
      title: '群组',
      desc: '加入兴趣小组',
      path: '/social'
    },
    {
      icon: <UserContactOutline fontSize={32} color="#722ed1" />,
      title: '好友',
      desc: '与好友保持联系',
      path: '/social'
    }
  ];

  const tabs = [
    {
      key: 'home',
      title: '首页',
      icon: <AppOutline />,
    },
    {
      key: 'social',
      title: '社交',
      icon: <TeamOutline />,
    },
    {
      key: 'message',
      title: '消息',
      icon: <MessageOutline />,
    },
    {
      key: 'profile',
      title: '我的',
      icon: <UserOutline />,
    },
  ];

  const handleFeatureClick = (feature: any) => {
    if (feature.title === '好友') {
      navigate('/social', { state: { activeTab: 'friends' } });
    } else if (feature.title === '群组') {
      navigate('/social', { state: { activeTab: 'groups' } });
    } else {
      navigate(feature.path);
    }
  };

  const handleTabChange = (key: string) => {
    navigate(`/${key}`);
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="welcome-section">
          <div className="text-logo">AI牵伴</div>
          <h1>欢迎使用AI牵伴</h1>
          <p className="welcome-desc">您的智能社交助手</p>
        </div>
        
        <Grid columns={2} gap={12}>
          {features.map((feature, index) => (
            <Grid.Item key={index}>
              <Card 
                className="feature-card"
                onClick={() => handleFeatureClick(feature)}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </Card>
            </Grid.Item>
          ))}
        </Grid>
      </div>
      
      <TabBar
        activeKey={location.pathname.replace('/', '')}
        onChange={handleTabChange}
        className="home-tabbar"
      >
        {tabs.map(item => (
          <TabBar.Item
            key={item.key}
            icon={item.icon}
            title={item.title}
          />
        ))}
      </TabBar>
    </div>
  );
};

export default Home;