import express from 'express';

const router = express.Router();

// 获取系统状态
router.get('/status', (_req, res) => {
  const status = {
    serverTime: new Date().toISOString(),
    status: 'online',
    version: '1.0.0'
  };
  
  res.json({
    success: true,
    data: status
  });
});

// 简单的用户API，稍后可以连接到Supabase
router.get('/users', (_req, res) => {
  // 模拟数据
  const users = [
    { id: 1, email: 'user1@example.com', created_at: new Date().toISOString() },
    { id: 2, email: 'user2@example.com', created_at: new Date().toISOString() }
  ];
  
  res.json({
    success: true,
    data: users
  });
});

export default router; 