import React, { useState, useEffect, useRef } from 'react';
import { Container, Box, TextField, Button, Typography, Paper, CircularProgress, Select, MenuItem, FormControl, InputLabel, Alert, SelectChangeEvent } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { HuggingFaceService } from '../services/huggingFaceService';
import { HUGGINGFACE_API } from '../config/api';
import Layout from '../components/Layout';

// 消息类型
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const HuggingFaceChat: React.FC = () => {
  // 状态管理
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  const [connectionMessage, setConnectionMessage] = useState('正在检查连接...');
  const [selectedModel, setSelectedModel] = useState(HUGGINGFACE_API.MODELS.DEFAULT);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const availableModels = HuggingFaceService.getAvailableModels();

  // 初始化和API连接测试
  useEffect(() => {
    const testConnection = async () => {
      try {
        setConnectionMessage('正在检查连接...');
        const result = await HuggingFaceService.testConnection();
        setApiConnected(result.success);
        setConnectionMessage(result.message);
        
        // 添加欢迎消息
        if (result.success) {
          setTimeout(() => {
            setMessages([
              {
                role: 'assistant',
                content: '您好！我是基于Hugging Face的AI助手。我可以帮您回答问题、提供信息或者聊天。请问有什么可以帮您的吗？\n\n注意：首次使用某个模型时，可能需要几分钟来加载模型。请耐心等待。',
                timestamp: new Date()
              }
            ]);
          }, 1000);
        }
      } catch (error) {
        console.error('测试API连接失败:', error);
        setApiConnected(false);
        setConnectionMessage('无法连接到Hugging Face API，请稍后再试');
      }
    };

    testConnection();
  }, []);

  // 选择模型
  const handleModelChange = (event: SelectChangeEvent) => {
    const modelId = event.target.value;
    HuggingFaceService.setModel(modelId);
    setSelectedModel(modelId);
  };

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 发送消息处理
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // 添加用户消息
    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // 转换消息历史为API需要的格式
      const history = messages.filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .map(({ role, content }) => ({ role, content }));

      // 调用AI服务获取回复
      const response = await HuggingFaceService.sendMessage(inputMessage, history);

      // 添加AI回复
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('获取AI回复失败:', error);
      
      // 添加错误消息
      const errorMessage: Message = {
        role: 'assistant',
        content: `很抱歉，我在回复您时遇到了问题：${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 快捷键发送（Enter键）
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 格式化消息显示
  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <Layout title="Hugging Face AI 聊天">
      <Container maxWidth="md" sx={{ py: 4, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Hugging Face AI 聊天
        </Typography>
        
        {/* 连接状态 */}
        {apiConnected !== null && (
          <Alert 
            severity={apiConnected ? "success" : "error"} 
            sx={{ mb: 2 }}
            action={
              apiConnected && (
                <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>选择AI模型</InputLabel>
                  <Select
                    value={selectedModel}
                    label="选择AI模型"
                    onChange={handleModelChange}
                  >
                    {availableModels.map(model => (
                      <MenuItem key={model.id} value={model.id}>{model.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )
            }
          >
            {connectionMessage}
          </Alert>
        )}

        {/* 聊天消息区域 */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            mb: 2, 
            flexGrow: 1, 
            overflowY: 'auto',
            bgcolor: '#f5f5f5',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {messages.length === 0 && !isLoading ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              opacity: 0.7
            }}>
              <Typography variant="body1" sx={{ textAlign: 'center' }}>
                {apiConnected === true 
                  ? '准备好开始聊天了！发送消息开始对话。' 
                  : '等待连接到AI服务...'}
              </Typography>
            </Box>
          ) : (
            <>
              {messages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2,
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '80%',
                      bgcolor: message.role === 'user' ? '#e3f2fd' : '#fff',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {message.role === 'user' ? '您' : 'AI助手'}
                    </Typography>
                    <Typography variant="body1">
                      {formatMessage(message.content)}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                      {message.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Paper>
                </Box>
              ))}
              
              {isLoading && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '80%',
                      bgcolor: '#fff',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <CircularProgress size={20} sx={{ mr: 2 }} />
                    <Typography variant="body1">AI正在思考中...</Typography>
                  </Paper>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </Paper>

        {/* 输入区域 */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="输入您的问题..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!apiConnected || isLoading}
            multiline
            maxRows={3}
            sx={{ bgcolor: '#fff' }}
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
            disabled={!apiConnected || isLoading || !inputMessage.trim()}
            sx={{ minWidth: '100px' }}
          >
            发送
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default HuggingFaceChat; 