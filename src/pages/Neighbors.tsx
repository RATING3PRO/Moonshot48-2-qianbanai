import React, { useState } from 'react';
import { NavBar, Tabs, List, Image, Button, Badge, Tag, Card, Grid, Avatar, Dialog, Space, Divider, Toast, Input, Swiper } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

// 图标组件
const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1677ff">
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#999">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1677ff">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const CallIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1677ff">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
);

// 邻居类型定义
interface Neighbor {
  id: number;
  name: string;
  avatar: string;
  distance: string;
  address: string;
  phone: string;
  tags: string[];
  age: number;
  interests: string[];
  lastActive: string;
  bio: string;
  photos?: string[];
}

const NeighborsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNeighbor, setSelectedNeighbor] = useState<Neighbor | null>(null);
  const [searchValue, setSearchValue] = useState('');
  
  // 邻居数据
  const [neighbors, setNeighbors] = useState<Neighbor[]>([
    {
      id: 1,
      name: "李大爷",
      avatar: "https://via.placeholder.com/100",
      distance: "50米",
      address: "和谐小区2栋302室",
      phone: "139****5678",
      tags: ["太极爱好者", "象棋高手", "退休教师"],
      age: 68,
      interests: ["太极拳", "象棋", "读书", "钓鱼"],
      lastActive: "今天",
      bio: "退休数学教师，喜欢下象棋和打太极拳，希望能结交更多志同道合的朋友。",
      photos: [
        "https://via.placeholder.com/300x200?text=太极表演",
        "https://via.placeholder.com/300x200?text=象棋比赛",
        "https://via.placeholder.com/300x200?text=钓鱼"
      ]
    },
    {
      id: 2,
      name: "王奶奶",
      avatar: "https://via.placeholder.com/100",
      distance: "100米",
      address: "和谐小区3栋105室",
      phone: "136****4321",
      tags: ["广场舞达人", "手工编织", "烹饪高手"],
      age: 65,
      interests: ["广场舞", "编织", "烹饪", "看戏"],
      lastActive: "昨天",
      bio: "喜欢跳广场舞，也热爱手工编织，经常在社区组织美食分享活动，欢迎大家来找我学习厨艺。"
    },
    {
      id: 3,
      name: "张叔叔",
      avatar: "https://via.placeholder.com/100",
      distance: "150米",
      address: "和谐小区5栋401室",
      phone: "138****2233",
      tags: ["园艺爱好者", "志愿者"],
      age: 62,
      interests: ["园艺", "志愿服务", "摄影", "养鸟"],
      lastActive: "今天",
      bio: "退休后开始学习园艺，在小区负责绿化维护工作，也是社区志愿者服务队的一员。喜欢用相机记录社区的美好瞬间。",
      photos: [
        "https://via.placeholder.com/300x200?text=社区花园",
        "https://via.placeholder.com/300x200?text=志愿活动",
        "https://via.placeholder.com/300x200?text=鸟笼"
      ]
    },
    {
      id: 4,
      name: "刘阿姨",
      avatar: "https://via.placeholder.com/100",
      distance: "200米",
      address: "和谐小区1栋201室",
      phone: "135****6789",
      tags: ["广场舞", "健步走"],
      age: 60,
      interests: ["广场舞", "健步走", "唱歌", "旅游"],
      lastActive: "3天前",
      bio: "退休银行职员，喜欢广场舞和健步走，热爱唱歌，组织过多次社区卡拉OK活动。"
    },
    {
      id: 5,
      name: "赵大哥",
      avatar: "https://via.placeholder.com/100",
      distance: "300米",
      address: "和谐小区4栋501室",
      phone: "137****1122",
      tags: ["棋牌爱好者", "钓鱼达人"],
      age: 66,
      interests: ["麻将", "钓鱼", "养花", "看新闻"],
      lastActive: "今天",
      bio: "退休工程师，喜欢棋牌活动和钓鱼，周末经常组织麻将聚会，欢迎邻居们一起参与。",
      photos: [
        "https://via.placeholder.com/300x200?text=麻将",
        "https://via.placeholder.com/300x200?text=钓鱼",
        "https://via.placeholder.com/300x200?text=花卉"
      ]
    },
    {
      id: 6,
      name: "周医生",
      avatar: "https://via.placeholder.com/100",
      distance: "350米",
      address: "和谐小区6栋301室",
      phone: "138****3344",
      tags: ["健康顾问", "爱心义诊"],
      age: 58,
      interests: ["医学讲座", "书法", "太极拳", "阅读"],
      lastActive: "昨天",
      bio: "退休内科医生，定期在社区开展健康讲座和义诊活动，擅长书法，也是太极拳爱好者。"
    },
    {
      id: 7,
      name: "吴爷爷",
      avatar: "https://via.placeholder.com/100",
      distance: "400米",
      address: "和谐小区7栋102室",
      phone: "139****5566",
      tags: ["历史爱好者", "下棋高手"],
      age: 75,
      interests: ["历史", "围棋", "养花", "看报"],
      lastActive: "5天前",
      bio: "退休历史教师，对中国历史有深入研究，喜欢与人分享历史故事和知识，也是围棋高手。",
      photos: [
        "https://via.placeholder.com/300x200?text=讲课",
        "https://via.placeholder.com/300x200?text=围棋",
        "https://via.placeholder.com/300x200?text=花盆"
      ]
    },
    {
      id: 8,
      name: "郑老师",
      avatar: "https://via.placeholder.com/100",
      distance: "250米",
      address: "和谐小区3栋503室",
      phone: "135****7788",
      tags: ["声乐教师", "合唱团团长"],
      age: 63,
      interests: ["声乐", "合唱", "钢琴", "古典音乐"],
      lastActive: "今天",
      bio: "退休音乐教师，现在是社区合唱团的团长，每周组织排练和演出活动。擅长钢琴伴奏，热爱古典音乐。",
      photos: [
        "https://via.placeholder.com/300x200?text=合唱团",
        "https://via.placeholder.com/300x200?text=钢琴表演",
        "https://via.placeholder.com/300x200?text=音乐会"
      ]
    },
    {
      id: 9,
      name: "孙大妈",
      avatar: "https://via.placeholder.com/100",
      distance: "180米",
      address: "和谐小区1栋604室",
      phone: "137****9900",
      tags: ["中医养生", "茶道爱好者"],
      age: 68,
      interests: ["中医养生", "茶道", "太极", "国画"],
      lastActive: "2天前",
      bio: "退休中医师，精通中医养生保健知识，喜欢品茶和练习太极，偶尔也画些国画小品。欢迎邻居们来交流养生心得。"
    },
    {
      id: 10,
      name: "钱师傅",
      avatar: "https://via.placeholder.com/100",
      distance: "320米",
      address: "和谐小区6栋104室",
      phone: "139****2211",
      tags: ["木工匠人", "传统手工艺"],
      age: 70,
      interests: ["木工", "传统手工艺", "教学", "钓鱼"],
      lastActive: "今天",
      bio: "退休木工师傅，擅长传统木工技艺，现在偶尔在社区举办木工技艺培训班，教授简单的木工技术。闲暇时喜欢钓鱼。",
      photos: [
        "https://via.placeholder.com/300x200?text=木工作品",
        "https://via.placeholder.com/300x200?text=教学",
        "https://via.placeholder.com/300x200?text=钓鱼"
      ]
    },
    {
      id: 11,
      name: "余奶奶",
      avatar: "https://via.placeholder.com/100",
      distance: "280米",
      address: "和谐小区5栋202室",
      phone: "136****3355",
      tags: ["绘画爱好者", "摄影达人"],
      age: 64,
      interests: ["水彩画", "摄影", "旅行", "看展览"],
      lastActive: "昨天",
      bio: "退休美术教师，喜欢画水彩画，也热爱摄影。经常组织小规模的社区摄影活动和艺术交流会，欢迎有共同爱好的邻居加入。"
    },
    {
      id: 12,
      name: "谢叔叔",
      avatar: "https://via.placeholder.com/100",
      distance: "380米",
      address: "和谐小区7栋405室",
      phone: "138****7766",
      tags: ["社区安全员", "退休警察"],
      age: 62,
      interests: ["社区安全", "法律知识宣传", "下棋", "看书"],
      lastActive: "今天",
      bio: "退休警察，现在担任社区安全员，负责巡逻和安全宣传工作。经常为居民提供法律咨询和安全防范建议，业余时间喜欢下棋和阅读。"
    },
    {
      id: 13,
      name: "邓教授",
      avatar: "https://via.placeholder.com/100",
      distance: "420米",
      address: "和谐小区8栋301室",
      phone: "135****4455",
      tags: ["科普讲师", "志愿者"],
      age: 66,
      interests: ["科普", "阅读", "志愿服务", "写作"],
      lastActive: "3天前",
      bio: "退休物理教授，现在在社区和学校做科普志愿者，定期举办科普讲座和实验展示活动。喜欢阅读科普书籍，也尝试写一些科普文章。",
      photos: [
        "https://via.placeholder.com/300x200?text=科普讲座",
        "https://via.placeholder.com/300x200?text=科学实验",
        "https://via.placeholder.com/300x200?text=书架"
      ]
    },
    {
      id: 14,
      name: "汪大爷",
      avatar: "https://via.placeholder.com/100",
      distance: "220米",
      address: "和谐小区4栋603室",
      phone: "139****6677",
      tags: ["电子达人", "维修能手"],
      age: 65,
      interests: ["电子维修", "智能设备", "钓鱼", "下棋"],
      lastActive: "昨天",
      bio: "退休电子工程师，精通各种家电和电子设备的维修，经常在社区帮助邻居解决各种电器故障问题。也是社区钓鱼协会的成员。"
    },
    {
      id: 15,
      name: "杜阿姨",
      avatar: "https://via.placeholder.com/100",
      distance: "330米",
      address: "和谐小区2栋504室",
      phone: "136****8899",
      tags: ["社区调解员", "心理咨询"],
      age: 61,
      interests: ["心理健康", "调解", "插花", "太极"],
      lastActive: "今天",
      bio: "退休心理咨询师，现在是社区调解员，帮助居民解决各种矛盾纠纷。热心社区事务，擅长倾听和沟通，业余时间喜欢插花和练习太极。"
    }
  ]);
  
  // 过滤后的邻居列表
  const filteredNeighbors = neighbors.filter(neighbor => 
    neighbor.name.includes(searchValue) || 
    neighbor.tags.some(tag => tag.includes(searchValue)) ||
    neighbor.interests.some(interest => interest.includes(searchValue))
  );
  
  // 打开邻居详情
  const openNeighborDetail = (neighbor: Neighbor) => {
    setSelectedNeighbor(neighbor);
  };
  
  // 关闭邻居详情
  const closeNeighborDetail = () => {
    setSelectedNeighbor(null);
  };
  
  // 发送消息
  const sendMessage = (neighborId: number) => {
    navigate(`/private-chat/${neighborId}`);
  };
  
  // 拨打电话
  const callNeighbor = (phone: string) => {
    Dialog.confirm({
      content: `确定要拨打 ${phone} 吗？`,
      onConfirm: () => {
        Toast.show({
          content: `正在拨打 ${phone}`,
          position: 'bottom',
        });
      },
    });
  };
  
  // 获取当前选项卡下的邻居
  const getNeighborsByTab = (tab: string) => {
    if (tab === 'all') return filteredNeighbors;
    
    const tagMap: Record<string, string[]> = {
      'activity': ['太极爱好者', '广场舞达人', '健步走', '棋牌爱好者', '声乐教师', '合唱团团长', '茶道爱好者'],
      'talent': ['象棋高手', '烹饪高手', '园艺爱好者', '钓鱼达人', '下棋高手', '木工匠人', '绘画爱好者', '摄影达人', '电子达人', '维修能手'],
      'service': ['志愿者', '健康顾问', '爱心义诊', '退休教师', '社区安全员', '退休警察', '科普讲师', '社区调解员'],
      'hobby': ['手工编织', '摄影', '书法', '唱歌', '旅游', '历史爱好者', '中医养生', '传统手工艺', '心理咨询', '插花']
    };
    
    return filteredNeighbors.filter(neighbor => 
      neighbor.tags.some(tag => tagMap[tab]?.includes(tag))
    );
  };
  
  return (
    <div className="neighbors-page">
      {!selectedNeighbor ? (
        // 邻居列表页面
        <>
          <NavBar onBack={() => navigate('/')}>附近的邻居</NavBar>
          
          <div className="search-bar">
            <SearchIcon />
            <Input
              placeholder="搜索邻居姓名、标签或兴趣爱好"
              value={searchValue}
              onChange={setSearchValue}
              clearable
              style={{ flex: 1 }}
            />
          </div>
          
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <Tabs.Tab title="全部" key="all">
              <div className="neighbor-list">
                {getNeighborsByTab('all').map(neighbor => (
                  <Card
                    key={neighbor.id}
                    onClick={() => openNeighborDetail(neighbor)}
                    className="neighbor-card"
                  >
                    <div className="neighbor-card-content">
                      <Avatar src={neighbor.avatar} style={{ width: 60, height: 60 }} />
                      <div className="neighbor-info">
                        <div className="neighbor-name">
                          <span>{neighbor.name}</span>
                          <span className="neighbor-distance">{neighbor.distance}</span>
                        </div>
                        <div className="neighbor-tags">
                          {neighbor.tags.slice(0, 2).map((tag, index) => (
                            <Tag key={index} color="primary" fill="outline" style={{ marginRight: 4 }}>
                              {tag}
                            </Tag>
                          ))}
                          {neighbor.tags.length > 2 && (
                            <span className="more-tags">+{neighbor.tags.length - 2}</span>
                          )}
                        </div>
                        <div className="neighbor-bio">{neighbor.bio.slice(0, 50)}...</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Tabs.Tab>
            
            <Tabs.Tab title="活动爱好者" key="activity">
              <div className="neighbor-list">
                {getNeighborsByTab('activity').map(neighbor => (
                  <Card
                    key={neighbor.id}
                    onClick={() => openNeighborDetail(neighbor)}
                    className="neighbor-card"
                  >
                    <div className="neighbor-card-content">
                      <Avatar src={neighbor.avatar} style={{ width: 60, height: 60 }} />
                      <div className="neighbor-info">
                        <div className="neighbor-name">
                          <span>{neighbor.name}</span>
                          <span className="neighbor-distance">{neighbor.distance}</span>
                        </div>
                        <div className="neighbor-tags">
                          {neighbor.tags.slice(0, 2).map((tag, index) => (
                            <Tag key={index} color="primary" fill="outline" style={{ marginRight: 4 }}>
                              {tag}
                            </Tag>
                          ))}
                          {neighbor.tags.length > 2 && (
                            <span className="more-tags">+{neighbor.tags.length - 2}</span>
                          )}
                        </div>
                        <div className="neighbor-bio">{neighbor.bio.slice(0, 50)}...</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Tabs.Tab>
            
            <Tabs.Tab title="特长达人" key="talent">
              <div className="neighbor-list">
                {getNeighborsByTab('talent').map(neighbor => (
                  <Card
                    key={neighbor.id}
                    onClick={() => openNeighborDetail(neighbor)}
                    className="neighbor-card"
                  >
                    <div className="neighbor-card-content">
                      <Avatar src={neighbor.avatar} style={{ width: 60, height: 60 }} />
                      <div className="neighbor-info">
                        <div className="neighbor-name">
                          <span>{neighbor.name}</span>
                          <span className="neighbor-distance">{neighbor.distance}</span>
                        </div>
                        <div className="neighbor-tags">
                          {neighbor.tags.slice(0, 2).map((tag, index) => (
                            <Tag key={index} color="primary" fill="outline" style={{ marginRight: 4 }}>
                              {tag}
                            </Tag>
                          ))}
                          {neighbor.tags.length > 2 && (
                            <span className="more-tags">+{neighbor.tags.length - 2}</span>
                          )}
                        </div>
                        <div className="neighbor-bio">{neighbor.bio.slice(0, 50)}...</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Tabs.Tab>
            
            <Tabs.Tab title="社区服务" key="service">
              <div className="neighbor-list">
                {getNeighborsByTab('service').map(neighbor => (
                  <Card
                    key={neighbor.id}
                    onClick={() => openNeighborDetail(neighbor)}
                    className="neighbor-card"
                  >
                    <div className="neighbor-card-content">
                      <Avatar src={neighbor.avatar} style={{ width: 60, height: 60 }} />
                      <div className="neighbor-info">
                        <div className="neighbor-name">
                          <span>{neighbor.name}</span>
                          <span className="neighbor-distance">{neighbor.distance}</span>
                        </div>
                        <div className="neighbor-tags">
                          {neighbor.tags.slice(0, 2).map((tag, index) => (
                            <Tag key={index} color="primary" fill="outline" style={{ marginRight: 4 }}>
                              {tag}
                            </Tag>
                          ))}
                          {neighbor.tags.length > 2 && (
                            <span className="more-tags">+{neighbor.tags.length - 2}</span>
                          )}
                        </div>
                        <div className="neighbor-bio">{neighbor.bio.slice(0, 50)}...</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Tabs.Tab>
            
            <Tabs.Tab title="兴趣爱好" key="hobby">
              <div className="neighbor-list">
                {getNeighborsByTab('hobby').map(neighbor => (
                  <Card
                    key={neighbor.id}
                    onClick={() => openNeighborDetail(neighbor)}
                    className="neighbor-card"
                  >
                    <div className="neighbor-card-content">
                      <Avatar src={neighbor.avatar} style={{ width: 60, height: 60 }} />
                      <div className="neighbor-info">
                        <div className="neighbor-name">
                          <span>{neighbor.name}</span>
                          <span className="neighbor-distance">{neighbor.distance}</span>
                        </div>
                        <div className="neighbor-tags">
                          {neighbor.tags.slice(0, 2).map((tag, index) => (
                            <Tag key={index} color="primary" fill="outline" style={{ marginRight: 4 }}>
                              {tag}
                            </Tag>
                          ))}
                          {neighbor.tags.length > 2 && (
                            <span className="more-tags">+{neighbor.tags.length - 2}</span>
                          )}
                        </div>
                        <div className="neighbor-bio">{neighbor.bio.slice(0, 50)}...</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Tabs.Tab>
          </Tabs>
        </>
      ) : (
        // 邻居详情页面
        <div className="neighbor-detail">
          <NavBar onBack={closeNeighborDetail}>邻居详情</NavBar>
          
          <div className="detail-content">
            <div className="detail-header">
              <Avatar src={selectedNeighbor.avatar} style={{ width: 80, height: 80 }} />
              <div className="detail-basic">
                <h2 className="detail-name">{selectedNeighbor.name}</h2>
                <div className="detail-age">{selectedNeighbor.age}岁</div>
                <div className="detail-distance">
                  <LocationIcon />
                  <span>距离：{selectedNeighbor.distance}</span>
                </div>
              </div>
            </div>
            
            <div className="detail-actions">
              <Button 
                color="primary" 
                onClick={() => sendMessage(selectedNeighbor.id)}
                style={{ flex: 1 }}
              >
                <MessageIcon /> 发消息
              </Button>
              <Button 
                color="default" 
                onClick={() => callNeighbor(selectedNeighbor.phone)}
                style={{ flex: 1 }}
              >
                <CallIcon /> 打电话
              </Button>
            </div>
            
            <List header="个人资料">
              <List.Item title="地址">
                {selectedNeighbor.address}
              </List.Item>
              <List.Item title="联系电话">
                {selectedNeighbor.phone}
              </List.Item>
              <List.Item title="最近活跃">
                {selectedNeighbor.lastActive}
              </List.Item>
            </List>
            
            <List header="个人简介">
              <List.Item>
                <p className="bio-text">{selectedNeighbor.bio}</p>
              </List.Item>
            </List>
            
            <List header="兴趣爱好">
              <List.Item>
                <div className="interest-tags">
                  {selectedNeighbor.interests.map((interest, index) => (
                    <Tag key={index} color="#e6f7ff" style={{ color: '#1677ff' }}>{interest}</Tag>
                  ))}
                </div>
              </List.Item>
            </List>
            
            <List header="特长标签">
              <List.Item>
                <div className="tag-list">
                  {selectedNeighbor.tags.map((tag, index) => (
                    <Tag key={index} color="#f5f5f5" style={{ color: '#666' }}>{tag}</Tag>
                  ))}
                </div>
              </List.Item>
            </List>
            
            {selectedNeighbor.photos && (
              <List header="生活照片">
                <List.Item>
                  <Swiper style={{ height: 200 }}>
                    {selectedNeighbor.photos.map((photo, index) => (
                      <Swiper.Item key={index}>
                        <div className="photo-container">
                          <Image src={photo} width="100%" height={200} fit="cover" />
                        </div>
                      </Swiper.Item>
                    ))}
                  </Swiper>
                </List.Item>
              </List>
            )}
          </div>
        </div>
      )}
      
      <style>{`
        .neighbors-page {
          min-height: 100vh;
          padding-bottom: 60px;
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
        
        .neighbor-list {
          padding: 16px;
        }
        
        .neighbor-card {
          margin-bottom: 16px;
          overflow: hidden;
          border-radius: 8px;
        }
        
        .neighbor-header {
          display: flex;
          padding: 16px;
        }
        
        .neighbor-info {
          flex: 1;
          margin-left: 16px;
        }
        
        .neighbor-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .neighbor-distance {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #666;
          margin-bottom: 4px;
        }
        
        .neighbor-distance svg {
          margin-right: 4px;
        }
        
        .neighbor-active {
          font-size: 14px;
          color: #999;
        }
        
        .neighbor-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 0 16px 16px;
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
        }
        
        .detail-name {
          margin: 0 0 4px;
          font-size: 22px;
        }
        
        .detail-age {
          color: #666;
          margin-bottom: 4px;
        }
        
        .detail-distance {
          display: flex;
          align-items: center;
          color: #666;
        }
        
        .detail-distance svg {
          margin-right: 4px;
        }
        
        .detail-actions {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .bio-text {
          margin: 0;
          line-height: 1.6;
          color: #666;
        }
        
        .interest-tags, .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .photo-container {
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f5f5f5;
        }
      `}</style>
    </div>
  );
};

export default NeighborsPage; 