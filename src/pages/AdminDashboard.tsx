import React, { useEffect, useState } from 'react';
import { NavBar, Card, List, Button, Tabs, Empty, Collapse, Form, Input, Toast, Dialog, Switch, Tag, Space, Grid } from 'antd-mobile';
import { LineChart } from 'echarts/charts';
import { 
  TitleComponent, 
  ToolboxComponent, 
  TooltipComponent, 
  GridComponent,
  LegendComponent 
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import * as echarts from 'echarts/core';
import axios from 'axios';

// 配置axios实例
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API调用错误详情:', {
      message: error.message,
      endpoint: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      response: error.response?.data
    });
    return Promise.reject(error);
  }
);

// 注册必需的组件
echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer
]);

interface DashboardData {
  userCount: number;
  newUsersCount: number;
  systemInfo: {
    version: string;
    uptime: number;
    memoryUsage: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
    };
    cpuUsage: {
      user: number;
      system: number;
    };
  };
}

interface LogEntry {
  id: string;
  level: string;
  message: string;
  details: string;
  created_at: string;
}

interface SystemSettings {
  [key: string]: string;
}

interface ServerEntry {
  id: number;
  name: string;
  protocol: string;
  port: number;
  status: boolean;
  traffic: {
    upload: number;
    download: number;
  };
  note: string;
  limitRate?: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  last_login: string | null;
  traffic_limit: number;
  traffic_used: number;
  servers_access: number[];
  subscription_url: string;
  password?: string;
  phone: string;
  profile: {
    display_name: string;
    avatar: string;
  };
}

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({});
  const [servers, setServers] = useState<ServerEntry[]>([]);
  const [trafficData, setTrafficData] = useState<{time: string[], upload: number[], download: number[]}>({
    time: [],
    upload: [],
    download: []
  });
  const [loading, setLoading] = useState({
    dashboard: true,
    logs: true,
    settings: true,
    servers: true,
    traffic: true
  });
  const [activeTab, setActiveTab] = useState('servers');
  const [editingServer, setEditingServer] = useState<ServerEntry | null>(null);
  const [isServerModalVisible, setIsServerModalVisible] = useState(false);
  const [filterKeyword, setFilterKeyword] = useState('');
  const [activeServer, setActiveServer] = useState<number | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  
  // 用户管理相关状态
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [userFilterKeyword, setUserFilterKeyword] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
      fetchTrafficData();
    } else if (activeTab === 'logs') {
      fetchLogs();
    } else if (activeTab === 'settings') {
      fetchSettings();
    } else if (activeTab === 'servers') {
      fetchServers();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  useEffect(() => {
    // 当组件挂载时初始化图表
    if (activeTab === 'dashboard' && !loading.dashboard && !loading.traffic) {
      initChart();
    }
  }, [loading.dashboard, loading.traffic, activeTab]);

  const initChart = () => {
    const chartDom = document.getElementById('traffic-chart');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    
    const option = {
      title: {
        text: '实时流量监控',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['上传', '下载'],
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: trafficData.time
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} MB'
        }
      },
      series: [
        {
          name: '上传',
          type: 'line',
          data: trafficData.upload,
          areaStyle: {},
          smooth: true,
          lineStyle: {
            width: 2,
            color: '#1677ff'
          },
          itemStyle: {
            color: '#1677ff'
          }
        },
        {
          name: '下载',
          type: 'line',
          data: trafficData.download,
          areaStyle: {},
          smooth: true,
          lineStyle: {
            width: 2,
            color: '#52c41a'
          },
          itemStyle: {
            color: '#52c41a'
          }
        }
      ]
    };
    
    myChart.setOption(option);
    
    // 自适应调整
    window.addEventListener('resize', () => myChart.resize());
    
    return () => {
      window.removeEventListener('resize', () => myChart.resize());
      myChart.dispose();
    };
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(prev => ({ ...prev, dashboard: true }));
      const { data } = await axios.get('/api/admin/dashboard');
      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
      Toast.show({
        icon: 'fail',
        content: '获取仪表盘数据失败'
      });
    } finally {
      setLoading(prev => ({ ...prev, dashboard: false }));
    }
  };

  const fetchTrafficData = async () => {
    try {
      setLoading(prev => ({ ...prev, traffic: true }));
      const { data } = await axios.get('/api/admin/traffic');
      if (data.success) {
        setTrafficData(data.data);
      }
    } catch (error) {
      console.error('获取流量数据失败:', error);
      Toast.show({
        icon: 'fail',
        content: '获取流量数据失败'
      });
    } finally {
      setLoading(prev => ({ ...prev, traffic: false }));
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(prev => ({ ...prev, logs: true }));
      const { data } = await axios.get('/api/admin/logs');
      if (data.success) {
        setLogs(data.data);
      }
    } catch (error) {
      console.error('获取日志失败:', error);
      Toast.show({
        icon: 'fail',
        content: '获取日志失败'
      });
    } finally {
      setLoading(prev => ({ ...prev, logs: false }));
    }
  };

  const fetchSettings = async () => {
    try {
      setLoading(prev => ({ ...prev, settings: true }));
      const { data } = await axios.get('/api/admin/settings');
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('获取设置失败:', error);
      Toast.show({
        icon: 'fail',
        content: '获取设置失败'
      });
    } finally {
      setLoading(prev => ({ ...prev, settings: false }));
    }
  };

  const fetchServers = async () => {
    try {
      setLoading(prev => ({ ...prev, servers: true }));
      const { data } = await axios.get('/api/admin/servers');
      if (data.success) {
        setServers(data.data);
      }
    } catch (error) {
      console.error('获取服务器列表失败:', error);
      Toast.show({
        icon: 'fail',
        content: '获取服务器列表失败'
      });
    } finally {
      setLoading(prev => ({ ...prev, servers: false }));
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data } = await axios.get('/api/admin/users');
      if (data.success) {
        setUsers(data.data);
      } else {
        Toast.show({
          icon: 'fail',
          content: '获取用户列表失败'
        });
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
      Toast.show({
        icon: 'fail',
        content: '获取用户列表失败'
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const updateSettings = async (values: SystemSettings) => {
    try {
      Toast.show({
        icon: 'loading',
        content: '更新中...',
        duration: 0
      });

      const { data } = await axios.post('/api/admin/settings', values);
      
      Toast.clear();
      
      if (data.success) {
        Toast.show({
          icon: 'success',
          content: '设置已更新'
        });
        setSettings({...settings, ...values});
      } else {
        throw new Error('更新失败');
      }
    } catch (error) {
      console.error('更新设置失败:', error);
      Toast.show({
        icon: 'fail',
        content: '更新设置失败'
      });
    }
  };

  const toggleServerStatus = async (id: number, status: boolean) => {
    try {
      const { data } = await axios.post(`/api/admin/servers/${id}/toggle`, { status });
      if (data.success) {
        setServers(servers.map(server => 
          server.id === id ? { ...server, status } : server
        ));
        Toast.show({
          icon: 'success',
          content: status ? '服务已启用' : '服务已禁用'
        });
      }
    } catch (error) {
      console.error('切换服务状态失败:', error);
      Toast.show({
        icon: 'fail',
        content: '操作失败'
      });
    }
  };

  const deleteServer = async (id: number) => {
    Dialog.confirm({
      content: '确定要删除此服务器吗？',
      onConfirm: async () => {
        try {
          const { data } = await axios.delete(`/api/admin/servers/${id}`);
          if (data.success) {
            setServers(servers.filter(server => server.id !== id));
            Toast.show({
              icon: 'success',
              content: '服务器已删除'
            });
          }
        } catch (error) {
          console.error('删除服务器失败:', error);
          Toast.show({
            icon: 'fail',
            content: '删除失败'
          });
        }
      }
    });
  };

  const editServer = (server: ServerEntry) => {
    setEditingServer(server);
    setIsServerModalVisible(true);
  };

  const addNewServer = () => {
    setEditingServer({
      id: 0,
      name: '',
      protocol: 'vmess',
      port: 28714,
      status: true,
      traffic: { upload: 0, download: 0 },
      note: ''
    });
    setIsServerModalVisible(true);
  };

  const saveServer = async (serverData: ServerEntry) => {
    try {
      Toast.show({
        icon: 'loading',
        content: '保存中...',
        duration: 0
      });

      let response;
      if (serverData.id === 0) {
        // 添加新服务器
        response = await axios.post('/api/admin/servers', serverData);
      } else {
        // 更新现有服务器
        response = await axios.put(`/api/admin/servers/${serverData.id}`, serverData);
      }

      Toast.clear();
      
      if (response.data.success) {
        Toast.show({
          icon: 'success',
          content: serverData.id === 0 ? '服务器已添加' : '服务器已更新'
        });
        setIsServerModalVisible(false);
        fetchServers();
      } else {
        throw new Error('保存失败');
      }
    } catch (error) {
      console.error('保存服务器失败:', error);
      Toast.show({
        icon: 'fail',
        content: '保存失败'
      });
    }
  };

  const resetTraffic = async (id: number) => {
    try {
      const { data } = await axios.post(`/api/admin/servers/${id}/reset-traffic`);
      if (data.success) {
        setServers(servers.map(server => 
          server.id === id ? { ...server, traffic: { upload: 0, download: 0 } } : server
        ));
        Toast.show({
          icon: 'success',
          content: '流量已重置'
        });
      }
    } catch (error) {
      console.error('重置流量失败:', error);
      Toast.show({
        icon: 'fail',
        content: '操作失败'
      });
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    return `${days}天 ${hours}小时 ${minutes}分钟 ${remainingSeconds}秒`;
  };

  const getServerConfig = (server: ServerEntry) => {
    // 生成服务器配置代码 (模拟)
    return `{
  "server": "${server.name}",
  "port": ${server.port},
  "protocol": "${server.protocol}",
  "settings": {
    "clients": [
      {
        "id": "a3482e88-686a-4a58-8126-99c9df64b7${server.id.toString().padStart(2, '0')}",
        "alterId": 0
      }
    ]
  },
  "streamSettings": {
    "network": "tcp"
  }
}`;
  };

  const copyServerConfig = (server: ServerEntry) => {
    const config = getServerConfig(server);
    navigator.clipboard.writeText(config)
      .then(() => {
        Toast.show({
          icon: 'success',
          content: '配置已复制到剪贴板'
        });
      })
      .catch(err => {
        console.error('复制失败:', err);
        Toast.show({
          icon: 'fail',
          content: '复制失败'
        });
      });
  };

  const showServerQRCode = (serverId: number) => {
    setActiveServer(serverId);
    setShowQRCode(true);
  };

  // 添加新用户
  const addNewUser = () => {
    setEditingUser({
      username: '',
      email: '',
      password: '',
      phone: '',
      role: 'user',
      status: 'active',
      traffic_limit: 5368709120, // 5GB
      servers_access: [],
      profile: {
        display_name: '',
        avatar: ''
      }
    });
    setIsUserModalVisible(true);
  };

  // 编辑用户
  const editUser = (user: User) => {
    // 编辑用户时包含所有字段，包括密码
    const { id, username, email, phone, password, role, status, traffic_limit, servers_access, profile } = user;
    setEditingUser({
      id,
      username,
      email,
      phone,
      password,  // 确保包含password字段
      role,
      status,
      traffic_limit,
      servers_access,
      profile
    });
    setIsUserModalVisible(true);
  };

  // 保存用户
  const saveUser = async (userData: any) => {
    try {
      Toast.show({
        icon: 'loading',
        content: '保存中...',
        duration: 0
      });
      
      console.log('准备保存的用户数据:', userData);
      const formData = { ...userData };
      
      // 处理servers_access字段，确保是正确的格式
      if (formData.servers_access && typeof formData.servers_access === 'string') {
        formData.servers_access = formData.servers_access
          .split(',')
          .map((id: string) => parseInt(id.trim()))
          .filter((id: number) => !isNaN(id));
      } else if (!formData.servers_access) {
        formData.servers_access = [];
      }
      
      console.log('处理后的formData:', formData);
      
      let response;
      const endpoint = !formData.id 
        ? '/api/admin/users' 
        : `/api/admin/users/${formData.id}`;
      const method = !formData.id ? 'POST' : 'PUT';
      
      console.log(`准备发送 ${method} 请求到 ${endpoint}`);
      
      if (!formData.id) {
        // 添加新用户
        response = await axios.post('/api/admin/users', formData);
      } else {
        // 更新现有用户
        response = await axios.put(`/api/admin/users/${formData.id}`, formData);
      }

      console.log('服务器响应:', response.data);
      Toast.clear();
      
      if (response.data.success) {
        Toast.show({
          icon: 'success',
          content: userData.id ? '用户已更新' : '用户已添加'
        });
        setIsUserModalVisible(false);
        fetchUsers();
      } else {
        throw new Error(response.data.message || '保存失败');
      }
    } catch (error: any) {
      console.error('保存用户失败:', error);
      let errorMessage = '保存失败';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Toast.show({
        icon: 'fail',
        content: errorMessage
      });
    }
  };

  // 删除用户
  const deleteUser = async (id: number) => {
    Dialog.confirm({
      content: '确定要删除此用户吗？',
      onConfirm: async () => {
        try {
          const { data } = await axios.delete(`/api/admin/users/${id}`);
          if (data.success) {
            setUsers(users.filter(user => user.id !== id));
            Toast.show({
              icon: 'success',
              content: '用户已删除'
            });
          }
        } catch (error) {
          console.error('删除用户失败:', error);
          Toast.show({
            icon: 'fail',
            content: '删除失败'
          });
        }
      }
    });
  };

  // 切换用户状态
  const toggleUserStatus = async (id: number, status: string) => {
    try {
      const { data } = await axios.post(`/api/admin/users/${id}/toggle-status`, { status });
      if (data.success) {
        setUsers(users.map(user => 
          user.id === id ? { ...user, status } : user
        ));
        
        const statusText = status === 'active' ? '激活' : status === 'suspended' ? '暂停' : '封禁';
        Toast.show({
          icon: 'success',
          content: `用户已${statusText}`
        });
      }
    } catch (error) {
      console.error('更新用户状态失败:', error);
      Toast.show({
        icon: 'fail',
        content: '操作失败'
      });
    }
  };

  // 重置用户流量
  const resetUserTraffic = async (id: number) => {
    try {
      const { data } = await axios.post(`/api/admin/users/${id}/reset-traffic`);
      if (data.success) {
        setUsers(users.map(user => 
          user.id === id ? { ...user, traffic_used: 0 } : user
        ));
        Toast.show({
          icon: 'success',
          content: '用户流量已重置'
        });
      }
    } catch (error) {
      console.error('重置用户流量失败:', error);
      Toast.show({
        icon: 'fail',
        content: '操作失败'
      });
    }
  };

  // 复制用户订阅链接
  const copyUserSubscription = (user: User) => {
    const subscriptionUrl = `http://localhost:5000/api/user/subscription/${user.subscription_url}`;
    navigator.clipboard.writeText(subscriptionUrl)
      .then(() => {
        Toast.show({
          icon: 'success',
          content: '订阅链接已复制到剪贴板'
        });
      })
      .catch(err => {
        console.error('复制失败:', err);
        Toast.show({
          icon: 'fail',
          content: '复制失败'
        });
      });
  };

  // 渲染服务器表单
  const renderServerForm = () => {
    if (!editingServer) return null;

    return (
      <Dialog
        visible={isServerModalVisible}
        title={editingServer.id === 0 ? '添加服务器' : '编辑服务器'}
        content={
          <Form 
            layout="horizontal"
            initialValues={editingServer}
            onFinish={saveServer}
            footer={
              <Button block type="submit" color="primary">
                保存
              </Button>
            }
          >
            <Form.Item name="name" label="名称" rules={[{ required: true }]}>
              <Input placeholder="请输入服务器名称" />
            </Form.Item>
            <Form.Item name="protocol" label="协议" rules={[{ required: true }]}>
              <Input placeholder="请输入协议类型" />
            </Form.Item>
            <Form.Item name="port" label="端口" rules={[{ required: true }]}>
              <Input type="number" placeholder="请输入端口号" />
            </Form.Item>
            <Form.Item name="note" label="备注">
              <Input placeholder="请输入备注信息" />
            </Form.Item>
            <Form.Item name="limitRate" label="流量限制 (MB)">
              <Input type="number" placeholder="0表示无限制" />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Switch />
            </Form.Item>
          </Form>
        }
        closeOnAction
        onClose={() => setIsServerModalVisible(false)}
        actions={[
          {
            key: 'cancel',
            text: '取消',
            onClick: () => setIsServerModalVisible(false)
          }
        ]}
      />
    );
  };

  // 渲染用户表单
  const renderUserForm = () => {
    if (!editingUser) return null;

    return (
      <Dialog
        visible={isUserModalVisible}
        title={editingUser.id ? '编辑用户' : '添加用户'}
        content={
          <Form 
            layout="horizontal"
            initialValues={editingUser}
            onFinish={saveUser}
            footer={
              <Button block type="submit" color="primary">
                保存
              </Button>
            }
          >
            <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
              <Input placeholder="请输入用户名" />
            </Form.Item>
            
            <Form.Item name="password" label="密码" rules={[{ required: !editingUser.id }]}>
              <Input placeholder={editingUser.id ? "留空则保持不变" : "请输入密码"} type="password" />
            </Form.Item>
            
            <Form.Item name="email" label="邮箱" rules={[{ required: true }]}>
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            
            <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
              <Input placeholder="请输入手机号" />
            </Form.Item>
            
            <Form.Item name="role" label="角色">
              <Input placeholder="admin 或 user" />
            </Form.Item>
            
            <Form.Item name="status" label="状态">
              <Input placeholder="active, suspended 或 banned" />
            </Form.Item>
            
            <Form.Item name="traffic_limit" label="流量限制(字节)">
              <Input type="number" placeholder="流量限制，单位字节" />
            </Form.Item>
            
            <Form.Item name="servers_access" label="可访问服务器ID">
              <Input placeholder="输入ID,用逗号分隔，如: 1,2,3" />
            </Form.Item>
            
            <Form.Header>个人资料</Form.Header>
            
            <Form.Item name={['profile', 'display_name']} label="显示名称">
              <Input placeholder="请输入显示名称" />
            </Form.Item>
          </Form>
        }
        closeOnAction
        onClose={() => setIsUserModalVisible(false)}
        actions={[
          {
            key: 'cancel',
            text: '取消',
            onClick: () => setIsUserModalVisible(false)
          }
        ]}
      />
    );
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar 
        style={{ 
          background: '#1677ff', 
          color: 'white',
          '--height': '50px'
        }} 
        back={null}
      >
        Xray 管理面板
      </NavBar>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        style={{ 
          '--title-font-size': '15px', 
          '--content-padding': '8px' 
        }}
      >
        <Tabs.Tab title="服务器" key="servers">
          {loading.servers ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>加载中...</div>
          ) : (
            <>
              <div style={{ padding: '12px', background: '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Input
                  placeholder="搜索服务器"
                  value={filterKeyword}
                  onChange={val => setFilterKeyword(val)}
                  style={{ flex: 1, marginRight: '8px' }}
                />
                <Button 
                  size="small" 
                  color="primary" 
                  onClick={addNewServer}
                  style={{ flexShrink: 0 }}
                >
                  添加节点
                </Button>
              </div>
              
              {servers.length === 0 ? (
                <Empty
                  style={{ padding: '64px 0' }}
                  imageStyle={{ width: 128 }}
                  description="暂无节点"
                />
              ) : (
                <div style={{ padding: '8px' }}>
                  {servers
                    .filter(server => server.name.toLowerCase().includes(filterKeyword.toLowerCase()))
                    .map(server => (
                      <Card
                        key={server.id}
                        style={{ marginBottom: '10px' }}
                        title={
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '8px' }}>{server.name}</span>
                            <Tag color={server.status ? '#1677ff' : '#999'}>
                              {server.status ? '运行中' : '已停止'}
                            </Tag>
                          </div>
                        }
                        extra={
                          <Switch
                            checked={server.status}
                            onChange={checked => toggleServerStatus(server.id, checked)}
                          />
                        }
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div>
                            <div><span style={{ color: '#666' }}>协议:</span> {server.protocol}</div>
                            <div><span style={{ color: '#666' }}>端口:</span> {server.port}</div>
                            <div>
                              <span style={{ color: '#666' }}>流量:</span> 
                              <span style={{ color: '#1677ff' }}> ↑{formatBytes(server.traffic.upload)}</span> / 
                              <span style={{ color: '#52c41a' }}> ↓{formatBytes(server.traffic.download)}</span>
                            </div>
                          </div>
                          {server.note && (
                            <div style={{ color: '#999', fontSize: '14px' }}>
                              {server.note}
                            </div>
                          )}
                        </div>
                        
                        <Space wrap>
                          <Button 
                            size="mini" 
                            onClick={() => editServer(server)}
                          >
                            编辑
                          </Button>
                          <Button 
                            size="mini" 
                            onClick={() => resetTraffic(server.id)}
                          >
                            重置流量
                          </Button>
                          <Button 
                            size="mini" 
                            onClick={() => copyServerConfig(server)}
                          >
                            复制配置
                          </Button>
                          <Button 
                            size="mini"
                            onClick={() => showServerQRCode(server.id)}
                          >
                            显示二维码
                          </Button>
                          <Button 
                            size="mini" 
                            color="danger"
                            onClick={() => deleteServer(server.id)}
                          >
                            删除
                          </Button>
                        </Space>
                      </Card>
                    ))}
                </div>
              )}
              
              <Button
                block
                style={{ margin: '12px' }}
                onClick={() => setShowSubscription(true)}
              >
                生成订阅链接
              </Button>
            </>
          )}
        </Tabs.Tab>
        
        <Tabs.Tab title="用户" key="users">
          {loadingUsers ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>加载中...</div>
          ) : (
            <>
              <div style={{ padding: '12px', background: '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Input
                  placeholder="搜索用户"
                  value={userFilterKeyword}
                  onChange={val => setUserFilterKeyword(val)}
                  style={{ flex: 1, marginRight: '8px' }}
                />
                <Button 
                  size="small" 
                  color="primary" 
                  onClick={addNewUser}
                  style={{ flexShrink: 0 }}
                >
                  添加用户
                </Button>
              </div>
              
              {users.length === 0 ? (
                <Empty
                  style={{ padding: '64px 0' }}
                  imageStyle={{ width: 128 }}
                  description="暂无用户"
                />
              ) : (
                <div style={{ padding: '8px' }}>
                  {users
                    .filter(user => 
                      user.username.toLowerCase().includes(userFilterKeyword.toLowerCase()) ||
                      user.email.toLowerCase().includes(userFilterKeyword.toLowerCase()) ||
                      (user.profile.display_name && user.profile.display_name.toLowerCase().includes(userFilterKeyword.toLowerCase()))
                    )
                    .map(user => (
                      <Card
                        key={user.id}
                        style={{ marginBottom: '10px' }}
                        title={
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '8px' }}>{user.username}</span>
                            <Tag color={
                              user.status === 'active' ? '#1677ff' : 
                              user.status === 'suspended' ? '#faad14' : 
                              '#ff4d4f'
                            }>
                              {user.status === 'active' ? '活跃' : 
                               user.status === 'suspended' ? '暂停' : '封禁'}
                            </Tag>
                            {user.role === 'admin' && (
                              <Tag color="#722ed1">管理员</Tag>
                            )}
                          </div>
                        }
                        extra={
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Button
                              size="mini"
                              color={user.status === 'active' ? 'warning' : 'primary'}
                              onClick={() => toggleUserStatus(user.id, user.status === 'active' ? 'suspended' : 'active')}
                            >
                              {user.status === 'active' ? '暂停' : '激活'}
                            </Button>
                            {user.status === 'active' && (
                              <Button
                                size="mini"
                                color="danger"
                                onClick={() => toggleUserStatus(user.id, 'banned')}
                              >
                                封禁
                              </Button>
                            )}
                          </div>
                        }
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div>
                            <div><span style={{ color: '#666' }}>邮箱:</span> {user.email}</div>
                            <div>
                              <span style={{ color: '#666' }}>流量:</span> 
                              <span style={{ color: '#1677ff' }}> 已用 {formatBytes(user.traffic_used)}</span> / 
                              <span style={{ color: '#52c41a' }}> 总量 {formatBytes(user.traffic_limit)}</span>
                            </div>
                            <div>
                              <span style={{ color: '#666' }}>可用服务器:</span> 
                              {user.servers_access.length > 0 
                                ? user.servers_access.map(id => (
                                  <Tag key={id} style={{ marginLeft: '4px' }}>
                                    {servers.find(s => s.id === id)?.name || id}
                                  </Tag>
                                ))
                                : <span style={{ color: '#999' }}>无</span>
                              }
                            </div>
                            <div>
                              <span style={{ color: '#666' }}>创建时间:</span> {new Date(user.created_at).toLocaleString()}
                            </div>
                            {user.last_login && (
                              <div>
                                <span style={{ color: '#666' }}>最后登录:</span> {new Date(user.last_login).toLocaleString()}
                              </div>
                            )}
                          </div>
                          
                          {user.profile.display_name && (
                            <div style={{ color: '#999', fontSize: '14px' }}>
                              <div>{user.profile.display_name}</div>
                            </div>
                          )}
                        </div>
                        
                        <Space wrap>
                          <Button 
                            size="mini" 
                            onClick={() => editUser(user)}
                          >
                            编辑
                          </Button>
                          <Button 
                            size="mini" 
                            onClick={() => resetUserTraffic(user.id)}
                          >
                            重置流量
                          </Button>
                          <Button 
                            size="mini" 
                            onClick={() => copyUserSubscription(user)}
                          >
                            复制订阅链接
                          </Button>
                          <Button 
                            size="mini" 
                            color="danger"
                            onClick={() => deleteUser(user.id)}
                          >
                            删除
                          </Button>
                        </Space>
                      </Card>
                    ))}
                </div>
              )}
            </>
          )}
        </Tabs.Tab>
        
        <Tabs.Tab title="仪表盘" key="dashboard">
          {loading.dashboard || loading.traffic ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>加载中...</div>
          ) : (
            <>
              <div style={{ padding: '12px' }}>
                <Grid columns={2} gap={12}>
                  <Grid.Item>
                    <Card>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', color: '#666' }}>总用户数</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>
                          {dashboardData?.userCount || 0}
                        </div>
                      </div>
                    </Card>
                  </Grid.Item>
                  <Grid.Item>
                    <Card>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', color: '#666' }}>新增用户</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>
                          {dashboardData?.newUsersCount || 0}
                        </div>
                      </div>
                    </Card>
                  </Grid.Item>
                </Grid>
              </div>
              
              <Card style={{ margin: '12px' }}>
                <div id="traffic-chart" style={{ height: '300px', width: '100%' }}></div>
              </Card>
              
              <Card title="系统信息" style={{ margin: '12px' }}>
                <List>
                  <List.Item>版本: {dashboardData?.systemInfo.version}</List.Item>
                  <List.Item>运行时间: {formatUptime(dashboardData?.systemInfo.uptime || 0)}</List.Item>
                  <List.Item>内存使用: {formatBytes(dashboardData?.systemInfo.memoryUsage.heapUsed || 0)}</List.Item>
                </List>
              </Card>
            </>
          )}
        </Tabs.Tab>
        
        <Tabs.Tab title="日志" key="logs">
          {loading.logs ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>加载中...</div>
          ) : (
            <List>
              {logs.length === 0 ? (
                <Empty
                  style={{ padding: '64px 0' }}
                  imageStyle={{ width: 128 }}
                  description="暂无日志"
                />
              ) : (
                logs.map(log => (
                  <List.Item
                    key={log.id}
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Tag color={
                          log.level === 'info' ? '#1677ff' :
                          log.level === 'warn' ? '#faad14' : 
                          log.level === 'error' ? '#ff4d4f' : 
                          '#1677ff'
                        }>
                          {log.level.toUpperCase()}
                        </Tag>
                        <span>{log.message}</span>
                      </div>
                    }
                    description={
                      <div style={{ color: '#999', fontSize: '13px' }}>
                        <div style={{ marginTop: '5px' }}>{log.details}</div>
                        <div style={{ marginTop: '5px' }}>{new Date(log.created_at).toLocaleString()}</div>
                      </div>
                    }
                  />
                ))
              )}
            </List>
          )}
        </Tabs.Tab>
        
        <Tabs.Tab title="设置" key="settings">
          {loading.settings ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>加载中...</div>
          ) : (
            <Form
              initialValues={settings}
              onFinish={updateSettings}
              footer={
                <Button block type="submit" color="primary">
                  保存设置
                </Button>
              }
              style={{ padding: '12px' }}
            >
              <Collapse defaultActiveKey={['基本设置']}>
                <Collapse.Panel key="基本设置" title="基本设置">
                  <Form.Item name="app.name" label="系统名称">
                    <Input placeholder="请输入系统名称" />
                  </Form.Item>
                  <Form.Item name="app.description" label="系统描述">
                    <Input placeholder="请输入系统描述" />
                  </Form.Item>
                  <Form.Item name="app.version" label="系统版本">
                    <Input placeholder="请输入系统版本" />
                  </Form.Item>
                </Collapse.Panel>
                
                <Collapse.Panel key="邮件设置" title="邮件设置">
                  <Form.Item name="mail.enabled" label="启用邮件">
                    <Input placeholder="true/false" />
                  </Form.Item>
                  <Form.Item name="mail.service" label="SMTP服务器">
                    <Input placeholder="请输入SMTP服务器" />
                  </Form.Item>
                </Collapse.Panel>
                
                <Collapse.Panel key="其他设置" title="其他设置">
                  <Form.Item name="notification.enabled" label="启用通知">
                    <Input placeholder="true/false" />
                  </Form.Item>
                  <Form.Item name="storage.provider" label="存储提供商">
                    <Input placeholder="请输入存储提供商" />
                  </Form.Item>
                </Collapse.Panel>
              </Collapse>
            </Form>
          )}
        </Tabs.Tab>
      </Tabs>
      
      {renderServerForm()}
      {renderUserForm()}
      
      <Dialog
        visible={showQRCode}
        title="节点二维码"
        content={
          activeServer ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ 
                background: '#f5f5f5',
                padding: '80px',
                margin: '10px',
                fontSize: '12px',
                textAlign: 'center',
                color: '#666'
              }}>
                这里会显示实际的二维码图片 <br />
                (需要实际整合第三方二维码库)
              </div>
              <div style={{ 
                marginTop: '15px', 
                wordBreak: 'break-all', 
                fontSize: '12px', 
                color: '#666',
                padding: '0 10px'
              }}>
                {servers.find(s => s.id === activeServer)?.name} - 
                {servers.find(s => s.id === activeServer)?.protocol}://
                {btoa(JSON.stringify({id: activeServer, protocol: servers.find(s => s.id === activeServer)?.protocol}))}
              </div>
            </div>
          ) : (
            <div>未找到节点信息</div>
          )
        }
        closeOnAction
        onClose={() => setShowQRCode(false)}
        actions={[
          {
            key: 'close',
            text: '关闭',
          }
        ]}
      />
      
      <Dialog
        visible={showSubscription}
        title="订阅链接"
        content={
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ 
              background: '#f0f9ff', 
              padding: '15px', 
              borderRadius: '4px',
              wordBreak: 'break-all',
              fontSize: '14px'
            }}>
              http://localhost:5000/api/subscription?token=a4b72e9c0f31d5a7b8e9
            </div>
            <Button 
              style={{ marginTop: '15px' }}
              onClick={() => {
                navigator.clipboard.writeText('http://localhost:5000/api/subscription?token=a4b72e9c0f31d5a7b8e9');
                Toast.show({
                  icon: 'success',
                  content: '订阅链接已复制'
                });
              }}
            >
              复制链接
            </Button>
          </div>
        }
        closeOnAction
        onClose={() => setShowSubscription(false)}
        actions={[
          {
            key: 'close',
            text: '关闭',
          }
        ]}
      />
    </div>
  );
};

export default AdminDashboard; 