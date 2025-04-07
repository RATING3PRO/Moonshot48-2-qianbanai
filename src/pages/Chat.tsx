import React, { useState, useEffect, useRef } from 'react';
import { NavBar, List, Card, SwipeAction, Button, 
  Space, Modal, Form, Dialog, Avatar, Input, Toast, Empty, Tag, Badge, Image, Popup } from 'antd-mobile';
import { LeftOutline, CheckOutline, SmileOutline, RightOutline, PictureOutline, SoundOutline, CloseCircleOutline } from 'antd-mobile-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './Chat.module.css';
import { InterestCollector } from '../services/interestCollector';
import InterestDialog from '../components/InterestDialog';

interface Message {
  id: number;
  content: string;
  type: 'text' | 'image';
  sender: 'user' | 'friend';
  timestamp: string;
}

interface ChatHistory {
  id: number;
  user_id: number;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

interface UserInterest {
  category: string;
  name: string;
  level: number;
}

interface Friend {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
}

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [showHistories, setShowHistories] = useState(false);
  const [currentHistoryId, setCurrentHistoryId] = useState<number | null>(null);
  const [isNewChat, setIsNewChat] = useState(true);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isShowingInterests, setIsShowingInterests] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showInterestDialog, setShowInterestDialog] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [friend, setFriend] = useState<Friend | null>(null);

  // 页面加载时获取登录用户信息
  useEffect(() => {
    // 优先从localStorage获取，其次从sessionStorage获取
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
      fetchChatHistories(user.id);
      
      // 初始显示AI问候语
      fetchAIGreeting(user.id);
    } else {
      Toast.show({
        content: '请先登录',
        afterClose: () => {
          navigate('/login');
        },
      });
    }
  }, [navigate]);

  useEffect(() => {
    const state = location.state as { friend?: Friend };
    if (state?.friend) {
      setFriend(state.friend);
      // 加载与该好友的聊天记录
      loadChatHistory(state.friend.id);
    } else {
      navigate('/social');
    }
  }, [location, navigate]);

  // 获取AI问候语
  const fetchAIGreeting = async (userId: number) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/ai/greeting/${userId}`);
      if (response.data.success) {
        const greeting = response.data.data.message;
        setMessages([{
          role: 'assistant',
          content: greeting,
          timestamp: new Date().toISOString()
        }]);
        
        // 获取兴趣爱好收集的推荐问题
        fetchSuggestedQuestions(userId);
      }
    } catch (error) {
      console.error('获取AI问候语失败:', error);
      Toast.show({
        content: '无法获取AI问候，请稍后再试',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 获取推荐问题
  const fetchSuggestedQuestions = async (userId: number, currentInterests: UserInterest[] = []) => {
    try {
      const response = await axios.post('/api/ai/interest-questions', {
        user_id: userId,
        current_interests: currentInterests
      });
      
      if (response.data.success) {
        setSuggestedQuestions(response.data.data.questions);
      }
    } catch (error) {
      console.error('获取推荐问题失败:', error);
    }
  };

  // 获取聊天历史记录列表
  const fetchChatHistories = async (userId: number) => {
    try {
      const response = await axios.get(`/api/chat/history/user/${userId}`);
      if (response.data.success) {
        setChatHistories(response.data.data);
      }
    } catch (error) {
      console.error('获取聊天历史记录失败:', error);
    }
  };

  // 加载特定的聊天历史记录
  const loadChatHistory = async (friendId: number) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/chat/history/${friendId}`);
      if (response.data.success) {
        setMessages(response.data.data.messages);
        setCurrentHistoryId(friendId);
        setIsNewChat(false);
        setShowHistories(false);
      }
    } catch (error) {
      console.error('加载聊天历史记录失败:', error);
      Toast.show({
        content: '无法加载聊天历史记录',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 创建新的聊天
  const startNewChat = () => {
    setMessages([]);
    setCurrentHistoryId(null);
    setIsNewChat(true);
    setShowHistories(false);
    
    if (userId) {
      fetchAIGreeting(userId);
    }
  };

  // 发送消息
  const sendMessage = async () => {
    if (!messageInput.trim() || isLoading || !userId) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageInput,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setMessageInput('');
    setIsLoading(true);

    try {
      // 这里应该是真实的AI服务调用
      // 示例中使用简单的回复
      let aiResponseContent = '我正在处理您的请求...';
      
      // 等待1秒模拟AI处理时间
      setTimeout(async () => {
        // 简化的AI回复逻辑
        const genericResponses = [
          '谢谢您的回复！我很高兴能与您交流。',
          '感谢您的消息。请问还有什么我可以帮助您的吗？',
          '我理解您的意思了。我们可以继续讨论这个话题，或者您想聊些别的？',
          '我很期待更多地了解您的想法。请继续分享吧！'
        ];
        
        aiResponseContent = genericResponses[Math.floor(Math.random() * genericResponses.length)];
        
        // 添加AI回复
        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: aiResponseContent,
          timestamp: new Date().toISOString()
        };
        
        const newMessages = [...updatedMessages, aiMessage];
        setMessages(newMessages);
        
        // 保存聊天历史
        if (isNewChat && userId) {
          // 创建新的聊天历史
          const saveResponse = await axios.post('/api/chat/history', {
            user_id: userId,
            messages: newMessages,
            title: `与AI助手的对话 - ${new Date().toLocaleString()}`
          });
          
          if (saveResponse.data.success) {
            setCurrentHistoryId(saveResponse.data.data.id);
            setIsNewChat(false);
            // 刷新历史记录列表
            fetchChatHistories(userId);
          }
        } else if (currentHistoryId && userId) {
          // 更新现有聊天历史
          await axios.put(`/api/chat/history/${currentHistoryId}`, {
            user_id: userId,
            messages: newMessages
          });
          
          // 刷新历史记录列表
          fetchChatHistories(userId);
        }
        
        setIsLoading(false);
        
        // 自动滚动到最新消息
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
        
        // 检查是否应该显示兴趣标签弹窗
        if (InterestCollector.shouldShowInterestDialog()) {
          setShowInterestDialog(true);
        }
      }, 1000);
    } catch (error) {
      console.error('发送消息失败:', error);
      setIsLoading(false);
      Toast.show({
        content: '发送消息失败，请稍后再试',
      });
    }
  };

  // 删除聊天历史记录
  const deleteChatHistory = async (historyId: number) => {
    try {
      const response = await axios.delete(`/api/chat/history/${historyId}`);
      if (response.data.success) {
        // 如果删除的是当前聊天，则清空消息
        if (currentHistoryId === historyId) {
          startNewChat();
        }
        
        // 刷新历史记录列表
        if (userId) {
          fetchChatHistories(userId);
        }
        
        Toast.show({
          content: '聊天记录已删除',
        });
      }
    } catch (error) {
      console.error('删除聊天历史记录失败:', error);
      Toast.show({
        content: '删除失败，请稍后再试',
      });
    }
  };

  // 使用建议问题作为输入
  const useSuggestedQuestion = (question: string) => {
    setMessageInput(question);
  };

  // 滚动到底部
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // 渲染消息
  const renderMessages = () => {
    return messages.map((msg, index) => (
      <div key={index} className={`${styles.messageItem} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
        <div className={styles.messageAvatar}>
          {msg.role === 'user' ? (
            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          ) : (
            <Avatar src="/ai-avatar.png" />
          )}
        </div>
        <div className={styles.messageContent}>
          <div className={styles.messageText}>{msg.content}</div>
          <div className={styles.messageTime}>
            {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          </div>
        </div>
      </div>
    ));
  };

  // 渲染历史记录列表
  const renderChatHistories = () => {
    return (
      <div className={styles.historiesContainer}>
        <NavBar
          back={null}
          right={<Button size='small' color='primary' onClick={startNewChat}>新对话</Button>}
          onBack={() => setShowHistories(false)}
        >
          聊天记录
        </NavBar>
        <div className={styles.historiesList}>
          {chatHistories.length > 0 ? (
            <List>
              {chatHistories.map(history => (
                <SwipeAction
                  key={history.id}
                  rightActions={[
                    {
                      key: 'delete',
                      text: '删除',
                      color: 'danger',
                      onClick: () => deleteChatHistory(history.id)
                    }
                  ]}
                >
                  <List.Item
                    onClick={() => loadChatHistory(history.id)}
                    description={new Date(history.created_at).toLocaleString()}
                    arrow={<RightOutline />}
                  >
                    {history.title}
                  </List.Item>
                </SwipeAction>
              ))}
            </List>
          ) : (
            <Empty description="暂无聊天记录" />
          )}
        </div>
      </div>
    );
  };

  // 处理手动添加兴趣标签
  const handleAddTags = () => {
    setShowInterestDialog(false);
    // 这里可以添加跳转到标签添加页面的逻辑
    Toast.show({
      content: '即将上线，敬请期待',
    });
  };
  
  // 处理导入兴趣到个人资料
  const handleImportToProfile = () => {
    setShowInterestDialog(false);
    // 这里可以添加导入到个人资料的逻辑
    Toast.show({
      content: '兴趣标签已导入到个人资料',
    });
  };

  return (
    <div className={styles.container}>
      {/* 导航栏 */}
      <NavBar
        back={<LeftOutline />}
        onBack={() => navigate(-1)}
        right={
          <Button
            size='small'
            onClick={() => setShowHistories(true)}
          >
            历史
          </Button>
        }
      >
        AI助手
      </NavBar>
      
      {/* 聊天历史记录 */}
      {showHistories && renderChatHistories()}
      
      {/* 聊天区域 */}
      {!showHistories && (
        <>
          {/* 消息列表 */}
          <div className={styles.messageList} ref={messageListRef}>
            {renderMessages()}
            {isLoading && (
              <div className={styles.loading}>
                <div className={styles.loadingDot}></div>
                <div className={styles.loadingDot}></div>
                <div className={styles.loadingDot}></div>
              </div>
            )}
          </div>
          
          {/* 建议问题区域 */}
          {suggestedQuestions.length > 0 && (
            <div className={styles.suggestedQuestions}>
              <Space wrap>
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    size='mini'
                    onClick={() => useSuggestedQuestion(question)}
                    className={styles.suggestedQuestion}
                  >
                    {question}
                  </Button>
                ))}
              </Space>
            </div>
          )}
          
          {/* 输入区域 */}
          <div className={styles.inputArea}>
            <Input
              placeholder="输入消息..."
              value={messageInput}
              onChange={setMessageInput}
              className={styles.input}
            />
            <Button
              color='primary'
              disabled={!messageInput.trim() || isLoading}
              onClick={sendMessage}
              className={styles.sendButton}
            >
              发送
            </Button>
          </div>
        </>
      )}
      
      {/* 添加兴趣标签弹窗 */}
      <InterestDialog
        visible={showInterestDialog}
        interests={InterestCollector.getInterests()}
        onClose={() => setShowInterestDialog(false)}
        onAddTags={handleAddTags}
        onImportToProfile={handleImportToProfile}
      />
    </div>
  );
};

export default Chat; 