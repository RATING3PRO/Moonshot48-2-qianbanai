import React, { useEffect, useState, useRef } from 'react';
import { NavBar, Input, Button, List, Toast, Popup, Dialog, Tag, Form, TextArea, Radio, Selector, Space } from 'antd-mobile';
import { RemoteOllamaService } from '../services/remoteOllamaService';
import { NgrokService } from '../services/ngrokService';
import { HuggingFaceService } from '../services/huggingFaceService';
import { UserOutline, InformationCircleOutline, CloseCircleOutline, CheckCircleOutline, ArrowDownCircleOutline, SetOutline } from 'antd-mobile-icons';
import ReactMarkdown from 'react-markdown';
import './RemoteChat.css';
import IPSettingsPopup from '../components/IPSettingsPopup';
import { getLocalIP } from '../config/api';

// 聊天消息接口
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

// 远程聊天组件
const RemoteChat: React.FC = () => {
  // 状态变量
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [remoteUrl, setRemoteUrl] = useState<string | null>(RemoteOllamaService.remoteURL);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>(
    RemoteOllamaService.hasRemoteURL() ? 'connected' : 'disconnected'
  );
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('gemma3:12b'); // 默认使用gemma3:12b
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [tempRemoteUrl, setTempRemoteUrl] = useState('');
  const [ngrokUrl, setNgrokUrl] = useState<string | null>(NgrokService.getNgrokURL());
  const [serviceType, setServiceType] = useState<'ollama' | 'huggingface'>('ollama');
  const [hfModels, setHfModels] = useState<{label: string, value: string}[]>([]);
  const [selectedHfModel, setSelectedHfModel] = useState<string>(HuggingFaceService.getSelectedModel());
  const [showIPSettings, setShowIPSettings] = useState(false);
  const [localNetworkIP, setLocalNetworkIP] = useState<string>(getLocalIP());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 读取聊天历史
  useEffect(() => {
    const savedMessages = localStorage.getItem('remote_chat_messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // 确保时间戳正确转换
        const messagesWithDate = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDate);
      } catch (e) {
        console.error('无法解析保存的聊天记录:', e);
      }
    }
    
    // 添加系统欢迎消息（如果没有消息）
    if (!savedMessages) {
      const welcomeMessage: Message = {
        id: 'welcome-' + Date.now(),
        content: '欢迎使用AI聊天! 您可以选择使用Ollama远程模型或Hugging Face在线模型。点击右上角的设置图标进行配置。',
        role: 'system',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
    
    // 获取可用模型
    fetchAvailableModels();
    
    // 获取Hugging Face模型列表
    const hfModelList = HuggingFaceService.getAvailableModels();
    setHfModels(hfModelList.map(model => ({
      label: model.name,
      value: model.id
    })));
  }, []);
  
  // 保存聊天记录
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('remote_chat_messages', JSON.stringify(messages));
    }
  }, [messages]);
  
  // 自动滚动到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // 获取可用模型列表
  const fetchAvailableModels = async () => {
    if (connectionStatus === 'connected') {
      try {
        const models = await RemoteOllamaService.getModels();
        if (models.length > 0) {
          setAvailableModels(models);
          // 如果模型列表中存在gemma3:12b，选择它，否则使用第一个可用模型
          const gemmaModel = models.find(m => m === 'gemma3:12b');
          if (gemmaModel && selectedModel !== gemmaModel) {
            setSelectedModel(gemmaModel);
          } else if (!gemmaModel && models.length > 0 && !models.includes(selectedModel)) {
            setSelectedModel(models[0]);
          }
        } else {
          Toast.show({
            icon: 'fail',
            content: '无法获取模型列表，请检查Ollama服务状态'
          });
        }
      } catch (error) {
        console.error('获取模型列表失败:', error);
        Toast.show({
          icon: 'fail',
          content: '获取模型列表失败，请检查连接'
        });
      }
    }
  };
  
  // 发送消息
  const sendMessage = async () => {
    if (!inputText.trim() || isGenerating) return;
    
    // 检查连接状态（仅Ollama服务需要）
    if (serviceType === 'ollama' && connectionStatus !== 'connected') {
      Toast.show({
        icon: 'fail',
        content: '请先连接到Ollama服务'
      });
      setShowSettingsPopup(true);
      return;
    }
    
    const userMessage: Message = {
      id: 'user-' + Date.now(),
      content: inputText.trim(),
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    setIsGenerating(true);
    
    try {
      // 构建聊天历史
      const chatHistory = messages
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      
      let response = '';
      
      // 根据选择的服务类型调用不同的API
      if (serviceType === 'ollama') {
        // 获取Ollama响应
        response = await RemoteOllamaService.sendMessage(
          userMessage.content,
          chatHistory,
          selectedModel
        );
      } else {
        // 获取Hugging Face响应
        response = await HuggingFaceService.sendMessage(
          userMessage.content,
          chatHistory,
          selectedHfModel
        );
      }
      
      const assistantMessage: Message = {
        id: 'assistant-' + Date.now(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('获取AI响应时出错:', error);
      const errorMessage: Message = {
        id: 'error-' + Date.now(),
        content: `生成回复时出错: ${error instanceof Error ? error.message : String(error)}`,
        role: 'system',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      Toast.show({
        icon: 'fail',
        content: '生成回复失败'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // 测试连接
  const testConnection = async (url: string) => {
    setConnectionStatus('testing');
    const result = await RemoteOllamaService.testConnection(url);
    
    if (result.success) {
      Toast.show({
        icon: 'success',
        content: result.message
      });
      return true;
    } else {
      Toast.show({
        icon: 'fail',
        content: result.message
      });
      setConnectionStatus('disconnected');
      return false;
    }
  };
  
  // 连接到远程Ollama服务
  const connectToRemote = async () => {
    if (!tempRemoteUrl.trim()) {
      Toast.show({
        icon: 'fail',
        content: '请输入远程URL'
      });
      return;
    }
    
    const result = await RemoteOllamaService.setAndValidateRemoteURL(tempRemoteUrl);
    
    if (result.success) {
      setRemoteUrl(tempRemoteUrl);
      setConnectionStatus('connected');
      setShowSettingsPopup(false);
      
      // 添加连接成功消息
      const systemMessage: Message = {
        id: 'system-' + Date.now(),
        content: `成功连接到远程Ollama服务: ${tempRemoteUrl}`,
        role: 'system',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, systemMessage]);
      
      // 获取模型列表
      fetchAvailableModels();
    } else {
      setConnectionStatus('disconnected');
    }
  };
  
  // 保存ngrok URL
  const saveNgrokUrl = () => {
    if (ngrokUrl) {
      if (NgrokService.isValidNgrokURL(ngrokUrl)) {
        NgrokService.setNgrokURL(ngrokUrl);
        setTempRemoteUrl(ngrokUrl); // 自动填充到远程URL输入框
        Toast.show({
          icon: 'success',
          content: 'ngrok URL已保存'
        });
      } else {
        Toast.show({
          icon: 'fail',
          content: '无效的ngrok URL格式'
        });
      }
    } else {
      NgrokService.setNgrokURL(null);
      Toast.show({
        icon: 'success',
        content: 'ngrok URL已清除'
      });
    }
  };
  
  // 断开连接
  const disconnectRemote = () => {
    Dialog.confirm({
      title: '断开连接',
      content: '确定要断开与远程Ollama服务的连接吗？',
      onConfirm: () => {
        RemoteOllamaService.clearRemoteURL();
        setRemoteUrl(null);
        setConnectionStatus('disconnected');
        
        // 添加断开连接消息
        const systemMessage: Message = {
          id: 'system-' + Date.now(),
          content: '已断开与远程Ollama服务的连接',
          role: 'system',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, systemMessage]);
        
        Toast.show({
          icon: 'success',
          content: '已断开连接'
        });
      }
    });
  };
  
  // 清空聊天记录
  const clearChat = () => {
    Dialog.confirm({
      title: '清空聊天',
      content: '确定要清空所有聊天记录吗？此操作不可撤销。',
      onConfirm: () => {
        const welcomeMessage: Message = {
          id: 'welcome-' + Date.now(),
          content: '聊天记录已清空。您可以开始新的对话了。',
          role: 'system',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
        localStorage.removeItem('remote_chat_messages');
        Toast.show({
          icon: 'success',
          content: '聊天记录已清空'
        });
      }
    });
  };
  
  // 渲染聊天消息
  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';
    
    return (
      <div 
        key={message.id} 
        className={`message-container ${isUser ? 'user-message' : isSystem ? 'system-message' : 'assistant-message'}`}
      >
        {!isSystem && (
          <div className="message-avatar">
            {isUser ? (
              <UserOutline />
            ) : (
              <img 
                src="/ai-avatar.png" 
                alt="AI" 
                className="ai-avatar" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-avatar.png';
                }} 
              />
            )}
          </div>
        )}
        <div className={`message-bubble ${isSystem ? 'system-bubble' : ''}`}>
          {isSystem ? (
            <div className="system-content">{message.content}</div>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
          <div className="message-time">
            {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
      </div>
    );
  };
  
  // 打开IP设置弹窗
  const handleOpenIPSettings = () => {
    setShowIPSettings(true);
  };

  // 关闭IP设置弹窗
  const handleCloseIPSettings = () => {
    setShowIPSettings(false);
  };

  // 保存IP设置
  const handleSaveIPSettings = (ip: string) => {
    setLocalNetworkIP(ip);
    Toast.show({
      content: '设置已保存，请重新启动应用以应用更改',
      position: 'bottom',
    });
  };
  
  // 远程设置弹窗
  const renderSettingsPopup = () => (
    <Popup
      visible={showSettingsPopup}
      onMaskClick={() => setShowSettingsPopup(false)}
      bodyStyle={{ 
        borderTopLeftRadius: '8px', 
        borderTopRightRadius: '8px',
        padding: '16px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}
    >
      <div style={{ padding: '0 0 16px 0' }}>
        <h3>远程AI模型设置</h3>
        
        {/* 服务类型选择 */}
        <Radio.Group
          value={serviceType}
          onChange={(val) => {
            setServiceType(val as 'ollama' | 'huggingface');
            if (val === 'huggingface') {
              setConnectionStatus('connected'); // HF总是可连接的
            } else if (val === 'ollama' && !RemoteOllamaService.hasRemoteURL()) {
              setConnectionStatus('disconnected');
            }
          }}
        >
          <Space direction="vertical" block>
            <Radio value="ollama">使用远程Ollama服务</Radio>
            <Radio value="huggingface">使用Hugging Face在线模型</Radio>
          </Space>
        </Radio.Group>
        
        {/* Ollama设置 */}
        {serviceType === 'ollama' && (
          <div style={{ margin: '16px 0' }}>
            <Form layout="horizontal">
              <Form.Item
                label="远程Ollama地址"
                help="输入ngrok或自托管的Ollama API地址"
              >
                <Space block>
                  <Input
                    placeholder="如: https://xxx.ngrok-free.app"
                    value={tempRemoteUrl}
                    onChange={setTempRemoteUrl}
                    style={{ flexGrow: 1 }}
                  />
                  {connectionStatus === 'connected' ? 
                    <CheckCircleOutline fontSize={24} color="#10b981" onClick={() => testConnection(tempRemoteUrl)} /> : 
                    <CloseCircleOutline fontSize={24} color="#ef4444" onClick={() => testConnection(tempRemoteUrl)} />
                  }
                </Space>
              </Form.Item>
            </Form>
            
            {/* 本地网络IP设置 */}
            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>本地网络IP设置:</span>
                <Button 
                  size="mini" 
                  color="primary" 
                  onClick={handleOpenIPSettings}
                >
                  <SetOutline /> 设置
                </Button>
              </div>
              <div style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '8px', 
                borderRadius: '4px', 
                marginTop: '4px',
                fontSize: '14px' 
              }}>
                当前IP: <strong>{localNetworkIP}</strong>
                <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
                  同一网络下的设备可以通过 <code>http://{localNetworkIP}:11434</code> 访问您的Ollama服务
                </div>
              </div>
            </div>
            
            {ngrokUrl && (
              <div style={{ marginTop: '16px' }}>
                <p>已保存的ngrok地址:</p>
                <Tag color="primary" fill="outline" style={{ padding: '4px 8px' }}>
                  {ngrokUrl}
                </Tag>
                <Button
                  block
                  color="danger"
                  size="small"
                  style={{ marginTop: '8px' }}
                  onClick={() => {
                    NgrokService.setNgrokURL(null);
                    setNgrokUrl(null);
                  }}
                >
                  清除ngrok地址
                </Button>
              </div>
            )}
            
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              {connectionStatus === 'connected' ? (
                <Button
                  block
                  color="danger"
                  onClick={disconnectRemote}
                >
                  断开连接
                </Button>
              ) : (
                <Button
                  block
                  color="primary"
                  disabled={!tempRemoteUrl.trim()}
                  onClick={connectToRemote}
                >
                  连接到远程服务
                </Button>
              )}
              <Button
                color="default"
                onClick={() => {
                  setShowHelpPopup(true);
                  setShowSettingsPopup(false);
                }}
              >
                帮助
              </Button>
            </div>
          </div>
        )}
        
        {/* Hugging Face设置 */}
        {serviceType === 'huggingface' && (
          <div style={{ margin: '16px 0' }}>
            <Form layout="horizontal">
              <Form.Item label="选择模型">
                <Selector
                  options={hfModels}
                  value={[selectedHfModel]}
                  onChange={(arr) => {
                    if (arr.length > 0) {
                      const selectedModel = arr[0].toString();
                      setSelectedHfModel(selectedModel);
                      HuggingFaceService.setSelectedModel(selectedModel);
                    }
                  }}
                />
              </Form.Item>
            </Form>
            
            <Button
              block
              color="primary"
              onClick={() => setShowSettingsPopup(false)}
            >
              确认
            </Button>
          </div>
        )}
      </div>
    </Popup>
  );
  
  // 渲染帮助弹窗
  const renderHelpPopup = () => (
    <Popup
      visible={showHelpPopup}
      onMaskClick={() => setShowHelpPopup(false)}
      position="bottom"
      bodyStyle={{ height: '70vh', padding: '20px' }}
    >
      <div className="help-popup">
        <NavBar 
          back={null} 
          right={<CloseCircleOutline onClick={() => setShowHelpPopup(false)} />}
        >
          ngrok设置帮助
        </NavBar>
        
        <div className="help-content">
          <ReactMarkdown>{NgrokService.getFullHelp()}</ReactMarkdown>
        </div>
      </div>
    </Popup>
  );
  
  return (
    <div className="remote-chat-container">
      <NavBar
        back={null}
        right={
          <div className="navbar-actions">
            <InformationCircleOutline onClick={() => setShowHelpPopup(true)} />
            <div 
              className={`connection-indicator ${connectionStatus === 'connected' ? 'connected' : 'disconnected'}`}
              onClick={() => setShowSettingsPopup(true)}
            >
              {connectionStatus === 'connected' ? '已连接' : '未连接'}
            </div>
          </div>
        }
        onBack={() => window.history.back()}
      >
        远程AI助手
      </NavBar>
      
      <div className="chat-content">
        <div className="model-info">
          <Tag color={connectionStatus === 'connected' ? 'primary' : 'danger'}>
            {connectionStatus === 'connected' ? `${selectedModel}` : '未连接'}
          </Tag>
          {connectionStatus === 'connected' && remoteUrl && (
            <span className="remote-indicator">
              远程模式
            </span>
          )}
        </div>
        
        <div className="messages-container">
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chat-input">
          <div className="input-container">
            <TextArea
              placeholder="请输入消息..."
              value={inputText}
              onChange={(val: string) => setInputText(val)}
              autoSize={{ minRows: 1, maxRows: 4 }}
              onEnterPress={e => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button
              className="send-button"
              color="primary"
              loading={isGenerating}
              disabled={!inputText.trim() || isGenerating || connectionStatus !== 'connected'}
              onClick={sendMessage}
            >
              {isGenerating ? '生成中...' : '发送'}
            </Button>
          </div>
          
          <div className="chat-actions">
            <Button
              size="mini"
              onClick={() => setShowSettingsPopup(true)}
            >
              设置
            </Button>
            <Button
              size="mini"
              onClick={clearChat}
            >
              清空聊天
            </Button>
          </div>
        </div>
      </div>
      
      {renderSettingsPopup()}
      {renderHelpPopup()}
      
      {/* IP设置弹窗 */}
      <IPSettingsPopup
        visible={showIPSettings}
        onClose={handleCloseIPSettings}
        onSave={handleSaveIPSettings}
      />
    </div>
  );
};

export default RemoteChat; 