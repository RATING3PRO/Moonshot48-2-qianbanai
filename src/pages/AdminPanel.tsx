import React, { useEffect, useState } from 'react';
import { NavBar, Card, List, Button, Tabs, DotLoading } from 'antd-mobile';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in: string;
}

interface SystemStatus {
  serverTime: string;
  status: string;
  version: string;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 并行请求多个API
        const [usersResponse, statusResponse] = await Promise.all([
          axios.get('/api/users'),
          axios.get('/api/status')
        ]);

        if (usersResponse.data.success) {
          setUsers(usersResponse.data.data);
        }

        if (statusResponse.data.success) {
          setSystemStatus(statusResponse.data.data);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="admin-panel">
      <NavBar back={null}>管理控制台</NavBar>

      <Tabs>
        <Tabs.Tab title="系统状态" key="status">
          {loading ? (
            <div style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 20 }}>加载中 <DotLoading /></div>
            </div>
          ) : (
            <Card title="服务器状态">
              {systemStatus && (
                <List>
                  <List.Item extra={systemStatus.status}>状态</List.Item>
                  <List.Item extra={systemStatus.version}>版本</List.Item>
                  <List.Item extra={new Date(systemStatus.serverTime).toLocaleString()}>服务器时间</List.Item>
                </List>
              )}
            </Card>
          )}
        </Tabs.Tab>

        <Tabs.Tab title="用户管理" key="users">
          {loading ? (
            <div style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 20 }}>加载中 <DotLoading /></div>
            </div>
          ) : (
            <Card title="用户列表">
              <List>
                {users.length > 0 ? (
                  users.map(user => (
                    <List.Item
                      key={user.id}
                      description={`注册时间: ${new Date(user.created_at).toLocaleString()}`}
                      extra={
                        <Button size="small" color="primary">
                          查看
                        </Button>
                      }
                    >
                      {user.email}
                    </List.Item>
                  ))
                ) : (
                  <List.Item>暂无用户数据</List.Item>
                )}
              </List>
            </Card>
          )}
        </Tabs.Tab>
      </Tabs>
    </div>
  );
};

export default AdminPanel; 