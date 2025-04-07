import React, { useState } from 'react';
import { NavBar, Tabs, List, Image, Button, Badge, Tag, Card, Grid, Avatar, Dialog, Space, Divider, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarOutline,
  ClockCircleOutline,
  EnvironmentOutline,
  TeamOutline,
  HeartOutline,
  HeartFill,
} from 'antd-mobile-icons';
import './Activity.css';

// 图标组件
const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1677ff">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const TimeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1677ff">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
  </svg>
);

const PeopleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1677ff">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

// 活动类型定义
interface Activity {
  id: number;
  title: string;
  image: string;
  location: string;
  time: string;
  category: string;
  participants: number;
  maxParticipants: number;
  description: string;
  organizer: {
    id: number;
    name: string;
    avatar: string;
  };
  isRegistered?: boolean;
  date: string;
  tags: string[];
}

const ActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [likedActivities, setLikedActivities] = useState<number[]>([]);
  
  // 活动数据
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      title: "社区健康讲座：老年人常见疾病预防",
      image: "https://via.placeholder.com/400x200",
      location: "社区活动中心一号厅",
      time: "2025年4月10日 上午9:00-11:00",
      category: "健康",
      participants: 45,
      maxParticipants: 80,
      description: "本次讲座邀请市第一人民医院张医生为大家讲解老年人常见疾病的预防知识，包括高血压、糖尿病等慢性病的日常护理和饮食调理方法。参与者可以现场向医生咨询健康问题，并有免费血压、血糖检测服务。",
      organizer: {
        id: 101,
        name: "社区健康服务站",
        avatar: "https://via.placeholder.com/40"
      },
      date: "2025-04-10",
      tags: ["健康", "讲座", "预防"]
    },
    {
      id: 2,
      title: "每周太极班",
      image: "https://via.placeholder.com/400x200",
      location: "社区公园东区广场",
      time: "每周二、四、六 早上7:00-8:00",
      category: "健康",
      participants: 28,
      maxParticipants: 30,
      description: "由社区太极拳协会李老师带领的太极班，适合各年龄段人群参与。太极拳动作柔和，对改善心肺功能、增强身体协调性有很好的帮助。请穿着舒适的运动服装参加。",
      organizer: {
        id: 102,
        name: "社区太极拳协会",
        avatar: "https://via.placeholder.com/40"
      },
      isRegistered: true,
      date: "每周",
      tags: ["健康", "太极", "运动"]
    },
    {
      id: 3,
      title: "社区读书会：《人生百年，活出健康》",
      image: "https://via.placeholder.com/400x200",
      location: "社区图书馆二楼会议室",
      time: "2025年4月15日 下午2:00-4:00",
      category: "学习",
      participants: 15,
      maxParticipants: 30,
      description: "本月读书会我们将一起阅读《人生百年，活出健康》，讨论如何通过健康的生活方式延长寿命，提高生活质量。请提前阅读本书，活动现场将安排分组讨论和心得分享。",
      organizer: {
        id: 103,
        name: "社区文化站",
        avatar: "https://via.placeholder.com/40"
      },
      date: "2025-04-15",
      tags: ["学习", "读书", "健康"]
    },
    {
      id: 4,
      title: "邻里大扫除",
      image: "https://via.placeholder.com/400x200",
      location: "小区各楼栋",
      time: "2025年4月20日 上午8:00-10:00",
      category: "邻居",
      participants: 56,
      maxParticipants: 100,
      description: "为创造更加整洁美丽的居住环境，社区组织邻里大扫除活动。活动内容包括清理楼道、整理绿化带、清扫公共区域等。请自备简单清洁工具，社区将提供垃圾袋。活动结束后有便民服务咨询和简单茶点。",
      organizer: {
        id: 104,
        name: "社区居委会",
        avatar: "https://via.placeholder.com/40"
      },
      date: "2025-04-20",
      tags: ["邻居", "大扫除", "社区"]
    },
    {
      id: 5,
      title: "智能手机使用技巧班",
      image: "https://via.placeholder.com/400x200",
      location: "社区活动中心二号厅",
      time: "2025年4月12日、19日 上午10:00-11:30",
      category: "学习",
      participants: 38,
      maxParticipants: 40,
      description: "专为中老年人设计的智能手机使用课程，内容包括微信使用、网上支付、视频通话、健康应用等实用功能教学。课程共两次，每次1.5小时。请携带您的智能手机参加，现场有志愿者一对一辅导。",
      organizer: {
        id: 105,
        name: "社区信息志愿团",
        avatar: "https://via.placeholder.com/40"
      },
      date: "2025-04-12",
      tags: ["学习", "智能手机", "中老年人"]
    },
    {
      id: 6,
      title: "社区棋牌比赛",
      image: "https://via.placeholder.com/400x200",
      location: "社区活动中心棋牌室",
      time: "2025年4月25日 下午1:00-5:00",
      category: "活动",
      participants: 32,
      maxParticipants: 40,
      description: "本次比赛项目包括象棋、围棋、五子棋和扑克牌。参赛者可任选一项或多项参加，按积分评出名次。比赛结束后有颁奖仪式，前三名将获得精美纪念品。",
      organizer: {
        id: 106,
        name: "社区文体协会",
        avatar: "https://via.placeholder.com/40"
      },
      date: "2025-04-25",
      tags: ["活动", "棋牌", "比赛"]
    },
    {
      id: 7,
      title: "邻里故事分享会",
      image: "https://via.placeholder.com/400x200",
      location: "社区小剧场",
      time: "2025年4月28日 晚上7:00-8:30",
      category: "邻居",
      participants: 25,
      maxParticipants: 50,
      description: "邀请社区居民分享自己的人生故事、家庭趣事或邻里互助的感人瞬间。通过故事分享增进邻里了解，传递正能量。欢迎提前报名讲述自己的故事，也欢迎前来聆听。",
      organizer: {
        id: 107,
        name: "社区文化站",
        avatar: "https://via.placeholder.com/40"
      },
      date: "2025-04-28",
      tags: ["邻居", "故事分享", "社区"]
    },
    {
      id: 8,
      title: "传统手工艺体验班",
      image: "https://via.placeholder.com/400x200",
      location: "社区活动中心三号厅",
      time: "2025年4月22日 下午2:30-4:30",
      category: "学习",
      participants: 20,
      maxParticipants: 30,
      description: "本次活动邀请了民间艺术家教授剪纸、编织、泥塑等传统手工艺，参与者可以亲手制作并带走自己的作品。活动适合所有年龄段，特别欢迎祖孙一起参加，传承民间艺术。",
      organizer: {
        id: 108,
        name: "社区文化站",
        avatar: "https://via.placeholder.com/40"
      },
      date: "2025-04-22",
      tags: ["学习", "传统手工艺", "体验"]
    },
    {
      id: 9,
      title: "老年人防诈骗知识讲座",
      image: "https://via.placeholder.com/400x200",
      location: "社区活动中心一号厅",
      time: "2025年4月16日 上午10:00-11:30",
      category: "学习",
      participants: 52,
      maxParticipants: 80,
      description: "由社区民警主讲，针对当前常见的电信诈骗、网络诈骗手段进行讲解，提高老年人防诈骗意识和能力。活动现场将发放防诈骗宣传册，并设置咨询台解答相关问题。",
      organizer: {
        id: 109,
        name: "社区警务室",
        avatar: "https://via.placeholder.com/40"
      },
      date: "2025-04-16",
      tags: ["学习", "防诈骗", "老年人"]
    },
    {
      id: 10,
      title: "社区义诊活动",
      image: "https://via.placeholder.com/400x200",
      location: "社区卫生服务中心",
      time: "2025年4月21日 上午8:30-11:30",
      category: "健康",
      participants: 60,
      maxParticipants: 100,
      description: "由市中心医院专家团队提供的义诊服务，包括内科、外科、骨科、中医科等多个科室。现场可进行基础体检、健康咨询和用药指导，请携带个人健康档案或既往病历参加。",
      organizer: {
        id: 110,
        name: "社区卫生服务中心",
        avatar: "https://via.placeholder.com/40"
      },
      date: "2025-04-21",
      tags: ["健康", "义诊", "社区"]
    },
    {
      id: 11,
      title: "春季踏青活动",
      image: "https://via.placeholder.com/400x200",
      location: "城市植物园",
      time: "2025年4月14日 上午8:00-12:00",
      category: "活动",
      participants: 35,
      maxParticipants: 50,
      description: "组织社区居民前往城市植物园踏青赏花，活动包括健步走、园区导览、春季植物知识讲解等。请穿着舒适鞋子，携带水和相机，集合地点为社区大门口，统一乘车前往。",
      organizer: {
        id: 111,
        name: "社区老年协会",
        avatar: "https://via.placeholder.com/40"
      },
      date: "2025-04-14",
      tags: ["活动", "踏青", "社区"]
    },
    {
      id: 12,
      title: "传统节日文化活动：清明追思",
      image: "https://via.placeholder.com/400x200",
      location: "社区文化中心",
      time: "2025年4月5日 上午9:00-11:00",
      category: "活动",
      participants: 40,
      maxParticipants: 60,
      description: "开展清明节传统文化活动，内容包括诗词朗诵、传统习俗讲解、缅怀先人等环节。活动旨在传承中华传统文化，培养敬老爱老情感，增强社区文化氛围。",
      organizer: {
        id: 112,
        name: "社区文化站",
        avatar: "https://via.placeholder.com/40"
      },
      date: "2025-04-05",
      tags: ["活动", "传统文化", "清明节"]
    },
    {
      id: 13,
      title: "社区合唱团招募与排练",
      image: "https://via.placeholder.com/400x200",
      location: "社区小剧场",
      time: "每周三、五 下午3:00-5:00",
      category: "活动",
      participants: 23,
      maxParticipants: 40,
      description: "社区合唱团面向所有热爱音乐的居民招募团员，不限年龄，无需专业基础。合唱团将定期参加社区文化活动演出，丰富社区文化生活。每周排练两次，欢迎有兴趣的居民加入。",
      organizer: {
        id: 113,
        name: "社区文化站",
        avatar: "https://via.placeholder.com/40"
      },
      date: "每周",
      tags: ["活动", "合唱团", "音乐"]
    },
    {
      id: 14,
      title: "园艺种植交流会",
      image: "https://via.placeholder.com/400x200",
      location: "社区花园",
      time: "2025年4月23日 上午9:00-11:00",
      category: "兴趣",
      participants: 18,
      maxParticipants: 30,
      description: "由社区园艺爱好者组织的种植交流活动，内容包括常见花卉种植技巧、盆栽养护方法分享、季节性蔬菜种植建议等。参与者可互换植物种子和幼苗，增进邻里交流。",
      organizer: {
        id: 114,
        name: "社区园艺小组",
        avatar: "https://via.placeholder.com/40"
      },
      date: "2025-04-23",
      tags: ["兴趣", "园艺", "交流"]
    },
    {
      id: 15,
      title: "居家安全与急救知识培训",
      image: "https://via.placeholder.com/400x200",
      location: "社区活动中心一号厅",
      time: "2025年4月26日 上午10:00-12:00",
      category: "学习",
      participants: 42,
      maxParticipants: 60,
      description: "由消防部门和红十字会工作人员联合开展的安全培训，内容包括家庭火灾预防、用电安全、跌倒预防以及心肺复苏等基础急救技能。培训采用理论讲解与实操相结合的方式，提高居民应急能力。",
      organizer: {
        id: 115,
        name: "社区安全委员会",
        avatar: "https://via.placeholder.com/40"
      },
      date: "2025-04-26",
      tags: ["学习", "安全", "急救"]
    }
  ]);
  
  // 打开活动详情
  const openActivityDetail = (activity: Activity) => {
    setSelectedActivity(activity);
  };
  
  // 关闭活动详情
  const closeActivityDetail = () => {
    setSelectedActivity(null);
  };
  
  // 报名活动
  const registerActivity = (activityId: number) => {
    setActivities(prevActivities => 
      prevActivities.map(activity => 
        activity.id === activityId 
          ? { ...activity, participants: activity.participants + 1, isRegistered: true }
          : activity
      )
    );
    
    if (selectedActivity && selectedActivity.id === activityId) {
      setSelectedActivity({
        ...selectedActivity,
        participants: selectedActivity.participants + 1,
        isRegistered: true
      });
    }
    
    Toast.show({
      content: '报名成功！',
      position: 'bottom',
    });
  };
  
  // 取消报名
  const cancelRegistration = (activityId: number) => {
    Dialog.confirm({
      content: '确定要取消报名吗？',
      onConfirm: () => {
        setActivities(prevActivities => 
          prevActivities.map(activity => 
            activity.id === activityId 
              ? { ...activity, participants: activity.participants - 1, isRegistered: false }
              : activity
          )
        );
        
        if (selectedActivity && selectedActivity.id === activityId) {
          setSelectedActivity({
            ...selectedActivity,
            participants: selectedActivity.participants - 1,
            isRegistered: false
          });
        }
        
        Toast.show({
          content: '已取消报名',
          position: 'bottom',
        });
      },
    });
  };

  const handleLike = (activityId: number) => {
    setLikedActivities(prev => {
      if (prev.includes(activityId)) {
        return prev.filter(id => id !== activityId);
      } else {
        return [...prev, activityId];
      }
    });
  };

  return (
    <div className="activity-page">
      {!selectedActivity ? (
        // 活动列表页面
        <>
          <NavBar onBack={() => navigate('/')}>社区活动</NavBar>
          
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <Tabs.Tab title="全部" key="all">
              <div className="activity-list">
                {activities.map(activity => (
                  <Card
                    key={activity.id}
                    onClick={() => openActivityDetail(activity)}
                    className="activity-card"
                  >
                    <Image src={activity.image} fit="cover" className="activity-image" />
                    <div className="activity-content">
                      <h3>{activity.title}</h3>
                      <div className="activity-info">
                        <div className="info-item">
                          <LocationIcon />
                          <span>{activity.location}</span>
                        </div>
                        <div className="info-item">
                          <TimeIcon />
                          <span>{activity.time}</span>
                        </div>
                        <div className="info-item">
                          <PeopleIcon />
                          <span>{activity.participants}/{activity.maxParticipants}人</span>
                        </div>
                      </div>
                      <div className="activity-status">
                        {activity.isRegistered ? (
                          <Tag color="primary">已报名</Tag>
                        ) : (
                          activity.participants >= activity.maxParticipants ? (
                            <Tag color="default">已满</Tag>
                          ) : (
                            <Tag color="success">可报名</Tag>
                          )
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Tabs.Tab>
            
            <Tabs.Tab title="健康" key="health">
              <div className="activity-list">
                {activities.filter(activity => activity.category === "健康").map(activity => (
                  <Card
                    key={activity.id}
                    onClick={() => openActivityDetail(activity)}
                    className="activity-card"
                  >
                    <Image src={activity.image} fit="cover" className="activity-image" />
                    <div className="activity-content">
                      <h3>{activity.title}</h3>
                      <div className="activity-info">
                        <div className="info-item">
                          <LocationIcon />
                          <span>{activity.location}</span>
                        </div>
                        <div className="info-item">
                          <TimeIcon />
                          <span>{activity.time}</span>
                        </div>
                        <div className="info-item">
                          <PeopleIcon />
                          <span>{activity.participants}/{activity.maxParticipants}人</span>
                        </div>
                      </div>
                      <div className="activity-status">
                        {activity.isRegistered ? (
                          <Tag color="primary">已报名</Tag>
                        ) : (
                          activity.participants >= activity.maxParticipants ? (
                            <Tag color="default">已满</Tag>
                          ) : (
                            <Tag color="success">可报名</Tag>
                          )
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Tabs.Tab>
            
            <Tabs.Tab title="学习" key="learn">
              <div className="activity-list">
                {activities.filter(activity => activity.category === "学习").map(activity => (
                  <Card
                    key={activity.id}
                    onClick={() => openActivityDetail(activity)}
                    className="activity-card"
                  >
                    <Image src={activity.image} fit="cover" className="activity-image" />
                    <div className="activity-content">
                      <h3>{activity.title}</h3>
                      <div className="activity-info">
                        <div className="info-item">
                          <LocationIcon />
                          <span>{activity.location}</span>
                        </div>
                        <div className="info-item">
                          <TimeIcon />
                          <span>{activity.time}</span>
                        </div>
                        <div className="info-item">
                          <PeopleIcon />
                          <span>{activity.participants}/{activity.maxParticipants}人</span>
                        </div>
                      </div>
                      <div className="activity-status">
                        {activity.isRegistered ? (
                          <Tag color="primary">已报名</Tag>
                        ) : (
                          activity.participants >= activity.maxParticipants ? (
                            <Tag color="default">已满</Tag>
                          ) : (
                            <Tag color="success">可报名</Tag>
                          )
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Tabs.Tab>
            
            <Tabs.Tab title="活动" key="activity">
              <div className="activity-list">
                {activities.filter(activity => activity.category === "活动").map(activity => (
                  <Card
                    key={activity.id}
                    onClick={() => openActivityDetail(activity)}
                    className="activity-card"
                  >
                    <Image src={activity.image} fit="cover" className="activity-image" />
                    <div className="activity-content">
                      <h3>{activity.title}</h3>
                      <div className="activity-info">
                        <div className="info-item">
                          <LocationIcon />
                          <span>{activity.location}</span>
                        </div>
                        <div className="info-item">
                          <TimeIcon />
                          <span>{activity.time}</span>
                        </div>
                        <div className="info-item">
                          <PeopleIcon />
                          <span>{activity.participants}/{activity.maxParticipants}人</span>
                        </div>
                      </div>
                      <div className="activity-status">
                        {activity.isRegistered ? (
                          <Tag color="primary">已报名</Tag>
                        ) : (
                          activity.participants >= activity.maxParticipants ? (
                            <Tag color="default">已满</Tag>
                          ) : (
                            <Tag color="success">可报名</Tag>
                          )
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Tabs.Tab>
            
            <Tabs.Tab title="邻居" key="neighbor">
              <div className="activity-list">
                {activities.filter(activity => activity.category === "邻居").map(activity => (
                  <Card
                    key={activity.id}
                    onClick={() => openActivityDetail(activity)}
                    className="activity-card"
                  >
                    <Image src={activity.image} fit="cover" className="activity-image" />
                    <div className="activity-content">
                      <h3>{activity.title}</h3>
                      <div className="activity-info">
                        <div className="info-item">
                          <LocationIcon />
                          <span>{activity.location}</span>
                        </div>
                        <div className="info-item">
                          <TimeIcon />
                          <span>{activity.time}</span>
                        </div>
                        <div className="info-item">
                          <PeopleIcon />
                          <span>{activity.participants}/{activity.maxParticipants}人</span>
                        </div>
                      </div>
                      <div className="activity-status">
                        {activity.isRegistered ? (
                          <Tag color="primary">已报名</Tag>
                        ) : (
                          activity.participants >= activity.maxParticipants ? (
                            <Tag color="default">已满</Tag>
                          ) : (
                            <Tag color="success">可报名</Tag>
                          )
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Tabs.Tab>
            
            <Tabs.Tab title="兴趣" key="interest">
              <div className="activity-list">
                {activities.filter(activity => activity.category === "兴趣").map(activity => (
                  <Card
                    key={activity.id}
                    onClick={() => openActivityDetail(activity)}
                    className="activity-card"
                  >
                    <Image src={activity.image} fit="cover" className="activity-image" />
                    <div className="activity-content">
                      <h3>{activity.title}</h3>
                      <div className="activity-info">
                        <div className="info-item">
                          <LocationIcon />
                          <span>{activity.location}</span>
                        </div>
                        <div className="info-item">
                          <TimeIcon />
                          <span>{activity.time}</span>
                        </div>
                        <div className="info-item">
                          <PeopleIcon />
                          <span>{activity.participants}/{activity.maxParticipants}人</span>
                        </div>
                      </div>
                      <div className="activity-status">
                        {activity.isRegistered ? (
                          <Tag color="primary">已报名</Tag>
                        ) : (
                          activity.participants >= activity.maxParticipants ? (
                            <Tag color="default">已满</Tag>
                          ) : (
                            <Tag color="success">可报名</Tag>
                          )
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Tabs.Tab>
          </Tabs>
        </>
      ) : (
        // 活动详情页面
        <div className="activity-detail">
          <NavBar onBack={closeActivityDetail}>活动详情</NavBar>
          
          <div className="detail-content">
            <Image src={selectedActivity.image} width="100%" height={200} fit="cover" />
            
            <div className="detail-header">
              <h2 className="detail-title">{selectedActivity.title}</h2>
              <div className="detail-tags">
                <Tag color="#2db7f5">{selectedActivity.category}</Tag>
                {selectedActivity.isRegistered && <Tag color="#87d068">已报名</Tag>}
                {selectedActivity.participants >= selectedActivity.maxParticipants && <Tag color="#f50">已满</Tag>}
              </div>
            </div>
            
            <List className="detail-info">
              <List.Item prefix={<LocationIcon />}>
                {selectedActivity.location}
              </List.Item>
              <List.Item prefix={<TimeIcon />}>
                {selectedActivity.time}
              </List.Item>
              <List.Item prefix={<PeopleIcon />}>
                {selectedActivity.participants}/{selectedActivity.maxParticipants}人
              </List.Item>
            </List>
            
            <div className="detail-section">
              <h3>活动详情</h3>
              <p>{selectedActivity.description}</p>
            </div>
            
            <div className="detail-section">
              <h3>组织者</h3>
              <div className="organizer-info">
                <Avatar src={selectedActivity.organizer.avatar}>{selectedActivity.organizer.name.charAt(0)}</Avatar>
                <span>{selectedActivity.organizer.name}</span>
              </div>
            </div>
            
            <div className="action-buttons">
              {!selectedActivity.isRegistered ? (
                <Button 
                  block 
                  color="primary"
                  disabled={selectedActivity.participants >= selectedActivity.maxParticipants}
                  onClick={() => registerActivity(selectedActivity.id)}
                >
                  {selectedActivity.participants >= selectedActivity.maxParticipants ? '名额已满' : '立即报名'}
                </Button>
              ) : (
                <Button 
                  block 
                  color="default"
                  onClick={() => cancelRegistration(selectedActivity.id)}
                >
                  取消报名
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .activity-page {
          min-height: 100vh;
          padding-bottom: 60px;
        }
        
        .activity-list {
          padding: 16px;
        }
        
        .activity-card {
          margin-bottom: 16px;
          overflow: hidden;
          border-radius: 8px;
        }
        
        .activity-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }
        
        .activity-content {
          padding: 12px;
        }
        
        .activity-title {
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: bold;
          line-height: 1.4;
        }
        
        .activity-info {
          margin-bottom: 8px;
          font-size: 14px;
          color: #666;
        }
        
        .info-item {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
        }
        
        .info-item svg {
          margin-right: 6px;
        }
        
        .activity-status {
          margin-top: 8px;
        }
        
        .detail-content {
          padding: 16px;
        }
        
        .detail-header {
          margin: 16px 0;
        }
        
        .detail-title {
          margin: 0 0 8px;
          font-size: 20px;
          font-weight: bold;
        }
        
        .detail-tags {
          display: flex;
          gap: 8px;
        }
        
        .detail-section {
          margin: 24px 0;
        }
        
        .detail-section h3 {
          margin: 0 0 12px;
          font-size: 16px;
          color: #333;
        }
        
        .detail-section p {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          color: #666;
        }
        
        .organizer-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .action-buttons {
          margin-top: 32px;
          padding-bottom: 24px;
        }
      `}</style>
    </div>
  );
};

export default ActivityPage; 