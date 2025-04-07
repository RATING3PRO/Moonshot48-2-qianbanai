import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Chip, 
  TextField, 
  Typography, 
  Box,
  Autocomplete,
  Rating
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { UserInterest, InterestCollector } from '../services/interestCollector';

// 兴趣类别列表
const INTEREST_CATEGORIES = [
  '阅读', '运动', '艺术', '烹饪', '旅游', 
  '园艺', '收藏', '养生', '科技', '音乐', 
  '宠物', '手工', '社交', '娱乐', '学习'
];

// 每个类别下的常见兴趣
const COMMON_INTERESTS: Record<string, string[]> = {
  '阅读': ['小说', '历史书籍', '诗词', '传记', '养生保健类书籍'],
  '运动': ['太极拳', '散步', '广场舞', '游泳', '瑜伽', '乒乓球', '下棋', '打牌'],
  '艺术': ['书法', '绘画', '摄影', '手工艺', '戏曲'],
  '烹饪': ['做饭', '烘焙', '面点', '家常菜', '糕点'],
  '旅游': ['国内旅游', '国际旅游', '采风', '自驾游', '文化游'],
  '园艺': ['种花', '种菜', '盆栽', '花艺', '庭院设计'],
  '收藏': ['集邮', '钱币收藏', '古玩收藏', '字画收藏', '纪念品收藏'],
  '养生': ['中医养生', '茶道', '按摩', '静坐冥想', '食疗'],
  '科技': ['电脑', '智能手机', '数码产品', '摄影器材', '智能家居'],
  '音乐': ['唱歌', '乐器演奏', '听音乐', '戏曲', '合唱'],
  '宠物': ['养猫', '养狗', '观赏鱼', '鸟类', '小型宠物'],
  '手工': ['编织', '剪纸', '刺绣', '折纸', '布艺'],
  '社交': ['聊天', '朋友聚会', '社区活动', '志愿服务', '群组交流'],
  '娱乐': ['看电影', '看电视', '听音乐', '棋牌游戏', '动漫'],
  '学习': ['外语', '计算机', '历史', '文化', '艺术欣赏']
};

// 兴趣级别选项
const INTEREST_LEVELS = [
  { value: 1, label: '一般' },
  { value: 2, label: '喜欢' },
  { value: 3, label: '热爱' }
];

interface InterestSettingDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (interests: UserInterest[]) => void;
}

