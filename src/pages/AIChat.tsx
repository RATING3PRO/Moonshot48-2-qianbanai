import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Avatar, Space, Toast, SpinLoading, ImageUploader, NavBar } from 'antd-mobile';
import { PictureOutline, SoundOutline, SendOutline, CheckCircleOutline, CloseCircleOutline, ScanningOutline, SetOutline } from 'antd-mobile-icons';
import { OllamaService } from '../services/ollamaService';
import { OLLAMA_API } from '../config/api';
import { useNavigate } from 'react-router-dom';
import styles from './AIChat.module.css';
import IPSettingsPopup from '../components/IPSettingsPopup';
import { getLocalIP } from '../config/api';

// Web Speech API类型声明
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

// SpeechRecognition类型
type SpeechRecognition = any;

// 图标组件
const SendIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>;
const MicIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>;
const StopIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/></svg>;
const BackIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>;

// 消息类型定义
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  imageUrl?: string; // 添加图片URL字段
}

// 聊天消息接口，用于构建Ollama的消息历史
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// 语音识别事件接口
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      }
    }
  };
  error: {
    error: string;
  };
}

const AIChat: React.FC = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 消息状态
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Ollama服务状态
  const [serviceStatus, setServiceStatus] = useState({
    connected: false,
    message: '正在连接到Ollama服务...'
  });
  
  // 语音识别状态
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  
  // IP设置状态
  const [showIPSettings, setShowIPSettings] = useState(false);
  const [localNetworkIP, setLocalNetworkIP] = useState<string>(getLocalIP());
  
  // 初始化和服务连接检查
  useEffect(() => {
    // 检查Ollama服务连接
    checkOllamaConnection();
    
    // 添加欢迎消息
    const welcomeMessage: Message = {
      id: 1,
      text: "您好！我是您的AI助手，很高兴能为您服务。我可以帮您回答问题、提供日常聊天陪伴，您也可以发送图片或使用语音与我交流。",
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    
    // 自动滚动到最新消息
    scrollToBottom();
  }, []);
  
  // 监听消息变化，自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // 初始化语音识别
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'zh-CN';
      
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsRecording(false);
        // 自动发送语音输入
        setTimeout(() => {
          if (transcript.trim()) {
            sendMessageWithText(transcript);
          }
        }, 500);
      };
      
      recognitionInstance.onerror = (event: SpeechRecognitionEvent) => {
        console.error('语音识别错误:', event.error);
        setIsRecording(false);
        Toast.show({
          content: '语音识别失败，请重试',
          position: 'bottom'
        });
      };
      
      setRecognition(recognitionInstance);
    } else {
      console.warn('此浏览器不支持Web Speech API');
    }
    
    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {
          // 忽略错误
        }
      }
    };
  }, []);
  
  // 滚动到底部
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // 检查Ollama服务连接
  const checkOllamaConnection = async () => {
    try {
      setServiceStatus({
        connected: false,
        message: '正在连接到Ollama服务...'
      });
      
      const connectionResult = await OllamaService.testConnection();
      
      if (connectionResult.success) {
        setServiceStatus({
          connected: true,
          message: connectionResult.message
        });
        
        // 检查模型是否可用
        const models = await OllamaService.getModels();
        if (!models.includes('gemma3:12b')) {
          Toast.show({
            content: '警告：未检测到gemma3:12b模型，请确保已下载该模型',
            position: 'center',
            duration: 5000
          });
        }
      } else {
        setServiceStatus({
          connected: false,
          message: connectionResult.message
        });
        
        Toast.show({
          content: '无法连接到Ollama服务，请确保服务已启动',
          position: 'center'
        });
      }
    } catch (error) {
      console.error('检查Ollama服务失败:', error);
      setServiceStatus({
        connected: false,
        message: '连接Ollama服务失败'
      });
    }
  };
  
  // 处理图片上传
  const handleImageUpload = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setImageUrl(dataUrl);
        resolve(dataUrl);
      };
      reader.onerror = () => reject(new Error('读取图片失败'));
      reader.readAsDataURL(file);
    });
  };
  
  // 用指定文本发送消息
  const sendMessageWithText = (text: string) => {
    if (!text.trim() && !imageUrl) return;
    
    // 如果Ollama服务未连接，提示用户
    if (!serviceStatus.connected) {
      Toast.show({
        content: '无法连接到Ollama服务。请确保服务已启动并刷新页面。',
        position: 'center'
      });
      return;
    }
    
    // 构建消息文本
    const messageText = text.trim() || (imageUrl ? '我发送了一张图片' : '');
    
    // 添加用户消息
    const userMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      imageUrl: imageUrl || undefined
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setImageUrl(null);
    
    // 添加用户消息到聊天历史
    let userContent = messageText;
    if (imageUrl) {
      // 如果有图片，添加图片描述
      userContent = `${messageText}\n[图片内容: 用户上传了一张图片]`;
    }
    
    const userChatMessage: ChatMessage = {
      role: 'user',
      content: userContent
    };
    const updatedHistory = [...chatHistory, userChatMessage];
    setChatHistory(updatedHistory);
    
    // 调用AI生成响应
    handleAIResponse(userContent, updatedHistory);
  };
  
  // 发送消息
  const sendMessage = () => {
    sendMessageWithText(inputText);
  };
  
  // 处理AI响应
  const handleAIResponse = async (userMessage: string, history: ChatMessage[]) => {
    setIsAIResponding(true);
    
    try {
      // 使用gemma3:12b模型
      const aiResponse = await OllamaService.sendMessage(
        userMessage,
        history,
        'gemma3:12b'
      );
      
      // 添加AI回复
      addAIResponse(aiResponse, history);
    } catch (error) {
      console.error('获取AI响应失败:', error);
      
      // 添加错误消息
      const errorMessage = error instanceof Error 
        ? error.message 
        : '与AI服务通信时发生错误，请稍后重试';
      
      addAIResponse(`抱歉，我遇到了问题: ${errorMessage}`, history);
      
      Toast.show({
        content: '获取AI响应失败，请稍后重试',
        position: 'center'
      });
    }
  };
  
  // 添加AI响应到消息列表
  const addAIResponse = (responseText: string, history: ChatMessage[]) => {
    // 添加AI回复到消息列表
    const aiMessage: Message = {
      id: messages.length + 2,
      text: responseText,
      sender: 'ai',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, aiMessage]);
    
    // 添加AI回复到聊天历史
    const aiChatMessage: ChatMessage = {
      role: 'assistant',
      content: responseText
    };
    setChatHistory([...history, aiChatMessage]);
    
    setIsAIResponding(false);
    
    // 语音播报AI回复
    speakText(responseText);
  };
  
  // 处理语音输入
  const handleVoiceInput = () => {
    if (!recognition) {
      Toast.show({
        content: '您的浏览器不支持语音识别',
        position: 'bottom'
      });
      return;
    }
    
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
      
      Toast.show({
        content: '请开始说话...',
        position: 'bottom',
        duration: 1500
      });
    }
  };
  
  // 语音朗读文本
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9; // 速度略慢，适合老年人
      window.speechSynthesis.speak(utterance);
    }
  };
  
  // 格式化时间显示
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };
  
  // 返回主页
  const goBack = () => {
    navigate('/');
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
    // 提示用户重新启动应用
    Toast.show({
      content: '设置已保存，请重新启动应用以应用更改',
      position: 'bottom',
    });
  };
  
  return (
    <div className={styles.aiChatContainer}>
      <NavBar 
        back={null} 
        backArrow={false}
        right={
          <div style={{ display: 'flex', gap: '16px' }}>
            <div onClick={handleOpenIPSettings}>
              <SetOutline fontSize={24} />
            </div>
            {serviceStatus.connected ? 
              <CheckCircleOutline fontSize={24} color="#10b981" onClick={checkOllamaConnection} /> : 
              <CloseCircleOutline fontSize={24} color="#ef4444" onClick={checkOllamaConnection} />
            }
          </div>
        }
      >
        AI聊天
      </NavBar>
      
      {/* 连接状态提示 */}
      {!serviceStatus.connected && (
        <div className={styles.connectionWarning}>
          <p>{serviceStatus.message}</p>
          <Button 
            color="primary"
            onClick={checkOllamaConnection}
            loading={serviceStatus.message.includes('正在连接')}
          >
            重新连接
          </Button>
        </div>
      )}
      
      {/* 消息列表 */}
      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div key={message.id} className={`${styles.message} ${styles[message.sender]}`}>
            <div className={styles.messageAvatar}>
              <Avatar src={message.sender === 'ai' ? '/ai-avatar.png' : '/user-avatar.png'} />
            </div>
            <div className={styles.messageContent}>
              <div className={styles.messageBubble}>
                {message.imageUrl && (
                  <div className={styles.messageImage}>
                    <img src={message.imageUrl} alt="用户上传" />
                  </div>
                )}
                <div className={styles.messageText}>{message.text}</div>
              </div>
              <div className={styles.messageTime}>{formatTime(message.timestamp)}</div>
            </div>
          </div>
        ))}
        
        {isAIResponding && (
          <div className={`${styles.message} ${styles.ai} ${styles.typing}`}>
            <div className={styles.messageAvatar}>
              <Avatar src="/ai-avatar.png" />
            </div>
            <div className={styles.messageContent}>
              <div className={styles.messageBubble}>
                <SpinLoading color="#4A90E2" />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* 输入区域 */}
      <div className={styles.inputContainer}>
        <div className={styles.imageUploadContainer}>
          <ImageUploader
            value={imageUrl ? [{ url: imageUrl }] : []}
            onChange={files => {
              if (files.length === 0) {
                setImageUrl(null);
              }
            }}
            upload={async file => {
              const url = await handleImageUpload(file);
              return { url };
            }}
            maxCount={1}
            showUpload={imageUrl === null}
            preview={true}
            disableUpload={!serviceStatus.connected || isAIResponding}
          >
            <div className={styles.uploadButton}>
              <PictureOutline fontSize={24} />
            </div>
          </ImageUploader>
        </div>
        
        <div className={styles.inputWrapper}>
          <Input
            className={styles.messageInput}
            placeholder={serviceStatus.connected ? "请输入消息..." : "请先启动Ollama服务..."}
            value={inputText}
            onChange={setInputText}
            onEnterPress={sendMessage}
            disabled={!serviceStatus.connected || isAIResponding}
          />
          
          <Space>
            <Button 
              className={styles.voiceBtn}
              onClick={handleVoiceInput}
              disabled={!serviceStatus.connected || isAIResponding || !recognition}
            >
              {isRecording ? <StopIcon /> : <MicIcon />}
            </Button>
            
            <Button 
              className={styles.sendBtn}
              onClick={sendMessage}
              disabled={!serviceStatus.connected || isAIResponding || (!inputText.trim() && !imageUrl)}
            >
              <SendIcon />
            </Button>
          </Space>
        </div>
      </div>
      
      {/* IP设置弹窗 */}
      <IPSettingsPopup
        visible={showIPSettings}
        onClose={handleCloseIPSettings}
        onSave={handleSaveIPSettings}
      />
    </div>
  );
};

export default AIChat;