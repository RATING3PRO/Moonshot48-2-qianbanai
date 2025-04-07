import React, { useState, useEffect, useRef } from 'react';
import { NavBar, List, Avatar, Badge, Input, Button, Space, Toast, Image, Popup, Empty, Dialog, Loading } from 'antd-mobile';
import { useParams, useNavigate } from 'react-router-dom';
import { GroupChatService, ChatMessage, Group as GroupType, GroupMember } from '../services/groupChat';

// 图片消息组件
const ImageMessage: React.FC<{ url: string }> = ({ url }) => (
  <div className="image-message">
    <Image src={url} fit="contain" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }} />
  </div>
);

// 图标组件
const SendIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>;
const PhotoIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>;
const MicIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>;
const MembersIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
const InfoIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>;

// 模拟当前用户ID
const CURRENT_USER_ID = "current-user-123";

const GroupChat: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // 图片上传相关状态
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  // 群组相关状态
  const [groupInfo, setGroupInfo] = useState<GroupType | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showMembersPopup, setShowMembersPopup] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);

  // 初始化群聊数据
  useEffect(() => {
    if (!groupId) return;
    
    const initGroupChat = async () => {
      try {
        setLoading(true);
        
        // 加载群组信息（这里需要模拟一下，实际项目中应该从后端API获取）
        const mockGroup: GroupType = {
          id: parseInt(groupId),
          name: `群组 ${groupId}`,
          description: "这是一个群组描述",
          created_by: "admin-user-id",
          avatar_url: `https://via.placeholder.com/100?text=Group${groupId}`
        };
        setGroupInfo(mockGroup);
        
        // 加载最近的消息
        await loadMessages();
        
        // 加载群组成员
        await loadGroupMembers();
        
        // 订阅实时消息
        const subscription = GroupChatService.subscribeToMessages(
          parseInt(groupId),
          (newMessage) => {
            // 避免重复添加自己发送的消息
            if (newMessage.user_id !== CURRENT_USER_ID) {
              setMessages(prev => [newMessage, ...prev]);
            }
          }
        );
        
        // 组件卸载时取消订阅
        return () => {
          if (subscription) {
            subscription.unsubscribe();
          }
        };
      } catch (error) {
        console.error('初始化群聊失败:', error);
        Toast.show({
          content: '加载群聊失败，请重试',
          duration: 2000,
        });
      } finally {
        setLoading(false);
      }
    };
    
    initGroupChat();
  }, [groupId]);
  
  // 加载群组消息
  const loadMessages = async (loadMore = false) => {
    if (!groupId) return;
    
    try {
      if (loadMore) {
        setLoadingMore(true);
      }
      
      const oldestMessageId = loadMore && messages.length > 0 
        ? Math.min(...messages.map(m => m.id || 0)) 
        : undefined;
      
      // 模拟从API获取消息
      // 实际项目中应该使用：
      // const chatMessages = await GroupChatService.getGroupMessages(parseInt(groupId), 20, oldestMessageId);
      
      // 模拟消息数据
      const mockMessages: ChatMessage[] = Array.from({ length: 10 }, (_, i) => {
        const isCurrentUser = Math.random() > 0.7;
        const hasImage = Math.random() > 0.8;
        const messageId = (oldestMessageId || 1000) - i - 1;
        
        return {
          id: messageId,
          group_id: parseInt(groupId),
          user_id: isCurrentUser ? CURRENT_USER_ID : `user-${Math.floor(Math.random() * 10)}`,
          content: hasImage ? '图片消息' : `这是消息 #${messageId}`,
          image_url: hasImage ? `https://picsum.photos/200/200?random=${messageId}` : undefined,
          created_at: new Date(Date.now() - i * 600000).toISOString(),
          user: {
            full_name: isCurrentUser ? '我' : `用户${Math.floor(Math.random() * 10)}`,
            avatar_url: `https://via.placeholder.com/40?text=${isCurrentUser ? 'Me' : 'U' + Math.floor(Math.random() * 10)}`
          }
        };
      });
      
      if (loadMore) {
        setMessages(prev => [...prev, ...mockMessages]);
        // 模拟是否还有更多消息
        setHasMore(mockMessages.length === 10);
      } else {
        setMessages(mockMessages);
      }
    } catch (error) {
      console.error('加载消息失败:', error);
      Toast.show({
        content: '加载消息失败',
        duration: 1500,
      });
    } finally {
      if (loadMore) {
        setLoadingMore(false);
      }
    }
  };
  
  // 加载群组成员
  const loadGroupMembers = async () => {
    if (!groupId) return;
    
    try {
      // 模拟从API获取成员
      // 实际项目中应该使用：
      // const members = await GroupChatService.getGroupMembers(parseInt(groupId));
      
      // 模拟成员数据
      const mockMembers: GroupMember[] = Array.from({ length: 15 }, (_, i) => {
        const isAdmin = i === 0;
        const isCurrentUser = i === 1;
        
        return {
          id: i + 1,
          group_id: parseInt(groupId),
          user_id: isCurrentUser ? CURRENT_USER_ID : `user-${i}`,
          role: isAdmin ? 'admin' : 'member',
          joined_at: new Date(Date.now() - i * 86400000).toISOString(),
          user: {
            id: isCurrentUser ? CURRENT_USER_ID : `user-${i}`,
            full_name: isCurrentUser ? '我' : `用户${i}`,
            avatar_url: `https://via.placeholder.com/40?text=${isCurrentUser ? 'Me' : 'U' + i}`
          }
        };
      });
      
      setGroupMembers(mockMembers);
    } catch (error) {
      console.error('加载群组成员失败:', error);
    }
  };
  
  // 发送消息
  const sendMessage = async () => {
    if (!inputText.trim() || !groupId) return;
    
    try {
      // 创建消息对象
      const messageData: ChatMessage = {
        group_id: parseInt(groupId),
        user_id: CURRENT_USER_ID,
        content: inputText.trim(),
        created_at: new Date().toISOString(),
        user: {
          full_name: '我',
          avatar_url: `https://via.placeholder.com/40?text=Me`
        }
      };
      
      // 在UI中立即显示消息
      setMessages(prev => [messageData, ...prev]);
    setInputText('');
    
    // 自动滚动到底部
      scrollToBottom();
      
      // 实际项目中应该调用API发送消息
      // await GroupChatService.sendMessage(messageData);
      
      // 模拟发送延迟
    setTimeout(() => {
        // 如果是实际API，这里应该更新UI中的消息状态（已发送）
        console.log('消息已发送:', messageData);
      }, 500);
    } catch (error) {
      console.error('发送消息失败:', error);
      Toast.show({
        content: '发送失败，请重试',
        duration: 1500,
      });
    }
  };
  
  // 处理图片选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // 创建预览URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setShowUploadPopup(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // 发送图片
  const sendImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        setImageFile(file);
        
        // 创建预览URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
          setShowUploadPopup(true);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // 确认发送图片
  const handleSendImage = async () => {
    if (!imageFile || !previewUrl || !groupId) return;

    try {
      // 创建图片消息
      const messageData: ChatMessage = {
        group_id: parseInt(groupId),
        user_id: CURRENT_USER_ID,
        content: '图片消息',
        image_url: previewUrl,
        created_at: new Date().toISOString(),
        user: {
          full_name: '我',
          avatar_url: `https://via.placeholder.com/40?text=Me`
        }
      };
      
      // 在UI中立即显示消息
      setMessages(prev => [messageData, ...prev]);
    
    // 重置状态
    setImageFile(null);
    setPreviewUrl('');
    setShowUploadPopup(false);
    
    // 自动滚动到底部
      scrollToBottom();
      
      // 实际项目中应该上传图片并发送消息
      // await GroupChatService.uploadImageMessage(parseInt(groupId), CURRENT_USER_ID, imageFile);
      
      // 模拟上传延迟
    setTimeout(() => {
        // 如果是实际API，这里应该更新UI中的消息状态（已上传）
        console.log('图片已上传:', messageData);
      }, 1000);
    } catch (error) {
      console.error('发送图片失败:', error);
      Toast.show({
        content: '图片发送失败',
        duration: 1500,
      });
    }
  };
  
  // 语音输入
  const startVoiceInput = () => {
    Toast.show({
      content: '语音输入功能即将上线',
      duration: 1500,
    });
  };
  
  // 加载更多消息
  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    loadMessages(true);
  };
  
  // 自动滚动到底部
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  };
  
  // 格式化时间
  const getSafeString = (value: string | undefined): string => {
    return value || '';
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMinutes < 1) {
      return '刚刚';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
  };
  
  // 退出群组
  const handleLeaveGroup = () => {
    Dialog.confirm({
      content: '确定要退出该群组吗？',
      onConfirm: async () => {
        try {
          // 实际项目中应该调用API
          // await GroupChatService.removeMember(parseInt(groupId!), CURRENT_USER_ID);
          
          Toast.show({
            content: '已退出群组',
            duration: 1500,
          });
          
          navigate('/groups');
        } catch (error) {
          console.error('退出群组失败:', error);
          Toast.show({
            content: '退出失败，请重试',
            duration: 1500,
          });
        }
      },
    });
  };

  return (
    <div className="group-chat-page">
      <NavBar 
        onBack={() => navigate('/groups')}
        right={
          <Space>
            <Button
              onClick={() => setShowGroupInfo(true)}
              style={{ 
                backgroundColor: 'transparent', 
                border: 'none',
                padding: '4px'
              }}
            >
              <InfoIcon />
            </Button>
            <Button
              onClick={() => setShowMembersPopup(true)}
              style={{ 
                backgroundColor: 'transparent', 
                border: 'none',
                padding: '4px'
              }}
            >
              <MembersIcon />
            </Button>
          </Space>
        }
      >
        {groupInfo ? groupInfo.name : '群聊'}
      </NavBar>
      
      {loading ? (
        <div className="loading-container">
          <Loading color='primary' />
          <span>加载中...</span>
        </div>
      ) : (
        <>
          {/* 聊天消息区域 */}
          <div 
            className="chat-messages" 
            ref={chatContainerRef}
            style={{
              height: 'calc(100vh - 110px)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column-reverse',
              padding: '10px'
            }}
          >
            {messages.length === 0 ? (
              <Empty
                description="暂无消息，快来发送第一条消息吧！"
                style={{ margin: '40px 0' }}
              />
            ) : (
              <>
                {/* 加载更多按钮 */}
                {hasMore && (
                  <div className="load-more" style={{ textAlign: 'center', padding: '10px 0' }}>
                    <Button
                      onClick={handleLoadMore}
                      loading={loadingMore}
                      disabled={loadingMore}
                      style={{ 
                        fontSize: '14px',
                        padding: '4px 12px',
                        height: 'auto'
                      }}
                    >
                      {loadingMore ? '加载中...' : '加载更多'}
            </Button>
          </div>
                )}
                
                {/* 消息列表 */}
                {messages.map((message, index) => {
                  const isCurrentUser = message.user_id === CURRENT_USER_ID;
                  
                  return (
                    <div 
                      key={message.id || index}
                      className={`message-item ${isCurrentUser ? 'message-mine' : 'message-others'}`}
                      style={{
                        display: 'flex',
                        flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                        marginBottom: '16px',
                        alignItems: 'flex-start'
                      }}
                    >
                      <Avatar 
                        src={getSafeString(message.user?.avatar_url)}
                        style={{ margin: isCurrentUser ? '0 0 0 8px' : '0 8px 0 0' }}
                      />
                
                <div className="message-content">
                        {!isCurrentUser && (
                          <div className="sender-name" style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                            {message.user?.full_name}
                          </div>
                        )}
                        
                        <div 
                          className="message-bubble"
                          style={{
                            backgroundColor: isCurrentUser ? '#1677ff' : '#f5f5f5',
                            color: isCurrentUser ? '#fff' : '#333',
                            borderRadius: '12px',
                            padding: '8px 12px',
                            maxWidth: '70%',
                            wordBreak: 'break-word',
                            display: 'inline-block'
                          }}
                        >
                          {message.image_url ? (
                            <ImageMessage url={message.image_url} />
                          ) : (
                            message.content
                    )}
                  </div>
                  
                        <div className="message-time" style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                          {message.created_at && formatTime(message.created_at)}
                        </div>
                      </div>
                </div>
                  );
                })}
              </>
            )}
          </div>
          
          {/* 消息输入区域 */}
          <div 
            className="message-input-area"
            style={{
              padding: '10px',
              borderTop: '1px solid #eee',
              backgroundColor: '#fff',
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Button
              style={{ 
                backgroundColor: 'transparent', 
                border: 'none',
                padding: '8px'
              }}
              onClick={startVoiceInput}
            >
              <MicIcon />
            </Button>
            
            <Input
              placeholder="输入消息..."
              value={inputText}
              onChange={setInputText}
              style={{ flex: 1, margin: '0 8px' }}
            />
            
            <Button
              style={{ 
                backgroundColor: 'transparent', 
                border: 'none',
                padding: '8px'
              }}
              onClick={sendImage}
            >
                <PhotoIcon />
              </Button>
            
            <Button
              style={{ 
                backgroundColor: '#1677ff', 
                color: '#fff',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={sendMessage}
              disabled={!inputText.trim()}
            >
                <SendIcon />
              </Button>
          </div>
          
          {/* 群组成员弹窗 */}
          <Popup
            visible={showMembersPopup}
            onMaskClick={() => setShowMembersPopup(false)}
            position="right"
            bodyStyle={{ width: '80vw', height: '100vh' }}
          >
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <NavBar onBack={() => setShowMembersPopup(false)}>
                群成员 ({groupMembers.length})
              </NavBar>
              
              <List style={{ flex: 1, overflowY: 'auto' }}>
                {groupMembers.map(member => (
                  <List.Item
                    key={member.id}
                    prefix={<Avatar src={getSafeString(member.user?.avatar_url)} />}
                    extra={member.role === 'admin' ? <Badge content="管理员" /> : null}
                  >
                    {member.user?.full_name}
                    {member.user_id === CURRENT_USER_ID && ' (我)'}
                  </List.Item>
                ))}
              </List>
            </div>
          </Popup>
          
          {/* 群组信息弹窗 */}
          <Popup
            visible={showGroupInfo}
            onMaskClick={() => setShowGroupInfo(false)}
            position="bottom"
            bodyStyle={{ 
              borderTopLeftRadius: '8px', 
              borderTopRightRadius: '8px',
              minHeight: '40vh'
            }}
          >
            <div style={{ padding: '20px' }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <Avatar src={getSafeString(groupInfo?.avatar_url)} style={{ width: '64px', height: '64px' }} />
                <h3 style={{ margin: '10px 0 5px' }}>{groupInfo?.name}</h3>
                <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                  {groupMembers.length}人 | 创建于 2023年4月
                </p>
              </div>
              
              <List>
                <List.Item>群组介绍</List.Item>
                <div style={{ padding: '0 12px 16px', color: '#666' }}>
                  {groupInfo?.description || '暂无群组介绍'}
                </div>
                
                <List.Item
                  onClick={() => {
                    setShowGroupInfo(false);
                    setShowMembersPopup(true);
                  }}
                  arrow
                >
                  查看全部成员
                </List.Item>
                
                <List.Item
                  onClick={handleLeaveGroup}
                  style={{ color: 'red' }}
                >
                  退出群组
                </List.Item>
              </List>
        </div>
          </Popup>
        </>
      )}
      
      {/* 图片上传预览弹窗 */}
      <Popup
        visible={showUploadPopup}
        onMaskClick={() => setShowUploadPopup(false)}
        bodyStyle={{ 
          borderRadius: '8px',
          padding: '20px',
          width: '80vw',
          maxWidth: '350px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 16px' }}>发送这张图片？</h4>
          
          {previewUrl && (
            <Image 
              src={getSafeString(previewUrl)} 
              fit="contain"
              style={{ 
                maxWidth: '100%', 
                maxHeight: '250px',
                marginBottom: '16px',
                borderRadius: '8px'
              }}
            />
          )}
          
          <Space style={{ marginTop: '10px' }}>
            <Button
              onClick={() => setShowUploadPopup(false)}
              style={{ 
                flex: 1,
                backgroundColor: '#f5f5f5',
                color: '#333'
              }}
            >
              取消
            </Button>
            <Button
              onClick={handleSendImage}
              color="primary"
              style={{ flex: 1 }}
            >
              发送
            </Button>
          </Space>
        </div>
      </Popup>
    </div>
  );
};

export default GroupChat;