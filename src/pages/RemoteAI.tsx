import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  Avatar,
  IconButton,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Switch,
  FormControlLabel
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SettingsIcon from '@mui/icons-material/Settings';
import MicIcon from '@mui/icons-material/Mic';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { OllamaService } from '../services/ollamaService';

// 消息类型定义
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// AI模型选项
const AI_MODELS = [
  { id: 'gemma3:12b', name: 'Gemma3 (12B)' },
  { id: 'llama3:8b', name: 'Llama3 (8B)' },
  { id: 'mistral:7b', name: 'Mistral (7B)' },
  { id: 'phi3:medium', name: 'Phi-3 (Medium)' },
];

const RemoteAI: React.FC = () => {
  // 状态管理
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // AI模型设置
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id);
  const [useVoiceOutput, setUseVoiceOutput] = useState(false);
  
  // 引用
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // 监听消息更新，自动滚动
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // 焦点到输入框
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // 添加初始欢迎消息
  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: '您好！我是AI助手，可以帮您解答问题、闲聊或提供信息。请问有什么可以帮助您的？',
        timestamp: new Date()
      }
    ]);
  }, []);
  
  // 处理模型变更
  const handleModelChange = (event: SelectChangeEvent) => {
    setSelectedModel(event.target.value);
  };
  
  // 处理语音输出切换
  const handleVoiceOutputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseVoiceOutput(event.target.checked);
  };
  
  // 发送消息
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await OllamaService.sendMessage(input, [], selectedModel);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // 语音输出
      if (useVoiceOutput && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.lang = 'zh-CN';
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('AI响应错误:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '很抱歉，我遇到了问题。请检查您的网络连接或稍后再试。',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 按Enter发送
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };
  
  // 语音输入（简化版本，实际需更复杂实现）
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('您的浏览器不支持语音识别');
      return;
    }
    
    alert('语音识别功能正在准备中...\n完整版本需要集成SpeechRecognition API');
  };
  
  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', py: 2 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%', 
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        {/* 顶部标题栏 */}
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: 'primary.main', 
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6">AI牵伴 - 远程对话</Typography>
          <IconButton color="inherit" onClick={() => setShowSettings(!showSettings)}>
            <SettingsIcon />
          </IconButton>
        </Box>
        
        {/* 设置面板 */}
        {showSettings && (
          <Card sx={{ m: 2, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                对话设置
              </Typography>
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel id="model-select-label">AI模型</InputLabel>
                <Select
                  labelId="model-select-label"
                  value={selectedModel}
                  label="AI模型"
                  onChange={handleModelChange}
                >
                  {AI_MODELS.map(model => (
                    <MenuItem key={model.id} value={model.id}>
                      {model.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={useVoiceOutput} 
                    onChange={handleVoiceOutputChange}
                    color="primary"
                  />
                }
                label="使用语音回答"
              />
            </CardContent>
          </Card>
        )}
        
        {/* 消息列表 */}
        <List 
          sx={{ 
            flexGrow: 1, 
            overflow: 'auto',
            bgcolor: '#f5f5f5',
            p: 2
          }}
        >
          {messages.map((message) => (
            <ListItem 
              key={message.id}
              sx={{ 
                display: 'flex',
                flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                mb: 2,
                px: 0
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
                  mr: message.role === 'user' ? 0 : 1,
                  ml: message.role === 'user' ? 1 : 0
                }}
              >
                {message.role === 'user' ? '我' : 'AI'}
              </Avatar>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  borderRadius: 2,
                  bgcolor: message.role === 'user' ? 'primary.light' : 'white',
                  color: message.role === 'user' ? 'white' : 'text.primary'
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.content}
                </Typography>
                <Typography variant="caption" color={message.role === 'user' ? 'rgba(255,255,255,0.7)' : 'text.secondary'} sx={{ display: 'block', mt: 1 }}>
                  {message.timestamp.toLocaleTimeString()}
                </Typography>
              </Paper>
            </ListItem>
          ))}
          
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </List>
        
        <Divider />
        
        {/* 输入区域 */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <IconButton color="primary" onClick={handleVoiceInput}>
            <MicIcon />
          </IconButton>
          
          <TextField
            fullWidth
            placeholder="请输入您的问题..."
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            inputRef={inputRef}
            multiline
            maxRows={3}
            size="small"
            sx={{ mx: 1 }}
          />
          
          <IconButton 
            color="primary" 
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
          >
            <SendIcon />
          </IconButton>
          
          {useVoiceOutput && (
            <IconButton color="primary">
              <VolumeUpIcon />
            </IconButton>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default RemoteAI; 