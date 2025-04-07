import React, { useState } from 'react';
import { Form, Input, Button, Toast, List } from 'antd-mobile';
import { useNavigate, Link } from 'react-router-dom';
import { UserOutline, LockOutline } from 'antd-mobile-icons';
import axios from 'axios';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', values);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        Toast.show({
          icon: 'success',
          content: '登录成功',
        });
        
        navigate('/home');
      }
    } catch (error) {
      console.error('登录失败:', error);
      Toast.show({
        icon: 'fail',
        content: '登录失败，请检查账号密码',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="app-logo">
          <img src="/logo.png" alt="AI牵伴" />
        </div>
        <h1>AI牵伴</h1>
        <p>智能健康助手，守护您的每一天</p>
      </div>
      
      <Form
        form={form}
        onFinish={onFinish}
        className="login-form"
        footer={
          <Button 
            block 
            type="submit" 
            color="primary" 
            loading={loading}
            className="login-button"
          >
            登录
          </Button>
        }
      >
        <List className="form-list">
          <List.Item prefix={<UserOutline />}>
            <Form.Item
              name="phone"
              rules={[{ required: true, message: '请输入手机号' }]}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>
          </List.Item>
          
          <List.Item prefix={<LockOutline />}>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input type="password" placeholder="请输入密码" />
            </Form.Item>
          </List.Item>
        </List>
      </Form>

      <div className="login-footer">
        <p>还没有账号？</p>
        <Link to="/register" className="register-link">立即注册</Link>
      </div>
    </div>
  );
};

export default Login;