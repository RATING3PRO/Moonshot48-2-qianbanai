import express from 'express';
import { supabase } from '../index';
import { requireAdmin } from '../middleware/auth';

const router = express.Router();

// 应用管理员中间件保护所有路由
router.use(requireAdmin);

// 获取仪表盘数据
router.get('/dashboard', async (req, res) => {
  try {
    // 获取用户数量
    const { count: userCount, error: userError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    // 获取最近7天注册用户
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const { data: newUsers, error: newUsersError } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', lastWeek.toISOString())
      .order('created_at', { ascending: false });
    
    // 系统状态信息
    const systemInfo = {
      version: '1.0.0',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    };
    
    if (userError || newUsersError) {
      throw new Error('获取数据失败');
    }
    
    res.json({
      success: true,
      data: {
        userCount: userCount || 0,
        newUsersCount: newUsers?.length || 0,
        systemInfo
      }
    });
  } catch (error) {
    console.error('获取仪表盘数据失败:', error);
    res.status(500).json({
      success: false,
      message: '获取仪表盘数据失败',
      error: error.message
    });
  }
});

// 获取日志列表
router.get('/logs', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('system_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('获取日志失败:', error);
    res.status(500).json({
      success: false,
      message: '获取日志失败',
      error: error.message
    });
  }
});

// 系统配置
router.get('/settings', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*');
    
    if (error) throw error;
    
    const settings = data.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('获取系统配置失败:', error);
    res.status(500).json({
      success: false,
      message: '获取系统配置失败',
      error: error.message
    });
  }
});

// 更新系统配置
router.post('/settings', async (req, res) => {
  try {
    const settings = req.body;
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({
        success: false,
        message: '无效的配置数据'
      });
    }
    
    // 将对象转换为数组以批量插入
    const settingsArray = Object.entries(settings).map(([key, value]) => ({
      key,
      value: String(value),
      updated_at: new Date().toISOString()
    }));
    
    // 使用upsert来更新或插入
    const { error } = await supabase
      .from('system_settings')
      .upsert(settingsArray, { onConflict: 'key' });
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: '系统配置已更新'
    });
  } catch (error) {
    console.error('更新系统配置失败:', error);
    res.status(500).json({
      success: false,
      message: '更新系统配置失败',
      error: error.message
    });
  }
});

export default router; 