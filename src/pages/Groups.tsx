import React, { useState } from 'react';
import { NavBar, Tabs, List, Image, Button, Badge, Tag, Card, Grid, Avatar, Dialog, Space, Divider, Toast, Input } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

// 图标组件
const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#999">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const MemberIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1677ff">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

const NoticeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1677ff">
    <path d="M10.01 21.01c0 1.1.89 1.99 1.99 1.99s1.99-.89 1.99-1.99h-3.98zm8.87-4.19V11c0-3.25-2.25-5.97-5.29-6.69v-.72C13.59 2.71 12.88 2 12 2s-1.59.71-1.59 1.59v.72C7.37 5.03 5.12 7.75 5.12 11v5.82L3 18.94V20h18v-1.06l-2.12-2.12zM16 13.01h-3v3h-2v-3H8V11h3V8h2v3h3v2.01z"/>
  </svg>
);

// 群组类型定义
interface Group {
  id: number;
  name: string;
  avatar: string;
  description: string;
  memberCount: number;
  activity: string;
  category: string;
  tags: string[];
  founder: {
    id: number;
    name: string;
    avatar: string;
  };
  isJoined?: boolean;
  announcement?: string;
  events?: {
    id: number;
    title: string;
    time: string;
    location: string;
  }[];
}

const GroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [searchValue, setSearchValue] = useState('');
  
  // 群组数据
  const [groups, setGroups] = useState<Group[]>([
    {
      id: 1,
      name: "健康养生交流群",
      avatar: "https://via.placeholder.com/100",
      description: "分享健康养生知识，交流保健经验，定期组织健康讲座和活动。",
      memberCount: 128,
      activity: "活跃",
      category: "健康",
      tags: ["养生", "健康饮食", "运动健身"],
      founder: {
        id: 101,
        name: "张医生",
        avatar: "https://via.placeholder.com/40"
      },
      isJoined: true,
      announcement: "本周六上午10点将在社区活动中心举办健康生活方式讲座，欢迎群友参加！",
      events: [
        {
          id: 1001,
          title: "健康生活方式讲座",
          time: "2025年4月13日 上午10:00",
          location: "社区活动中心一号厅"
        },
        {
          id: 1002,
          title: "太极拳交流会",
          time: "2025年4月20日 早上7:00",
          location: "社区公园东区广场"
        }
      ]
    },
    {
      id: 2,
      name: "每日晨练群",
      avatar: "https://via.placeholder.com/100",
      description: "志同道合的晨练爱好者交流群，每天早上6:30在社区公园集合晨练。",
      memberCount: 56,
      activity: "较活跃",
      category: "健康",
      tags: ["晨练", "健步走", "太极"],
      founder: {
        id: 102,
        name: "李师傅",
        avatar: "https://via.placeholder.com/40"
      },
      announcement: "从明天开始，晨练时间调整为6:00开始，请大家相互转告。"
    },
    {
      id: 3,
      name: "摄影爱好者",
      avatar: "https://via.placeholder.com/100",
      description: "分享摄影作品，交流摄影技巧，定期组织外出摄影活动。",
      memberCount: 89,
      activity: "活跃",
      category: "兴趣",
      tags: ["摄影", "艺术", "外出活动"],
      founder: {
        id: 103,
        name: "王摄影",
        avatar: "https://via.placeholder.com/40"
      },
      isJoined: true,
      events: [
        {
          id: 1003,
          title: "春季外拍活动",
          time: "2025年4月15日 上午9:00",
          location: "城市植物园"
        }
      ]
    },
    {
      id: 4,
      name: "棋牌娱乐群",
      avatar: "https://via.placeholder.com/100",
      description: "象棋、围棋、麻将爱好者交流群，每周末在社区棋牌室举行活动。",
      memberCount: 76,
      activity: "一般",
      category: "兴趣",
      tags: ["棋牌", "象棋", "麻将"],
      founder: {
        id: 104,
        name: "赵大爷",
        avatar: "https://via.placeholder.com/40"
      }
    },
    {
      id: 8,
      name: "邻里互助群",
      avatar: "https://via.placeholder.com/100",
      description: "邻里互相帮助，资源共享，增进邻里感情。",
      memberCount: 145,
      activity: "较活跃",
      category: "社区",
      tags: ["互助", "邻里关系", "资源共享"],
      founder: {
        id: 108,
        name: "周大姐",
        avatar: "https://via.placeholder.com/40"
      },
      isJoined: true
    },
    {
      id: 9,
      name: "社区老年合唱团",
      avatar: "https://via.placeholder.com/100",
      description: "社区老年合唱团交流群，分享歌曲，组织排练，参与社区文化活动演出。",
      memberCount: 42,
      activity: "活跃",
      category: "兴趣",
      tags: ["合唱", "音乐", "表演"],
      founder: {
        id: 109,
        name: "郑老师",
        avatar: "https://via.placeholder.com/40"
      },
      events: [
        {
          id: 1005,
          title: "社区文化节演出彩排",
          time: "2025年4月22日 下午3:00",
          location: "社区文化活动中心"
        }
      ]
    },
    {
      id: 10,
      name: "园艺植物交流群",
      avatar: "https://via.placeholder.com/100",
      description: "分享园艺知识，交流植物养护经验，组织种植活动和花卉展示。",
      memberCount: 65,
      activity: "一般",
      category: "兴趣",
      tags: ["园艺", "花卉", "植物"],
      founder: {
        id: 110,
        name: "张叔叔",
        avatar: "https://via.placeholder.com/40"
      },
      announcement: "本月底将举办小型花卉展览，欢迎群友带着自己养护的植物参展。"
    },
    {
      id: 12,
      name: "中老年健身群",
      avatar: "https://via.placeholder.com/100",
      description: "分享适合中老年人的健身方法，交流运动心得，组织集体健身活动。",
      memberCount: 94,
      activity: "活跃",
      category: "健康",
      tags: ["健身", "运动", "健康"],
      founder: {
        id: 112,
        name: "王教练",
        avatar: "https://via.placeholder.com/40"
      },
      events: [
        {
          id: 1007,
          title: "中老年健身舞教学",
          time: "每周一、三、五 晚上7:00",
          location: "社区文化广场"
        }
      ]
    },
    {
      id: 13,
      name: "社区安全防范群",
      avatar: "https://via.placeholder.com/100",
      description: "分享安全知识，通报社区安全情况，提高居民安全防范意识。",
      memberCount: 156,
      activity: "一般",
      category: "通知",
      tags: ["安全防范", "社区安全", "互助"],
      founder: {
        id: 113,
        name: "社区警务室",
        avatar: "https://via.placeholder.com/40"
      },
      announcement: "近期周边社区发生几起入室盗窃案件，请大家提高警惕，外出和晚上睡觉前务必锁好门窗。"
    },
    {
      id: 15,
      name: "家庭医疗互助群",
      avatar: "https://via.placeholder.com/100",
      description: "分享家庭医疗保健知识，解答常见健康问题，提供就医指导服务。",
      memberCount: 103,
      activity: "活跃",
      category: "健康",
      tags: ["家庭医疗", "健康咨询", "互助"],
      founder: {
        id: 115,
        name: "李医生",
        avatar: "https://via.placeholder.com/40"
      },
      announcement: "群内已整理常见慢性病用药指南和紧急就医指南，请查看群文件下载。",
      events: [
        {
          id: 1009,
          title: "家庭急救知识讲座",
          time: "2025年4月19日 上午10:00",
          location: "社区卫生服务中心"
        }
      ]
    }
  ]);
  
  // 过滤后的群组列表
  const filteredGroups = groups.filter(group => 
    group.name.includes(searchValue) || 
    group.description.includes(searchValue) ||
    group.tags.some(tag => tag.includes(searchValue))
  );
  
  // 打开群组详情
  const openGroupDetail = (group: Group) => {
    setSelectedGroup(group);
  };
  
  // 关闭群组详情
  const closeGroupDetail = () => {
    setSelectedGroup(null);
  };
  
  // 加入群组
  const joinGroup = (groupId: number) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId 
          ? { ...group, memberCount: group.memberCount + 1, isJoined: true }
          : group
      )
    );
    
    if (selectedGroup && selectedGroup.id === groupId) {
      setSelectedGroup({
        ...selectedGroup,
        memberCount: selectedGroup.memberCount + 1,
        isJoined: true
      });
    }
    
    Toast.show({
      content: '已加入群组！',
      position: 'bottom',
    });
  };
  
  // 退出群组
  const leaveGroup = (groupId: number) => {
    Dialog.confirm({
      content: '确定要退出该群组吗？',
      onConfirm: () => {
        setGroups(prevGroups => 
          prevGroups.map(group => 
            group.id === groupId 
              ? { ...group, memberCount: group.memberCount - 1, isJoined: false }
              : group
          )
        );
        
        if (selectedGroup && selectedGroup.id === groupId) {
          setSelectedGroup({
            ...selectedGroup,
            memberCount: selectedGroup.memberCount - 1,
            isJoined: false
          });
        }
        
        Toast.show({
          content: '已退出群组',
          position: 'bottom',
        });
      },
    });
  };
  
  // 进入群聊
  const enterGroupChat = (groupId: number) => {
    navigate(`/group-chat/${groupId}`);
  };
  
  // 按分类获取群组的函数
  const getGroupsByCategory = (category: string) => {
    if (category === 'all') return filteredGroups;
    return filteredGroups.filter(group => group.category === category);
  };
  
  return (
    <div className="groups-page">
      {!selectedGroup ? (
        // 群组列表页面
        <>
          <NavBar onBack={() => navigate('/')}>社区群组</NavBar>
          
          <div className="search-bar">
            <SearchIcon />
            <Input
              placeholder="搜索群组名称、描述或标签"
              value={searchValue}
              onChange={setSearchValue}
              clearable
              style={{ flex: 1 }}
            />
          </div>
          
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <Tabs.Tab title="全部" key="all">
              <div className="group-list">
                {filteredGroups.map(group => (
                  <Card
                    key={group.id}
                    onClick={() => openGroupDetail(group)}
                    className="group-card"
                  >
                    <div className="group-card-header">
                      <Image src={group.avatar} width={60} height={60} fit="cover" style={{ borderRadius: '8px' }} />
                      <div className="group-basic-info">
                        <div className="group-name">{group.name}</div>
                        <div className="group-stats">
                          <MemberIcon />
                          <span>{group.memberCount}人</span>
                          <span className="activity-level">{group.activity}</span>
                        </div>
                        <div className="group-tags">
                          {group.tags.slice(0, 2).map((tag, index) => (
                            <Tag key={index} color="primary" fill="outline" style={{ marginRight: 4 }}>
                              {tag}
                            </Tag>
                          ))}
                          {group.tags.length > 2 && (
                            <span className="more-tags">+{group.tags.length - 2}</span>
                          )}
                        </div>
                      </div>
                      {group.isJoined && (
                        <Badge color="#1677ff" content="已加入" style={{ '--right': '10px', '--top': '10px' }} />
                      )}
                    </div>
                    <div className="group-description">{group.description}</div>
                  </Card>
                ))}
              </div>
            </Tabs.Tab>
            
            <Tabs.Tab title="健康" key="health">
              <div className="group-list">
                {getGroupsByCategory('健康').map(group => (
                  <Card
                    key={group.id}
                    onClick={() => openGroupDetail(group)}
                    className="group-card"
                  >
                    <div className="group-card-header">
                      <Image src={group.avatar} width={60} height={60} fit="cover" style={{ borderRadius: '8px' }} />
                      <div className="group-basic-info">
                        <div className="group-name">{group.name}</div>
                        <div className="group-stats">
                          <MemberIcon />
                          <span>{group.memberCount}人</span>
                          <span className="activity-level">{group.activity}</span>
                        </div>
                        <div className="group-tags">
                          {group.tags.slice(0, 2).map((tag, index) => (
                            <Tag key={index} color="primary" fill="outline" style={{ marginRight: 4 }}>
                              {tag}
                            </Tag>
                          ))}
                          {group.tags.length > 2 && (
                            <span className="more-tags">+{group.tags.length - 2}</span>
                          )}
                        </div>
                      </div>
                      {group.isJoined && (
                        <Badge color="#1677ff" content="已加入" style={{ '--right': '10px', '--top': '10px' }} />
                      )}
                    </div>
                    <div className="group-description">{group.description}</div>
                  </Card>
                ))}
              </div>
            </Tabs.Tab>
            
            <Tabs.Tab title="兴趣" key="interest">
              <div className="group-list">
                {getGroupsByCategory('兴趣').map(group => (
                  <Card
                    key={group.id}
                    onClick={() => openGroupDetail(group)}
                    className="group-card"
                  >
                    <div className="group-card-header">
                      <Image src={group.avatar} width={60} height={60} fit="cover" style={{ borderRadius: '8px' }} />
                      <div className="group-basic-info">
                        <div className="group-name">{group.name}</div>
                        <div className="group-stats">
                          <MemberIcon />
                          <span>{group.memberCount}人</span>
                          <span className="activity-level">{group.activity}</span>
                        </div>
                        <div className="group-tags">
                          {group.tags.slice(0, 2).map((tag, index) => (
                            <Tag key={index} color="primary" fill="outline" style={{ marginRight: 4 }}>
                              {tag}
                            </Tag>
                          ))}
                          {group.tags.length > 2 && (
                            <span className="more-tags">+{group.tags.length - 2}</span>
                          )}
                        </div>
                      </div>
                      {group.isJoined && (
                        <Badge color="#1677ff" content="已加入" style={{ '--right': '10px', '--top': '10px' }} />
                      )}
                    </div>
                    <div className="group-description">{group.description}</div>
                  </Card>
                ))}
              </div>
            </Tabs.Tab>
            
            <Tabs.Tab title="社区" key="community">
              <div className="group-list">
                {getGroupsByCategory('社区').map(group => (
                  <Card
                    key={group.id}
                    onClick={() => openGroupDetail(group)}
                    className="group-card"
                  >
                    <div className="group-card-header">
                      <Image src={group.avatar} width={60} height={60} fit="cover" style={{ borderRadius: '8px' }} />
                      <div className="group-basic-info">
                        <div className="group-name">{group.name}</div>
                        <div className="group-stats">
                          <MemberIcon />
                          <span>{group.memberCount}人</span>
                          <span className="activity-level">{group.activity}</span>
                        </div>
                        <div className="group-tags">
                          {group.tags.slice(0, 2).map((tag, index) => (
                            <Tag key={index} color="primary" fill="outline" style={{ marginRight: 4 }}>
                              {tag}
                            </Tag>
                          ))}
                          {group.tags.length > 2 && (
                            <span className="more-tags">+{group.tags.length - 2}</span>
                          )}
                        </div>
                      </div>
                      {group.isJoined && (
                        <Badge color="#1677ff" content="已加入" style={{ '--right': '10px', '--top': '10px' }} />
                      )}
                    </div>
                    <div className="group-description">{group.description}</div>
                  </Card>
                ))}
              </div>
            </Tabs.Tab>
            
            <Tabs.Tab title="通知" key="notice">
              <div className="group-list">
                {getGroupsByCategory('通知').map(group => (
                  <Card
                    key={group.id}
                    onClick={() => openGroupDetail(group)}
                    className="group-card"
                  >
                    <div className="group-card-header">
                      <Image src={group.avatar} width={60} height={60} fit="cover" style={{ borderRadius: '8px' }} />
                      <div className="group-basic-info">
                        <div className="group-name">{group.name}</div>
                        <div className="group-stats">
                          <MemberIcon />
                          <span>{group.memberCount}人</span>
                          <span className="activity-level">{group.activity}</span>
                        </div>
                        <div className="group-tags">
                          {group.tags.slice(0, 2).map((tag, index) => (
                            <Tag key={index} color="primary" fill="outline" style={{ marginRight: 4 }}>
                              {tag}
                            </Tag>
                          ))}
                          {group.tags.length > 2 && (
                            <span className="more-tags">+{group.tags.length - 2}</span>
                          )}
                        </div>
                      </div>
                      {group.isJoined && (
                        <Badge color="#1677ff" content="已加入" style={{ '--right': '10px', '--top': '10px' }} />
                      )}
                    </div>
                    <div className="group-description">{group.description}</div>
                  </Card>
                ))}
              </div>
            </Tabs.Tab>
          </Tabs>
          
          <div className="group-recommendations">
            <h3 className="section-title">推荐群组</h3>
            <div className="recommendations-list">
              {groups.filter(group => !group.isJoined).slice(0, 3).map(group => (
                <Card
                  key={group.id}
                  onClick={() => openGroupDetail(group)}
                  className="recommendation-card"
                >
                  <div className="recommendation-content">
                    <Image src={group.avatar} width={50} height={50} fit="cover" />
                    <div className="recommendation-info">
                      <div className="recommendation-name">{group.name}</div>
                      <div className="recommendation-members">{group.memberCount}人</div>
                    </div>
                    <Button 
                      size="small" 
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        joinGroup(group.id);
                      }}
                    >
                      加入
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      ) : (
        // 群组详情页面
        <div className="group-detail">
          <NavBar onBack={closeGroupDetail}>群组详情</NavBar>
          
          <div className="detail-content">
            <div className="detail-header">
              <Image src={selectedGroup.avatar} width={80} height={80} fit="cover" />
              <div className="detail-basic">
                <h2 className="detail-name">{selectedGroup.name}</h2>
                <div className="detail-members">
                  <MemberIcon />
                  <span>{selectedGroup.memberCount}人 · {selectedGroup.activity}</span>
                </div>
                <div className="detail-category">
                  <Tag color="#2db7f5">{selectedGroup.category}</Tag>
                </div>
              </div>
            </div>
            
            <div className="detail-actions">
              {selectedGroup.isJoined ? (
                <>
                  <Button 
                    color="primary" 
                    onClick={() => enterGroupChat(selectedGroup.id)}
                    style={{ flex: 1 }}
                  >
                    进入群聊
                  </Button>
                  <Button 
                    color="default" 
                    onClick={() => leaveGroup(selectedGroup.id)}
                    style={{ flex: 1 }}
                  >
                    退出群组
                  </Button>
                </>
              ) : (
                <Button 
                  block 
                  color="primary"
                  onClick={() => joinGroup(selectedGroup.id)}
                >
                  加入群组
                </Button>
              )}
            </div>
            
            <List header="群组介绍">
              <List.Item>
                <p className="detail-description">{selectedGroup.description}</p>
              </List.Item>
            </List>
            
            <List header="群主信息">
              <List.Item prefix={<Avatar src={selectedGroup.founder.avatar} />}>
                {selectedGroup.founder.name}
              </List.Item>
            </List>
            
            <List header="群组标签">
              <List.Item>
                <div className="detail-tags">
                  {selectedGroup.tags.map((tag, index) => (
                    <Tag key={index} color="#f5f5f5" style={{ color: '#666' }}>{tag}</Tag>
                  ))}
                </div>
              </List.Item>
            </List>
            
            {selectedGroup.announcement && (
              <List header={
                <div className="announcement-header">
                  <NoticeIcon /> 群公告
                </div>
              }>
                <List.Item>
                  <p className="announcement-content">{selectedGroup.announcement}</p>
                </List.Item>
              </List>
            )}
            
            {selectedGroup.events && selectedGroup.events.length > 0 && (
              <List header="近期活动">
                {selectedGroup.events.map(event => (
                  <List.Item
                    key={event.id}
                    title={event.title}
                    description={`${event.time} · ${event.location}`}
                  />
                ))}
              </List>
            )}
          </div>
        </div>
      )}
      
      <style>{`
        .groups-page {
          min-height: 100vh;
          padding-bottom: 70px;
        }
        
        .search-bar {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          background-color: #f5f5f5;
        }
        
        .search-bar svg {
          margin-right: 8px;
        }
        
        .group-list {
          padding: 16px;
        }
        
        .group-card {
          margin-bottom: 16px;
          overflow: hidden;
          border-radius: 8px;
        }
        
        .group-card-header {
          display: flex;
          padding: 16px;
        }
        
        .group-basic-info {
          flex: 1;
          margin-left: 16px;
        }
        
        .group-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
        }
        
        .group-stats {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #999;
        }
        
        .group-stats svg {
          margin-right: 4px;
        }
        
        .activity-level {
          margin-left: 8px;
          font-size: 12px;
        }
        
        .group-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 0 16px 16px;
        }
        
        .group-recommendations {
          padding: 16px;
          background-color: #f9f9f9;
          margin-top: 16px;
        }
        
        .section-title {
          margin: 0 0 16px;
          font-size: 16px;
          font-weight: bold;
          color: #333;
        }
        
        .recommendations-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .recommendation-card {
          padding: 12px;
        }
        
        .recommendation-content {
          display: flex;
          align-items: center;
        }
        
        .recommendation-info {
          flex: 1;
          margin-left: 12px;
        }
        
        .recommendation-name {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 4px;
        }
        
        .recommendation-members {
          font-size: 14px;
          color: #999;
        }
        
        .detail-content {
          padding: 16px;
        }
        
        .detail-header {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .detail-basic {
          margin-left: 20px;
          flex: 1;
        }
        
        .detail-name {
          margin: 0 0 8px;
          font-size: 22px;
        }
        
        .detail-members {
          display: flex;
          align-items: center;
          color: #666;
          margin-bottom: 8px;
        }
        
        .detail-members svg {
          margin-right: 4px;
        }
        
        .detail-category {
          display: flex;
        }
        
        .detail-actions {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .detail-description {
          margin: 0;
          line-height: 1.6;
          color: #666;
        }
        
        .detail-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .announcement-header {
          display: flex;
          align-items: center;
        }
        
        .announcement-header svg {
          margin-right: 8px;
        }
        
        .announcement-content {
          margin: 0;
          line-height: 1.6;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default GroupsPage;