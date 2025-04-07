import React, { useState, useEffect, useRef } from 'react';
import { 
  NavBar, Avatar, Input, Button, Toast, 
  Space, Popover, Dialog, List, Image, Empty
} from 'antd-mobile';
import { LeftOutline, SmileOutline, PictureOutline, SoundOutline, MoreOutline } from 'antd-mobile-icons';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './PrivateChat.module.css';

// 消息类型定义
interface ChatMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  type: 'text' | 'image' | 'voice';
  read: boolean;
  created_at: string;
}

// 好友信息
interface Friend {
  id: number;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen?: string;
}

const PrivateChat: React.FC = () => {
  const navigate = useNavigate();
  const { friendId } = useParams<{ friendId: string }>();
  const messageListRef = useRef<HTMLDivElement>(null);
  
  // 状态
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [friend, setFriend] = useState<Friend | null>(null);
  const [currentUser, setCurrentUser] = useState<{id: number, username: string, avatar: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // 初始化数据
  useEffect(() => {
    // 获取当前用户信息
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!storedUser) {
      Toast.show({
        content: '请先登录',
        afterClose: () => navigate('/login'),
      });
      return;
    }

    const user = JSON.parse(storedUser);
    setCurrentUser({
      id: user.id,
      username: user.username || user.profile?.display_name || '',
      avatar: user.profile?.avatar || 'https://via.placeholder.com/40'
    });

    if (friendId) {
      fetchFriendInfo(parseInt(friendId));
      fetchChatHistory(user.id, parseInt(friendId));
    }
  }, [friendId, navigate]);

  // 获取好友信息
  const fetchFriendInfo = async (id: number) => {
    try {
      const response = await axios.get(`/api/user/profile/${id}`);
      if (response.data.success) {
        const userData = response.data.data;
        setFriend({
          id: userData.id,
          username: userData.profile?.display_name || userData.username,
          avatar: userData.profile?.avatar || 'https://via.placeholder.com/40',
          status: userData.online_status || 'offline',
          lastSeen: userData.last_seen
        });
      } else {
        Toast.show({
          content: '获取用户信息失败',
        });
      }
    } catch (error) {
      console.error('获取好友信息失败:', error);
      Toast.show({
        content: '获取好友信息失败',
      });
    }
  };

  // 获取聊天历史
  const fetchChatHistory = async (userId: number, friendId: number) => {
    setIsLoading(true);
    try {
      // 实际场景中应该调用后端API
      // 这里使用模拟数据
      const mockMessages: ChatMessage[] = [
        {
          id: 1,
          sender_id: userId,
          receiver_id: friendId,
          content: '您好！',
          type: 'text',
          read: true,
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 2,
          sender_id: friendId,
          receiver_id: userId,
          content: '您好！请问有什么可以帮助您的吗？',
          type: 'text',
          read: true,
          created_at: new Date(Date.now() - 3500000).toISOString()
        },
        {
          id: 3,
          sender_id: userId,
          receiver_id: friendId,
          content: '我想了解一下社区最近的活动安排',
          type: 'text',
          read: true,
          created_at: new Date(Date.now() - 3400000).toISOString()
        },
        {
          id: 4,
          sender_id: friendId,
          receiver_id: userId,
          content: '好的，我们社区近期有几个活动：1. 本周六上午有太极拳教学 2. 下周二下午有手工艺品制作 3. 下周四有健康讲座。您对哪个感兴趣呢？',
          type: 'text',
          read: true,
          created_at: new Date(Date.now() - 3300000).toISOString()
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('获取聊天历史失败:', error);
      Toast.show({
        content: '获取聊天历史失败',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 发送消息
  const sendMessage = async () => {
    if (!messageInput.trim() || !currentUser || !friend) return;
    
    setIsSending(true);
    
    try {
      // 创建新消息对象
      const newMessage: ChatMessage = {
        id: Date.now(), // 临时ID
        sender_id: currentUser.id,
        receiver_id: friend.id,
        content: messageInput.trim(),
        type: 'text',
        read: false,
        created_at: new Date().toISOString()
      };
      
      // 将消息添加到列表
      setMessages([...messages, newMessage]);
      setMessageInput('');
      
      // 实际场景中应该调用后端API保存消息
      // 模拟服务器延迟
      setTimeout(() => {
        // 接收模拟回复
        if (Math.random() > 0.5) {
          const replyMessage: ChatMessage = {
            id: Date.now() + 1,
            sender_id: friend.id,
            receiver_id: currentUser.id,
            content: '收到您的消息，稍后回复您！',
            type: 'text',
            read: false,
            created_at: new Date().toISOString()
          };
          
          setMessages(prev => [...prev, replyMessage]);
        }
        
        setIsSending(false);
      }, 1000);
    } catch (error) {
      console.error('发送消息失败:', error);
      Toast.show({
        content: '发送消息失败',
      });
      setIsSending(false);
    }
  };

  // 滚动到底部
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // 渲染消息气泡
  const renderMessage = (message: ChatMessage) => {
    const isSelf = message.sender_id === currentUser?.id;
    
    return (
      <div 
        key={message.id} 
        className={`${styles.messageItem} ${isSelf ? styles.selfMessage : styles.otherMessage}`}
      >
        {!isSelf && (
          <Avatar 
            src={friend?.avatar || 'https://via.placeholder.com/40'} 
            className={styles.messageAvatar}
          />
        )}
        
        <div className={styles.messageContent}>
          <div className={styles.messageText}>
            {message.content}
          </div>
          <div className={styles.messageTime}>
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        {isSelf && (
          <Avatar 
            src={currentUser?.avatar || 'https://via.placeholder.com/40'} 
            className={styles.messageAvatar}
          />
        )}
      </div>
    );
  };

  // 更多选项菜单
  const moreActions = [
    { key: 'clear', text: '清空聊天记录' },
    { key: 'block', text: '屏蔽该好友' },
    { key: 'report', text: '举报' },
  ];

  // 处理更多选项菜单点击
  const handleMoreAction = (key: string) => {
    if (key === 'clear') {
      Dialog.confirm({
        content: '确定要清空所有聊天记录吗？',
        onConfirm: () => {
          setMessages([]);
          Toast.show({
            content: '聊天记录已清空',
          });
        },
      });
    } else if (key === 'block') {
      Dialog.confirm({
        content: '确定要屏蔽该好友吗？屏蔽后将不再收到对方的消息。',
        onConfirm: () => {
          Toast.show({
            content: '该好友已被屏蔽',
          });
        },
      });
    } else if (key === 'report') {
      Dialog.confirm({
        content: '确定要举报该好友吗？',
        onConfirm: () => {
          Toast.show({
            content: '举报已提交，我们会尽快处理',
          });
        },
      });
    }
  };

  return (
    <div className={styles.chatContainer}>
      <NavBar
        back={<LeftOutline />}
        onBack={() => navigate(-1)}
        right={
          <Popover.Menu
            actions={moreActions}
            onAction={item => handleMoreAction(item.key)}
            trigger="click"
          >
            <MoreOutline />
          </Popover.Menu>
        }
      >
        {friend ? (
          <div className={styles.navbarTitle}>
            <span>{friend.username}</span>
            <span className={styles.statusText}>
              {friend.status === 'online' ? '在线' : 
               friend.status === 'busy' ? '忙碌中' : 
               friend.lastSeen ? `${friend.lastSeen}前在线` : '离线'}
            </span>
          </div>
        ) : '加载中...'}
      </NavBar>
      
      <div className={styles.messageList} ref={messageListRef}>
        {isLoading ? (
          <div className={styles.loadingContainer}>加载中...</div>
        ) : messages.length === 0 ? (
          <Empty description="暂无消息" />
        ) : (
          messages.map(message => renderMessage(message))
        )}
      </div>
      
      <div className={styles.inputArea}>
        <div className={styles.inputButtons}>
          <SmileOutline className={styles.inputButton} />
          <PictureOutline className={styles.inputButton} />
          <SoundOutline className={styles.inputButton} />
        </div>
        <Input
          className={styles.messageInput}
          placeholder="请输入消息..."
          value={messageInput}
          onChange={val => setMessageInput(val)}
          onEnterPress={sendMessage}
        />
        <Button
          className={styles.sendButton}
          color="primary"
          disabled={!messageInput.trim() || isSending}
          onClick={sendMessage}
        >
          发送
        </Button>
      </div>
    </div>
  );
};

export default PrivateChat; 