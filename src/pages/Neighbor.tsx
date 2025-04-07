import React, { useState } from 'react';
import { List, Avatar, Button, Tag, Space, Toast, Input } from 'antd-mobile';
import { 
  EnvironmentOutline,
  MessageOutline,
  StarOutline,
  StarFill,
  SearchOutline,
} from 'antd-mobile-icons';
import './Neighbor.css';

const Neighbor: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [followedNeighbors, setFollowedNeighbors] = useState<number[]>([]);
  
  const [neighbors] = useState([
    {
      id: 1,
      name: '张阿姨',
      avatar: 'https://via.placeholder.com/40',
      distance: '50m',
      building: '1栋',
      unit: '2单元',
      tags: ['广场舞', '太极拳', '种花'],
      intro: '喜欢跳广场舞，欢迎一起来玩！'
    },
    {
      id: 2,
      name: '李大爷',
      avatar: 'https://via.placeholder.com/40',
      distance: '100m',
      building: '2栋',
      unit: '1单元',
      tags: ['下棋', '钓鱼', '养鸟'],
      intro: '每天早上在小区下棋，欢迎来切磋。'
    },
    {
      id: 3,
      name: '王奶奶',
      avatar: 'https://via.placeholder.com/40',
      distance: '150m',
      building: '3栋',
      unit: '3单元',
      tags: ['烹饪', '手工', '园艺'],
      intro: '会做各种美食，经常和邻居分享。'
    },
  ]);

  const handleFollow = (neighborId: number) => {
    setFollowedNeighbors(prev => {
      if (prev.includes(neighborId)) {
        return prev.filter(id => id !== neighborId);
      } else {
        return [...prev, neighborId];
      }
    });
  };

  const handleMessage = (neighbor: any) => {
    Toast.show({
      content: '聊天功能即将上线',
      position: 'bottom',
    });
  };

  const filteredNeighbors = neighbors.filter(neighbor => 
    neighbor.name.includes(searchText) || 
    neighbor.tags.some(tag => tag.includes(searchText))
  );

  return (
    <div className="neighbor-container">
      <div className="neighbor-header">
        <h2>邻里社交</h2>
        <div className="search-bar">
          <SearchOutline className="search-icon" />
          <Input
            placeholder="搜索邻居或兴趣标签"
            value={searchText}
            onChange={setSearchText}
            className="search-input"
          />
        </div>
      </div>

      <List className="neighbor-list">
        {filteredNeighbors.map(neighbor => (
          <List.Item
            key={neighbor.id}
            prefix={<Avatar src={neighbor.avatar} />}
            extra={
              <Space>
                <Button
                  size="small"
                  onClick={() => handleMessage(neighbor)}
                >
                  <MessageOutline /> 聊天
                </Button>
                <Button
                  size="small"
                  onClick={() => handleFollow(neighbor.id)}
                >
                  {followedNeighbors.includes(neighbor.id) ? (
                    <><StarFill color="#ffd700" /> 已关注</>
                  ) : (
                    <><StarOutline /> 关注</>
                  )}
                </Button>
              </Space>
            }
          >
            <div className="neighbor-info">
              <div className="neighbor-title">
                <span className="neighbor-name">{neighbor.name}</span>
                <span className="neighbor-location">
                  <EnvironmentOutline /> {neighbor.distance}
                </span>
              </div>
              
              <div className="neighbor-address">
                {neighbor.building} {neighbor.unit}
              </div>

              <div className="neighbor-tags">
                {neighbor.tags.map(tag => (
                  <Tag key={tag} color="primary" fill="outline">
                    {tag}
                  </Tag>
                ))}
              </div>

              <div className="neighbor-intro">
                {neighbor.intro}
              </div>
            </div>
          </List.Item>
        ))}
      </List>
    </div>
  );
};

export default Neighbor; 