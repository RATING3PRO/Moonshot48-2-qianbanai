import React, { useState, useEffect } from 'react';
import { Tabs, List, Avatar, Button, Badge, Toast, Space, Tag, Dialog } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  TeamOutline, 
  AddOutline,
  MessageOutline,
  UserAddOutline,
  RightOutline,
} from 'antd-mobile-icons';
import './Social.css';

const Social: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('friends');

  useEffect(() => {
    const state = location.state as { activeTab?: string };
    if (state?.activeTab) {
      setActiveTab(state.activeTab);
    }
  }, [location]);

  // 模拟数据
  const friends = [
    { id: 1, name: '张三', avatar: '', online: true, lastSeen: '刚刚在线', tags: ['太极', '下棋'] },
    { id: 2, name: '李四', avatar: '', online: false, lastSeen: '1小时前在线', tags: ['广场舞', '种花'] },
    { id: 3, name: '王五', avatar: '', online: true, lastSeen: '刚刚在线', tags: ['钓鱼', '养鸟'] },
  ];

  const groups = [
    { 
      id: 1, 
      name: '健康交流群', 
      avatar: '', 
      memberCount: 128, 
      lastMessage: '今天天气不错，适合运动',
      tags: ['健康', '运动'],
      notice: '欢迎大家分享健康知识和运动经验',
    },
    { 
      id: 2, 
      name: '养生交流群', 
      avatar: '', 
      memberCount: 56, 
      lastMessage: '分享一个养生小妙招',
      tags: ['养生', '保健'],
      notice: '每天分享养生知识，互相交流保健经验',
    },
    { 
      id: 3, 
      name: '老年活动群', 
      avatar: '', 
      memberCount: 89, 
      lastMessage: '明天公园见！',
      tags: ['活动', '交友'],
      notice: '组织各类老年活动，结交新朋友',
    },
  ];

  const handleAddFriend = () => {
    Dialog.show({
      title: '添加好友',
      content: (
        <div>
          <p>请输入好友的手机号或ID：</p>
          <input type="text" placeholder="手机号/ID" style={{ width: '100%', padding: '8px' }} />
        </div>
      ),
      closeOnAction: true,
      actions: [
        {
          key: 'cancel',
          text: '取消',
        },
        {
          key: 'confirm',
          text: '确认',
          bold: true,
          onClick: () => {
            Toast.show({
              content: '好友请求已发送',
              position: 'bottom',
            });
          },
        },
      ],
    });
  };

  const handleCreateGroup = () => {
    Dialog.show({
      title: '创建群组',
      content: (
        <div>
          <p>群组名称：</p>
          <input type="text" placeholder="请输入群组名称" style={{ width: '100%', padding: '8px', marginBottom: '12px' }} />
          <p>群组简介：</p>
          <textarea placeholder="请输入群组简介" style={{ width: '100%', padding: '8px', height: '80px' }} />
        </div>
      ),
      closeOnAction: true,
      actions: [
        {
          key: 'cancel',
          text: '取消',
        },
        {
          key: 'confirm',
          text: '创建',
          bold: true,
          onClick: () => {
            Toast.show({
              content: '群组创建成功',
              position: 'bottom',
            });
          },
        },
      ],
    });
  };

  const handleViewGroupDetail = (group: any) => {
    Dialog.show({
      title: group.name,
      content: (
        <div className="group-detail">
          <div className="group-info">
            <Avatar src={group.avatar || 'https://via.placeholder.com/60'} style={{ '--size': '60px' }} />
            <div className="group-stats">
              <div>成员数：{group.memberCount}</div>
              <div className="group-tags">
                {group.tags.map((tag: string) => (
                  <Tag key={tag} color="primary" fill="outline">{tag}</Tag>
                ))}
              </div>
            </div>
          </div>
          <div className="group-notice">
            <h4>群公告</h4>
            <p>{group.notice}</p>
          </div>
        </div>
      ),
      closeOnAction: true,
      actions: [
        {
          key: 'cancel',
          text: '关闭',
        },
        {
          key: 'join',
          text: '加入群组',
          bold: true,
          onClick: () => {
            Toast.show({
              content: '已申请加入群组',
              position: 'bottom',
            });
          },
        },
      ],
    });
  };

  const handleStartChat = (friend: any) => {
    navigate('/chat', { 
      state: { 
        friend: {
          id: friend.id,
          name: friend.name,
          avatar: friend.avatar,
          online: friend.online
        }
      }
    });
  };

  return (
    <div className="social-container">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.Tab title="我的好友" key="friends">
          <div className="action-bar">
            <Button 
              onClick={handleAddFriend}
              size="small"
              color="primary"
              fill="outline"
            >
              <Space>
                <UserAddOutline />
                <span>添加好友</span>
              </Space>
            </Button>
          </div>
          <List>
            {friends.map(friend => (
              <List.Item
                key={friend.id}
                prefix={
                  <Badge
                    color={friend.online ? 'green' : 'grey'}
                    content=""
                    style={{
                      '--right': '5px',
                      '--top': '5px',
                    }}
                  >
                    <Avatar src={friend.avatar || 'https://via.placeholder.com/40'} />
                  </Badge>
                }
                description={
                  <div>
                    <div>{friend.lastSeen}</div>
                    <div className="friend-tags">
                      {friend.tags.map(tag => (
                        <Tag key={tag} color="primary" fill="outline" style={{ marginRight: '4px' }}>
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>
                }
                arrow={<MessageOutline />}
                onClick={() => handleStartChat(friend)}
              >
                {friend.name}
              </List.Item>
            ))}
          </List>
        </Tabs.Tab>

        <Tabs.Tab title="我的群组" key="groups">
          <div className="action-bar">
            <Button
              onClick={handleCreateGroup}
              size="small"
              color="primary"
              fill="outline"
            >
              <Space>
                <AddOutline />
                <span>创建群组</span>
              </Space>
            </Button>
          </div>
          <List>
            {groups.map(group => (
              <List.Item
                key={group.id}
                prefix={
                  <Avatar src={group.avatar || 'https://via.placeholder.com/40'} />
                }
                description={
                  <div>
                    <div>{group.memberCount}人 · {group.lastMessage}</div>
                    <div className="group-tags">
                      {group.tags.map(tag => (
                        <Tag key={tag} color="primary" fill="outline" style={{ marginRight: '4px' }}>
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>
                }
                arrow={<RightOutline />}
                onClick={() => handleViewGroupDetail(group)}
              >
                {group.name}
              </List.Item>
            ))}
          </List>
        </Tabs.Tab>
      </Tabs>
    </div>
  );
};

export default Social; 