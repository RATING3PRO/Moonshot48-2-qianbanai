import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Toast, Checkbox, Dialog, Space } from 'antd-mobile';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';

// 图标组件
const PhoneIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>;
const LockIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>;
const UserIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;
const LogoIcon = () => <svg width="96" height="96" viewBox="0 0 24 24" fill="#4F7DFE"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg>;
const ErrorIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="#F5222D"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>;
const GuestIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="#52c41a"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>;

// 样式
const styles = {
  authContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f5f7fa'
  },
  authCard: {
    width: '100%',
    maxWidth: '450px',
    padding: '36px',
    borderRadius: '16px',
    backgroundColor: 'white',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)'
  },
  authLogo: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    marginBottom: '36px'
  },
  authTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginTop: '16px',
    color: '#333'
  },
  authForm: {
    width: '100%'
  },
  formGroup: {
    marginBottom: '28px'
  },
  authInput: {
    fontSize: '20px',
    height: '56px'
  },
  inputPrefix: {
    marginRight: '12px',
    color: '#999'
  },
  loginOptions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px'
  },
  rememberText: {
    fontSize: '18px'
  },
  authBtn: {
    height: '56px',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  guestBtn: {
    height: '56px',
    fontSize: '20px',
    marginTop: '20px',
    fontWeight: 'bold',
    backgroundColor: '#f6ffed',
    borderColor: '#52c41a',
    color: '#52c41a'
  },
  authFooter: {
    marginTop: '28px',
    textAlign: 'center' as const,
    fontSize: '18px',
    color: '#666'
  },
  loginLink: {
    color: '#4F7DFE',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  errorCard: {
    marginBottom: '24px',
    padding: '16px',
    borderRadius: '8px',
    backgroundColor: '#FFF2F0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  errorText: {
    color: '#F5222D',
    fontSize: '18px',
    flex: 1
  },
  errorHint: {
    marginTop: '8px',
    color: '#666',
    fontSize: '16px'
  },
  serverActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  refreshButton: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: '#f5f5f5',
    border: 'none',
    cursor: 'pointer',
    marginLeft: 'auto'
  },
  checkingText: {
    color: '#faad14',
    fontSize: '14px',
    marginLeft: '8px',
    animation: 'pulse 1.5s infinite'
  },
  guestLoginCard: {
    marginBottom: '24px',
    padding: '16px',
    borderRadius: '8px',
    backgroundColor: '#f6ffed',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: '1px solid #b7eb8f'
  },
  guestText: {
    color: '#52c41a',
    fontSize: '18px',
    flex: 1
  },
  guestHint: {
    marginTop: '8px',
    color: '#666',
    fontSize: '16px'
  }
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = location;
  
  // 状态管理
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [agreement, setAgreement] = useState<boolean>(false);
  
  // 直接从URL参数获取是否应该使用游客模式
  const params = new URLSearchParams(search);
  const autoGuestMode = params.get('guest') === 'true';
  
  // 游客模式自动注册
  useEffect(() => {
    if (autoGuestMode) {
      console.log('从URL参数检测到游客模式请求，自动以游客身份登录');
      handleGuestLogin();
    }
  }, []);

  // 处理注册表单提交
  const handleRegister = async () => {
    // 如果是游客模式，直接调用游客登录逻辑
    if (localStorage.getItem('isGuest') === 'true') {
      handleGuestLogin();
      return;
    }
    
    try {
      // 表单验证
      if (!name) {
        Toast.show({
          content: '请输入姓名',
          position: 'bottom',
        });
        return;
      }
      if (!phone) {
        Toast.show({
          content: '请输入手机号',
          position: 'bottom',
        });
        return;
      }
      if (!password) {
        Toast.show({
          content: '请输入密码',
          position: 'bottom',
        });
        return;
      }
      if (!agreement) {
        Toast.show({
          content: '请同意用户协议和隐私政策',
          position: 'bottom',
        });
        return;
      }
      
      setLoading(true);
      
      // 发送注册请求
      const response = await axios.post('/api/auth/register', { name, phone, password });
      console.log('注册响应:', response.data);
      
      if (response.data.success) {
        Toast.show({
          icon: 'success',
          content: '注册成功',
          afterClose: () => {
            navigate('/home');
          },
        });
      } else {
        Toast.show({
          icon: 'fail',
          content: response.data.message || '注册失败',
        });
      }
    } catch (error: any) {
      console.error('注册错误:', error);
      
      // 处理网络错误
      if (error.message && error.message.includes('Network Error')) {
        Toast.show({
          icon: 'fail',
          content: '连接服务器失败，将以游客模式登录',
          afterClose: () => {
            // 网络错误时自动切换到游客模式
            handleGuestLogin();
          }
        });
      } else if (error.response) {
        // 处理服务器返回的错误
        const errorMsg = error.response.data?.message || '注册失败，请稍后再试';
        Toast.show({
          icon: 'fail',
          content: errorMsg,
        });
      } else {
        // 处理其他错误
        Toast.show({
          icon: 'fail',
          content: '注册失败，请稍后再试',
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  // 查看用户协议和隐私政策
  const showAgreements = (type: 'terms' | 'privacy') => {
    Dialog.alert({
      title: type === 'terms' ? '用户协议' : '隐私政策',
      content: type === 'terms' 
        ? '本应用为老年人提供聊天、健康管理等服务。使用本应用即表示您同意我们的用户协议。'
        : '我们非常重视您的隐私保护，收集的信息仅用于提供服务和改进用户体验。',
      confirmText: '我已阅读',
    });
  };

  // 处理游客登录
  const handleGuestLogin = () => {
    console.log('正在以游客身份登录');
    
    // 设置游客模式标志
    localStorage.setItem('isGuest', 'true');
    
    // 创建游客用户对象
    const guestUser = {
      id: 'guest',
      name: '游客用户',
      avatar: '',
      role: 'guest'
    };
    
    // 保存游客信息到本地存储
    localStorage.setItem('userData', JSON.stringify(guestUser));
    
    Toast.show({
      icon: 'success',
      content: '已进入游客模式',
    });
    
    // 显示提示后跳转到首页
    setTimeout(() => {
      navigate('/home');
    }, 500);
  };

  // 自定义样式
  const guestIconStyle = {
    marginRight: '10px',
    fontSize: '20px',
    color: '#666',
  };
  
  const guestLoginCard = {
    padding: '16px',
    marginTop: '20px',
    borderRadius: '8px',
    backgroundColor: '#f8f8f8',
    border: '1px dashed #ddd',
  };
  
  // 渲染注册页面
  return (
    <div className="register-container">
      <div className="register-header">
        <h1>注册账号</h1>
        <p className="register-subtitle">创建账号以使用完整功能</p>
      </div>
      
      <Form
        layout="vertical"
        footer={
          <Button 
            block 
            type="submit" 
            color="primary" 
            size="large" 
            loading={loading}
            onClick={handleRegister}
            style={{ fontSize: '18px', height: '50px' }}
          >
            注册
          </Button>
        }
      >
        <Form.Item
          label="姓名"
        >
          <Input
            placeholder="请输入姓名"
            value={name}
            onChange={setName}
            clearable
          />
        </Form.Item>
        <Form.Item
          label="手机号"
        >
          <Input
            placeholder="请输入手机号"
            value={phone}
            onChange={setPhone}
            clearable
          />
        </Form.Item>
        <Form.Item
          label="密码"
          extra={<div style={{ fontSize: '14px', color: '#999' }}>密码长度至少6位</div>}
        >
          <Input
            placeholder="请输入密码"
            type="password"
            value={password}
            onChange={setPassword}
            clearable
          />
        </Form.Item>
        
        <Form.Item>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              checked={agreement}
              onChange={setAgreement}
              style={{ fontSize: '16px' }}
            >
              我已阅读并同意
            </Checkbox>
            <Space>
              <a onClick={() => showAgreements('terms')} style={{ color: '#1677ff' }}>
                用户协议
              </a>
              和
              <a onClick={() => showAgreements('privacy')} style={{ color: '#1677ff' }}>
                隐私政策
              </a>
            </Space>
          </div>
        </Form.Item>
      </Form>
      
      {/* 游客登录选项 */}
      <div style={guestLoginCard}>
        <div 
          onClick={handleGuestLogin}
          style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            padding: '15px',
            cursor: 'pointer' 
          }}
        >
          <span style={guestIconStyle}>
            <i className="icon-guest" style={{ marginRight: '8px' }}>👤</i>
          </span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#666' }}>
            游客模式登录
          </span>
        </div>
        <div style={{ fontSize: '14px', color: '#999', textAlign: 'center', marginTop: '8px' }}>
          部分功能可能受限，无需账号密码
        </div>
      </div>
      
      <div className="register-footer">
        <p>
          已有账号? <Link to="/login" style={{ color: '#1677ff' }}>立即登录</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;