import React, { useState, useEffect } from 'react';
import { Popup, Form, Input, Button, Toast } from 'antd-mobile';
import { getLocalIP } from '../config/api';

interface IPSettingsPopupProps {
  visible: boolean;
  onClose: () => void;
  onSave: (ip: string) => void;
}

const IPSettingsPopup: React.FC<IPSettingsPopupProps> = ({ visible, onClose, onSave }) => {
  const [ipAddress, setIpAddress] = useState<string>('');
  
  useEffect(() => {
    // 从localStorage获取保存的IP地址
    const savedIP = localStorage.getItem('local_network_ip') || getLocalIP();
    setIpAddress(savedIP);
  }, [visible]);
  
  const handleSave = () => {
    // 简单验证IP地址格式
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    if (!ipRegex.test(ipAddress)) {
      Toast.show({
        icon: 'fail',
        content: 'IP地址格式不正确'
      });
      return;
    }
    
    // 保存IP地址
    localStorage.setItem('local_network_ip', ipAddress);
    onSave(ipAddress);
    Toast.show({
      icon: 'success',
      content: 'IP地址已保存'
    });
    onClose();
  };
  
  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{ 
        borderTopLeftRadius: '8px', 
        borderTopRightRadius: '8px',
        padding: '16px'
      }}
    >
      <div style={{ padding: '16px 0' }}>
        <h3 style={{ margin: '0 0 16px 0', textAlign: 'center' }}>设置本地网络IP地址</h3>
        
        <Form layout='horizontal'>
          <Form.Item 
            label='IP地址' 
            help='输入您电脑在局域网中的IP地址，以便同一网络下的设备能够访问Ollama服务'
          >
            <Input 
              placeholder='如：192.168.1.100' 
              value={ipAddress}
              onChange={val => setIpAddress(val)}
            />
          </Form.Item>
          
          <div style={{ margin: '16px 0', fontSize: '14px', color: '#666' }}>
            <p>如何获取局域网IP地址:</p>
            <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
              <li>Windows: 打开CMD，输入 <code>ipconfig</code></li>
              <li>Mac/Linux: 打开终端，输入 <code>ifconfig</code> 或 <code>ip addr</code></li>
              <li>查找IPv4地址，通常以192.168或10.0开头</li>
            </ul>
          </div>
        </Form>
        
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <Button 
            block 
            color='default' 
            onClick={onClose}
            style={{ flex: 1 }}
          >
            取消
          </Button>
          <Button 
            block 
            color='primary' 
            onClick={handleSave}
            style={{ flex: 1 }}
          >
            保存
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default IPSettingsPopup; 