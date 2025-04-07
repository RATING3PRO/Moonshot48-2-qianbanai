import React, { useState, useEffect, useRef } from 'react';
import { List, Avatar, Button, Dialog, Space, Toast, NavBar } from 'antd-mobile';
import { useNavigate, useParams } from 'react-router-dom';

// 图标组件
const CallIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="#52C41A"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>;
const VideoCallIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="#4F7DFE"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>;
const EndCallIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="#F5222D"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/></svg>;
const MicIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>;
const MicOffIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/></svg>;
const CameraIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>;
const CameraOffIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z"/></svg>;
const SwitchCameraIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 11.5V13H9v2.5L5.5 12 9 8.5V11h6V8.5l3.5 3.5-3.5 3.5z"/></svg>;

// 联系人类型定义
interface Contact {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen?: string;
}

const VideoCall: React.FC = () => {
  const navigate = useNavigate();
  const { friendId } = useParams();
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: "李大爷", avatar: "https://via.placeholder.com/40", status: 'online' },
    { id: 2, name: "王奶奶", avatar: "https://via.placeholder.com/40", status: 'offline', lastSeen: "1小时前" },
    { id: 3, name: "赵叔叔", avatar: "https://via.placeholder.com/40", status: 'online' },
    { id: 4, name: "刘姨", avatar: "https://via.placeholder.com/40", status: 'busy' },
    { id: 5, name: "张医生", avatar: "https://via.placeholder.com/40", status: 'online' },
  ]);
  
  const [inCall, setInCall] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [incomingCaller, setIncomingCaller] = useState<Contact | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef<number | null>(null);
  
  // 当指定好友ID时，自动加载好友信息
  useEffect(() => {
    if (friendId) {
      const friend = contacts.find(c => c.id === parseInt(friendId));
      if (friend) {
        // 模拟收到来电
        setIncomingCaller(friend);
        setShowIncomingCall(true);
      }
    }
  }, [friendId, contacts]);
  
  // 格式化通话时长
  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // 开始计时器
  const startCallTimer = () => {
    if (callTimerRef.current) {
      window.clearInterval(callTimerRef.current);
    }
    
    setCallDuration(0);
    callTimerRef.current = window.setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };
  
  // 停止计时器
  const stopCallTimer = () => {
    if (callTimerRef.current) {
      window.clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
  };
  
  // 组件卸载时清除计时器
  useEffect(() => {
    return () => {
      stopCallTimer();
    };
  }, []);
  
  // 开始视频通话
  const startVideoCall = (contact: Contact) => {
    setCurrentContact(contact);
    setIsConnecting(true);
    
    // 模拟连接
    Toast.show({
      content: `正在连接${contact.name}...`,
      duration: 1000,
    });
    
    // 模拟连接过程
    setTimeout(() => {
      setIsConnecting(false);
      setInCall(true);
      startCallTimer();
    }, 2000);
  };
  
  // 开始语音通话
  const startVoiceCall = (contact: Contact) => {
    setCurrentContact(contact);
    setIsConnecting(true);
    setCameraEnabled(false);
    
    Toast.show({
      content: `正在拨打${contact.name}...`,
      duration: 1000,
    });
    
    // 模拟连接过程
    setTimeout(() => {
      setIsConnecting(false);
      setInCall(true);
      startCallTimer();
    }, 2000);
  };
  
  // 结束通话
  const endCall = () => {
    Dialog.confirm({
      content: '确定要结束通话吗？',
      confirmText: '结束',
      cancelText: '取消',
      onConfirm: () => {
        stopCallTimer();
        setInCall(false);
        setCurrentContact(null);
        setIsConnecting(false);
        Toast.show({
          content: '通话已结束',
          duration: 1000,
        });
      },
    });
  };
  
  // 切换麦克风状态
  const toggleMic = () => {
    setMicEnabled(!micEnabled);
    Toast.show({
      content: micEnabled ? '麦克风已关闭' : '麦克风已开启',
      duration: 1000,
    });
  };
  
  // 切换摄像头状态
  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
    Toast.show({
      content: cameraEnabled ? '摄像头已关闭' : '摄像头已开启',
      duration: 1000,
    });
  };
  
  // 切换前后摄像头
  const switchCamera = () => {
    setIsFrontCamera(!isFrontCamera);
    Toast.show({
      content: isFrontCamera ? '已切换到后置摄像头' : '已切换到前置摄像头',
      duration: 1000,
    });
  };
  
  // 处理来电
  const handleIncomingCall = (accept: boolean) => {
    setShowIncomingCall(false);
    
    if (accept && incomingCaller) {
      setCurrentContact(incomingCaller);
      setIsConnecting(true);
      
      // 模拟连接
      setTimeout(() => {
        setIsConnecting(false);
        setInCall(true);
        startCallTimer();
      }, 1500);
    } else {
      Toast.show({
        content: '已拒绝通话',
        duration: 1000,
      });
    }
  };

  return (
    <div className="video-call-container">
      {/* 导航栏 */}
      <NavBar onBack={() => {
        if (inCall) {
          endCall();
        } else {
          navigate(-1);
        }
      }}>
        {inCall ? '通话中' : '视频通话'}
      </NavBar>
      
      {!inCall && !isConnecting && !showIncomingCall ? (
        // 联系人列表
        <>
          <div className="contacts-list">
            <List header="联系人">
              {contacts.map(contact => (
                <List.Item
                  key={contact.id}
                  prefix={
                    <div className="contact-avatar">
                      <Avatar src={contact.avatar} />
                      <span className={`status-indicator ${contact.status}`}></span>
                    </div>
                  }
                  description={
                    contact.status === 'online' ? '在线' : 
                    contact.status === 'busy' ? '忙碌中' : 
                    `上次在线: ${contact.lastSeen}`
                  }
                  extra={
                    <Space>
                      <Button
                        className="call-button"
                        onClick={() => startVoiceCall(contact)}
                        disabled={contact.status === 'offline'}
                      >
                        <CallIcon />
                      </Button>
                      <Button
                        className="video-call-button"
                        onClick={() => startVideoCall(contact)}
                        disabled={contact.status === 'offline'}
                      >
                        <VideoCallIcon />
                      </Button>
                    </Space>
                  }
                >
                  {contact.name}
                </List.Item>
              ))}
            </List>
          </div>
        </>
      ) : showIncomingCall && incomingCaller ? (
        // 来电提醒界面
        <div className="incoming-call">
          <div className="caller-info">
            <Avatar src={incomingCaller.avatar} style={{ '--size': '80px' } as React.CSSProperties} />
            <h2>{incomingCaller.name}</h2>
            <p className="call-status">来电中...</p>
            <div className="call-animation"></div>
          </div>
          <div className="incoming-call-actions">
            <Button 
              className="reject-button" 
              onClick={() => handleIncomingCall(false)}
            >
              <EndCallIcon />
              <span>拒绝</span>
            </Button>
            <Button 
              className="accept-button" 
              color="primary"
              onClick={() => handleIncomingCall(true)}
            >
              <CallIcon />
              <span>接听</span>
            </Button>
          </div>
        </div>
      ) : isConnecting && currentContact ? (
        // 连接中界面
        <div className="connecting-screen">
          <Avatar src={currentContact.avatar} style={{ '--size': '100px' } as React.CSSProperties} />
          <h2>{currentContact.name}</h2>
          <p className="connecting-text">正在连接...</p>
          <div className="connecting-animation">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <Button 
            className="cancel-button" 
            onClick={() => {
              setIsConnecting(false);
              setCurrentContact(null);
            }}
          >
            <EndCallIcon />
            <span>取消</span>
          </Button>
        </div>
      ) : (
        // 视频通话界面
        <div className="video-call-active">
          <div className="call-header">
            <h2>{currentContact?.name || ""}</h2>
            <p className="call-status">通话中 - {formatCallDuration(callDuration)}</p>
          </div>
          
          <div className="video-container">
            {/* 远程视频 */}
            <div className="remote-video">
              {cameraEnabled ? (
                <div className="video-placeholder remote">
                  <Avatar src={currentContact?.avatar || ""} style={{ '--size': '80px' } as React.CSSProperties} />
                </div>
              ) : (
                <div className="camera-off-message">
                  <CameraOffIcon />
                  <p>对方摄像头已关闭</p>
                </div>
              )}
            </div>
            
            {/* 本地视频 */}
            <div className="local-video">
              <div className={`video-placeholder self ${!cameraEnabled ? 'camera-off' : ''}`}>
                {cameraEnabled ? (
                  <div className="camera-mirrored">
                    <p className="local-label">您</p>
                  </div>
                ) : (
                  <div className="camera-off-local">
                    <CameraOffIcon />
                    <p>摄像头已关闭</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="call-controls">
            <Button className="control-button" onClick={toggleMic}>
              {micEnabled ? <MicIcon /> : <MicOffIcon />}
              <span>{micEnabled ? '关闭麦克风' : '开启麦克风'}</span>
            </Button>
            
            <Button className="control-button end-call" onClick={endCall}>
              <EndCallIcon />
              <span>结束通话</span>
            </Button>
            
            <Button className="control-button" onClick={toggleCamera}>
              {cameraEnabled ? <CameraIcon /> : <CameraOffIcon />}
              <span>{cameraEnabled ? '关闭摄像头' : '开启摄像头'}</span>
            </Button>
            
            {cameraEnabled && (
              <Button className="control-button" onClick={switchCamera}>
                <SwitchCameraIcon />
                <span>切换摄像头</span>
              </Button>
            )}
          </div>
        </div>
      )}
      
      <style>
        {`
        .video-call-container {
          padding: 0;
          height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: #f8f8f8;
        }
        
        .contacts-list {
          margin: var(--spacing-md);
          flex: 1;
        }
        
        .contact-avatar {
          position: relative;
        }
        
        .status-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid white;
        }
        
        .status-indicator.online {
          background-color: var(--success-color);
        }
        
        .status-indicator.offline {
          background-color: #999;
        }
        
        .status-indicator.busy {
          background-color: var(--warning-color);
        }
        
        .call-button, .video-call-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        
        .video-call-active {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 45px);
          background-color: #121212;
          color: white;
        }
        
        .call-header {
          text-align: center;
          padding: var(--spacing-md);
          z-index: 10;
        }
        
        .call-header h2 {
          margin: 0;
          color: white;
          font-size: 20px;
        }
        
        .call-status {
          margin: 4px 0 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .video-container {
          flex: 1;
          position: relative;
          background-color: #121212;
          overflow: hidden;
        }
        
        .remote-video {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #2a2a2a;
        }
        
        .local-video {
          position: absolute;
          top: var(--spacing-md);
          right: var(--spacing-md);
          width: 120px;
          height: 160px;
          background-color: #333;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .video-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        
        .video-placeholder.remote {
          background-color: #2a2a2a;
        }
        
        .video-placeholder.self {
          background-color: #3a3a3a;
          position: relative;
        }
        
        .camera-mirrored {
          width: 100%;
          height: 100%;
          background-color: #555;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          padding: 5px;
        }
        
        .local-label {
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 4px;
          margin: 0;
        }
        
        .camera-off-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          gap: 12px;
          text-align: center;
        }
        
        .camera-off-message svg, .camera-off-local svg {
          width: 40px;
          height: 40px;
          opacity: 0.7;
        }
        
        .camera-off-local {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: white;
          gap: 8px;
          font-size: 12px;
        }
        
        .camera-off-local svg {
          width: 24px;
          height: 24px;
        }
        
        .call-controls {
          display: flex;
          justify-content: center;
          gap: 16px;
          padding: var(--spacing-lg);
          background-color: #121212;
          z-index: 10;
        }
        
        .control-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-xs);
          background: #333;
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          color: white;
          padding: 0;
        }
        
        .control-button span {
          font-size: 10px;
          margin-top: 5px;
          white-space: nowrap;
          position: absolute;
          bottom: -20px;
        }
        
        .end-call {
          background-color: var(--error-color);
        }
        
        /* 连接中动画 */
        .connecting-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: calc(100vh - 45px);
          background-color: #121212;
          color: white;
          text-align: center;
          padding: var(--spacing-lg);
        }
        
        .connecting-text {
          margin: 8px 0 24px;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .connecting-animation {
          display: flex;
          gap: 8px;
          margin-bottom: 40px;
        }
        
        .connecting-animation span {
          display: inline-block;
          width: 12px;
          height: 12px;
          background-color: var(--primary-color);
          border-radius: 50%;
          animation: pulse 1.5s infinite ease-in-out;
        }
        
        .connecting-animation span:nth-child(2) {
          animation-delay: 0.3s;
        }
        
        .connecting-animation span:nth-child(3) {
          animation-delay: 0.6s;
        }
        
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
        
        .cancel-button {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          background-color: var(--error-color);
          color: white;
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          padding: 0;
        }
        
        .cancel-button span {
          font-size: 12px;
          margin-top: 4px;
        }
        
        /* 来电提醒界面 */
        .incoming-call {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          height: calc(100vh - 45px);
          background-color: #121212;
          color: white;
          padding: 60px var(--spacing-lg) 40px;
        }
        
        .caller-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .caller-info h2 {
          margin: 16px 0 8px;
          font-size: 24px;
        }
        
        .call-animation {
          width: 160px;
          height: 160px;
          border-radius: 50%;
          border: 2px solid var(--primary-color);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -80%);
          animation: ripple 2s infinite;
          z-index: -1;
        }
        
        @keyframes ripple {
          0% { width: 80px; height: 80px; opacity: 1; }
          100% { width: 200px; height: 200px; opacity: 0; }
        }
        
        .incoming-call-actions {
          display: flex;
          justify-content: center;
          gap: 40px;
          width: 100%;
        }
        
        .reject-button, .accept-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: none;
          padding: 0;
        }
        
        .reject-button {
          background-color: var(--error-color);
          color: white;
        }
        
        .reject-button span, .accept-button span {
          font-size: 12px;
          margin-top: 4px;
        }
        `}
      </style>
    </div>
  );
};

export default VideoCall;