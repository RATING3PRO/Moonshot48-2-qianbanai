import express from 'express';
import { supabase } from '../index';
import adminRoutes from './admin';

const router = express.Router();

// 获取用户列表
router.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) throw error;
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户列表失败',
      error: error.message
    });
  }
});

// 获取系统状态
router.get('/status', (req, res) => {
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

// 管理员路由
router.use('/admin', adminRoutes);

// 添加更多API路由...

export default router; 