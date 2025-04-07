import React from 'react';
import { Dialog, Tag, Space, Button } from 'antd-mobile';
import { UserInterest } from '../services/interestCollector';

interface InterestDialogProps {
  visible: boolean;
  interests: UserInterest[];
  onClose: () => void;
  onAddTags: () => void;
  onImportToProfile: () => void;
}

// 根据兴趣级别获取标签颜色
const getTagColor = (level: number) => {
  switch (level) {
    case 3:
      return 'primary';
    case 2:
      return 'success';
    default:
      return 'default';
  }
};

// 获取兴趣级别名称
const getInterestLevelName = (level: number) => {
  switch (level) {
    case 3:
      return '(热爱)';
    case 2:
      return '(喜欢)';
    default:
      return '';
  }
};

const InterestDialog: React.FC<InterestDialogProps> = ({ 
  visible, 
  interests, 
  onClose, 
  onAddTags, 
  onImportToProfile 
}) => {
  // 按类别分组兴趣
  const interestsByCategory: Record<string, UserInterest[]> = {};
  
  interests.forEach(interest => {
    if (!interestsByCategory[interest.category]) {
      interestsByCategory[interest.category] = [];
    }
    interestsByCategory[interest.category].push(interest);
  });
  
  return (
    <Dialog
      visible={visible}
      title="您的兴趣标签"
      content={
        <div style={{ maxHeight: '60vh', overflow: 'auto', padding: '12px 0' }}>
          {interests.length > 0 ? (
            <>
              <div style={{ marginBottom: '16px' }}>
                根据我们的对话，您可能对以下内容感兴趣：
              </div>
              
              {Object.entries(interestsByCategory).map(([category, items]) => (
                <div key={category} style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {category}
                  </div>
                  <Space wrap>
                    {items.map((interest, index) => (
                      <Tag 
                        key={index} 
                        color={getTagColor(interest.level)}
                      >
                        {interest.name} {getInterestLevelName(interest.level)}
                      </Tag>
                    ))}
                  </Space>
                </div>
              ))}
              
              <div style={{ marginTop: '16px', color: '#666', fontSize: '14px' }}>
                这些兴趣标签可以帮助我更好地理解您的喜好，为您提供更个性化的服务。
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#999' }}>
              暂无兴趣标签，请继续进行对话...
            </div>
          )}
        </div>
      }
      actions={[
        {
          key: 'add-tags',
          text: '添加兴趣标签',
          onClick: onAddTags
        },
        {
          key: 'import',
          text: '导入到个人信息',
          onClick: onImportToProfile
        },
        {
          key: 'cancel',
          text: '取消',
          onClick: onClose
        }
      ]}
    />
  );
};

export default InterestDialog; 