const InterestSettingDialog: React.FC<InterestSettingDialogProps> = ({ 
  open, 
  onClose,
  onSave
}) => {
  // 当前的兴趣列表
  const [interests, setInterests] = useState<UserInterest[]>([]);
  
  // 新增兴趣表单状态
  const [newCategory, setNewCategory] = useState<string>('');
  const [newInterest, setNewInterest] = useState<string>('');
  const [newLevel, setNewLevel] = useState<number>(2);
  
  // 自定义兴趣输入模式
  const [customMode, setCustomMode] = useState(false);
  const [customInterest, setCustomInterest] = useState('');
  
  // 初始化兴趣列表
  useEffect(() => {
    if (open) {
      // 从InterestCollector获取已有的兴趣爱好
      setInterests(InterestCollector.getInterests());
    }
  }, [open]);
  
  // 添加新兴趣
  const handleAddInterest = () => {
    if (customMode) {
      // 添加自定义兴趣
      if (customInterest.trim() && newCategory) {
        const newInterestItem: UserInterest = {
          category: newCategory,
          name: customInterest.trim(),
          level: newLevel as 1 | 2 | 3
        };
        
        setInterests([...interests, newInterestItem]);
        setCustomInterest('');
        setCustomMode(false);
      }
    } else {
      // 添加预设兴趣
      if (newCategory && newInterest) {
        const newInterestItem: UserInterest = {
          category: newCategory,
          name: newInterest,
          level: newLevel as 1 | 2 | 3
        };
        
        // 检查是否已存在相同兴趣
        const exists = interests.some(
          item => item.category === newCategory && item.name === newInterest
        );
        
        if (!exists) {
          setInterests([...interests, newInterestItem]);
        }
        
        // 重置表单
        setNewInterest('');
      }
    }
  };
  
  // 删除兴趣
  const handleDeleteInterest = (index: number) => {
    const newInterests = [...interests];
    newInterests.splice(index, 1);
    setInterests(newInterests);
  };
  
  // 更新兴趣级别
  const handleUpdateLevel = (index: number, newLevel: number) => {
    const newInterests = [...interests];
    newInterests[index].level = newLevel as 1 | 2 | 3;
    setInterests(newInterests);
  };
  
  // 保存所有兴趣设置
  const handleSave = () => {
    // 更新InterestCollector中的兴趣列表
    InterestCollector.setInterests(interests);
    
    // 调用回调函数
    onSave(interests);
    onClose();
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, padding: 1 }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" component="div" fontWeight="bold" color="primary">
          设置我的兴趣爱好
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          添加您的兴趣爱好，帮助我们为您提供更加个性化的内容和服务
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        {/* 当前兴趣列表 */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            我的兴趣爱好
          </Typography>
          
          {interests.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              您还没有添加任何兴趣爱好，请在下方添加。
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {interests.map((interest, index) => (
                <Chip
                  key={index}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        {interest.category}: {interest.name}
                      </Typography>
                      <Rating
                        size="small"
                        value={interest.level}
                        max={3}
                        onChange={(_, newValue) => {
                          if (newValue) handleUpdateLevel(index, newValue);
                        }}
                      />
                    </Box>
                  }
                  onDelete={() => handleDeleteInterest(index)}
                  sx={{ 
                    padding: '10px 5px',
                    height: 'auto',
                    '& .MuiChip-label': { display: 'flex', gap: 1 }
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
        
        {/* 添加新兴趣表单 */}
        <Box>
          <Typography variant="h6" gutterBottom>
            添加新兴趣
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Box sx={{ flex: '1 1 180px', minWidth: '180px' }}>
              <Autocomplete
                value={newCategory}
                onChange={(_, newValue) => {
                  setNewCategory(newValue || '');
                  setNewInterest(''); // 重置兴趣选择
                }}
                options={INTEREST_CATEGORIES}
                renderInput={(params) => (
                  <TextField {...params} label="兴趣类别" variant="outlined" fullWidth />
                )}
              />
            </Box>
            
            <Box sx={{ flex: customMode ? '2 1 250px' : '1 1 180px', minWidth: '180px' }}>
              {customMode ? (
                <TextField
                  label="自定义兴趣名称"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  variant="outlined"
                  fullWidth
                />
              ) : (
                <Autocomplete
                  value={newInterest}
                  onChange={(_, newValue) => setNewInterest(newValue || '')}
                  options={newCategory ? COMMON_INTERESTS[newCategory] || [] : []}
                  renderInput={(params) => (
                    <TextField {...params} label="具体兴趣" variant="outlined" fullWidth />
                  )}
                  disabled={!newCategory}
                />
              )}
            </Box>
            
            <Box sx={{ flex: '1 1 180px', minWidth: '180px' }}>
              <Autocomplete
                value={INTEREST_LEVELS.find(l => l.value === newLevel)}
                onChange={(_, newValue) => {
                  if (newValue) setNewLevel(newValue.value);
                }}
                options={INTEREST_LEVELS}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="兴趣程度" variant="outlined" fullWidth />
                )}
              />
            </Box>
            
            <Box sx={{ flex: customMode ? '0 1 auto' : '1 1 150px', minWidth: customMode ? 'auto' : '150px' }}>
              {!customMode && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setCustomMode(true)}
                  fullWidth
                >
                  自定义
                </Button>
              )}
              {customMode && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setCustomMode(false)}
                >
                  取消
                </Button>
              )}
            </Box>
            
            <Box sx={{ flex: customMode ? '1 1 100%' : '1 1 150px', minWidth: customMode ? '100%' : '150px' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddInterest}
                startIcon={<AddIcon />}
                disabled={(customMode && (!customInterest || !newCategory)) || 
                          (!customMode && (!newCategory || !newInterest))}
                fullWidth
              >
                添加兴趣
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ padding: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          取消
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          disabled={interests.length === 0}
        >
          保存设置
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InterestSettingDialog; 