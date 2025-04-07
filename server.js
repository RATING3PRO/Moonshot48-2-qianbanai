// 完整的后端服务器 (ESM格式)
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 获取__dirname (在ESM中)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 数据存储路径
const DATA_DIR = path.join(import.meta.dirname, 'data');
const SERVERS_FILE = path.join(DATA_DIR, 'servers.json');
const LOGS_FILE = path.join(DATA_DIR, 'logs.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CHAT_HISTORY_FILE = path.join(DATA_DIR, 'chat_history.json');
const FRIENDS_FILE = path.join(DATA_DIR, 'friends.json');
const JWT_SECRET = process.env.JWT_SECRET; // JWT密钥，生产环境应该使用更复杂的密钥
const FRIENDSHIPS_FILE = path.join(DATA_DIR, 'friendships.json');

// 确保数据目录存在
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // 检查服务器数据文件是否存在，不存在则创建
    try {
      await fs.access(SERVERS_FILE);
    } catch (err) {
      // 创建默认服务器数据
      const defaultServers = [
        {
          id: 1,
          name: 'misakablog',
          protocol: 'vmess',
          port: 28714,
          status: true,
          traffic: { upload: 0, download: 0 },
          note: ''
        }
      ];
      await fs.writeFile(SERVERS_FILE, JSON.stringify(defaultServers, null, 2));
    }
    
    // 检查日志文件是否存在，不存在则创建
    try {
      await fs.access(LOGS_FILE);
    } catch (err) {
      // 创建默认日志数据
      const defaultLogs = [
        {
          id: '1',
          level: 'info',
          message: '系统初始化',
          details: '服务器首次启动',
          created_at: new Date().toISOString()
        }
      ];
      await fs.writeFile(LOGS_FILE, JSON.stringify(defaultLogs, null, 2));
    }
    
    // 检查设置文件是否存在，不存在则创建
    try {
      await fs.access(SETTINGS_FILE);
    } catch (err) {
      // 创建默认设置数据
      const defaultSettings = {
        'app.name': 'AI牵伴管理系统',
        'app.description': '老年人社交应用管理平台',
        'app.version': '1.0.0',
        'mail.enabled': 'true',
        'mail.service': 'smtp.example.com',
        'notification.enabled': 'true',
        'storage.provider': 'local'
      };
      await fs.writeFile(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
    }
    
    // 检查用户数据文件是否存在，不存在则创建
    try {
      await fs.access(USERS_FILE);
    } catch (err) {
      // 创建默认用户数据，包含一个管理员账户和测试用户
      const defaultUsers = [
        {
          id: 1,
          username: 'admin',
          // 实际应用中应该使用加密密码
          password: process.env.ADMIN_PASSWORD || 'admin123',
          email: 'admin@example.com',
          phone: '13800138000', // 添加手机号
          role: 'admin',
          status: 'active',
          created_at: new Date().toISOString(),
          last_login: null,
          traffic_limit: 10737418240, // 10GB 流量限制 (字节)
          traffic_used: 0,
          servers_access: [1], // 可访问的服务器ID
          subscription_url: generateSubscriptionToken(),
          profile: {
            display_name: '管理员',
            avatar: '',
            phone: '13800138000' // 确保profile中也有手机号
          }
        },
        {
          id: 2,
          username: '李大爷',
          password: 'password123',
          email: 'li@example.com',
          phone: '13912345678',
          role: 'user',
          status: 'active',
          created_at: new Date().toISOString(),
          last_login: null,
          traffic_limit: 5368709120, // 5GB 流量限制
          traffic_used: 0,
          servers_access: [1],
          subscription_url: generateSubscriptionToken(),
          profile: {
            display_name: '李大爷',
            avatar: 'https://via.placeholder.com/40',
            phone: '13912345678'
          }
        },
        {
          id: 3,
          username: '王奶奶',
          password: 'password123',
          email: 'wang@example.com',
          phone: '13687654321',
          role: 'user',
          status: 'active',
          created_at: new Date().toISOString(),
          last_login: null,
          traffic_limit: 5368709120,
          traffic_used: 0,
          servers_access: [1],
          subscription_url: generateSubscriptionToken(),
          profile: {
            display_name: '王奶奶',
            avatar: 'https://via.placeholder.com/40',
            phone: '13687654321'
          }
        },
        {
          id: 4,
          username: '张医生',
          password: 'password123',
          email: 'zhang@example.com',
          phone: '13822221111',
          role: 'user',
          status: 'active',
          created_at: new Date().toISOString(),
          last_login: null,
          traffic_limit: 5368709120,
          traffic_used: 0,
          servers_access: [1],
          subscription_url: generateSubscriptionToken(),
          profile: {
            display_name: '张医生',
            avatar: 'https://via.placeholder.com/40',
            phone: '13822221111'
          }
        },
        {
          id: 5,
          username: '刘姨',
          password: 'password123',
          email: 'liu@example.com',
          phone: '13611112222',
          role: 'user',
          status: 'active',
          created_at: new Date().toISOString(),
          last_login: null,
          traffic_limit: 5368709120,
          traffic_used: 0,
          servers_access: [1],
          subscription_url: generateSubscriptionToken(),
          profile: {
            display_name: '刘姨',
            avatar: 'https://via.placeholder.com/40',
            phone: '13611112222'
          }
        }
      ];
      await fs.writeFile(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
    }
  } catch (err) {
    console.error('初始化数据目录失败:', err);
  }
}

// 辅助函数 - 读取JSON文件
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`读取文件失败 ${filePath}:`, err);
    return null;
  }
}

// 辅助函数 - 写入JSON文件
async function writeJsonFile(filePath, data) {
  try {
    // 确保data是一个有效的对象
    if (data === undefined || data === null) {
      throw new Error('无效的数据，不能为null或undefined');
    }
    
    // 创建目录（如果不存在）
    const dirPath = path.dirname(filePath);
    await fs.mkdir(dirPath, { recursive: true });
    
    // 使用utf8编码写入JSON文件
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), { encoding: 'utf8' });
    return true;
  } catch (err) {
    console.error(`写入文件失败 ${filePath}:`, err);
    return false;
  }
}

// 辅助函数 - 添加日志
async function addLog(level, message, details = '') {
  try {
    const logs = await readJsonFile(LOGS_FILE) || [];
    const newLog = {
      id: Date.now().toString(),
      level,
      message,
      details,
      created_at: new Date().toISOString()
    };
    logs.unshift(newLog); // 添加到开头
    
    // 只保留最近100条日志
    const trimmedLogs = logs.slice(0, 100);
    await writeJsonFile(LOGS_FILE, trimmedLogs);
    return newLog;
  } catch (err) {
    console.error('添加日志失败:', err);
    return null;
  }
}

// 创建模拟流量数据
function generateTrafficData() {
  const now = new Date();
  const timePoints = [];
  const uploadData = [];
  const downloadData = [];
  
  // 生成过去24小时的数据点，每小时一个
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(now.getHours() - i);
    timePoints.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
    // 生成随机流量数据 (1-100 MB)
    uploadData.push(Math.floor(Math.random() * 100) + 1);
    downloadData.push(Math.floor(Math.random() * 100) + 1);
  }
  
  return {
    time: timePoints,
    upload: uploadData,
    download: downloadData
  };
}

// 生成订阅令牌
function generateSubscriptionToken() {
  return Array.from({ length: 24 }, () => 
    Math.floor(Math.random() * 36).toString(36)
  ).join('');
}

// 创建 Express 应用
const app = express();
const PORT = process.env.PORT || 5000;

// 中间件配置
app.use(cors());
app.use(express.json());

// 验证token的中间件
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: '未授权，请先登录'
    });
  }
  
  // 获取token
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: '未授权，请先登录'
    });
  }
  
  try {
    // 简化的token验证（实际项目应使用JWT等方式）
    // 目前只是从token解析出用户ID
    const decodedToken = Buffer.from(token, 'base64').toString().split(':')[0];
    const userId = parseInt(decodedToken);
    
    if (isNaN(userId)) {
      return res.status(401).json({
        success: false,
        message: '无效的token'
      });
    }
    
    // 将用户ID存储在请求对象中
    req.userId = userId;
    next();
  } catch (error) {
    console.error('Token验证失败:', error);
    return res.status(401).json({
      success: false,
      message: '无效的token'
    });
  }
}

// 添加调试中间件 - 注意：放在express.json()后面，确保请求体已解析
app.use((req, res, next) => {
  const originalSend = res.send;
  const originalJson = res.json;
  const startTime = Date.now();
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - 开始`);
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('请求体:', JSON.stringify(req.body));
  }
  
  // 重写json方法以记录响应
  res.json = function(data) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - 响应:`, JSON.stringify(data));
    console.log(`请求处理时间: ${Date.now() - startTime}ms`);
    return originalJson.call(this, data);
  };
  
  // 重写send方法以记录响应
  res.send = function(data) {
    if (typeof data === 'string' && data.startsWith('{')) {
      try {
        const jsonData = JSON.parse(data);
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - 响应:`, JSON.stringify(jsonData));
      } catch (e) {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - 响应: [非JSON数据]`);
      }
    } else {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - 响应: [非JSON数据]`);
    }
    console.log(`请求处理时间: ${Date.now() - startTime}ms`);
    return originalSend.call(this, data);
  };
  
  next();
});

// 初始化数据目录
ensureDataDir().then(() => {
  console.log('数据目录初始化完成');
}).catch(err => {
  console.error('数据目录初始化失败:', err);
});

// 基本API路由
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'online',
      serverTime: new Date().toISOString(),
      version: '1.0.0'
    }
  });
});

app.get('/api/users', (req, res) => {
  // 模拟数据
  const users = [
    { id: 1, name: '张三', email: 'zhangsan@example.com', created_at: new Date().toISOString() },
    { id: 2, name: '李四', email: 'lisi@example.com', created_at: new Date().toISOString() }
  ];
  
  res.json({
    success: true,
    data: users
  });
});

// 管理API路由

// 获取仪表盘数据
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    const servers = await readJsonFile(SERVERS_FILE) || [];
    
    // 模拟仪表盘数据
    const dashboardData = {
      userCount: 127,
      newUsersCount: 24,
      systemInfo: {
        version: '1.0.0',
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    };
    
    res.json({
      success: true,
      data: dashboardData
    });
    
    // 记录访问日志
    await addLog('info', '访问仪表盘', '管理员查看了系统仪表盘');
  } catch (error) {
    console.error('获取仪表盘数据失败:', error);
    res.status(500).json({
      success: false,
      message: '获取仪表盘数据失败',
      error: error.message
    });
  }
});

// 获取流量数据
app.get('/api/admin/traffic', (req, res) => {
  try {
    const trafficData = generateTrafficData();
    
    res.json({
      success: true,
      data: trafficData
    });
  } catch (error) {
    console.error('获取流量数据失败:', error);
    res.status(500).json({
      success: false,
      message: '获取流量数据失败',
      error: error.message
    });
  }
});

// 获取系统日志
app.get('/api/admin/logs', async (req, res) => {
  try {
    const logs = await readJsonFile(LOGS_FILE) || [];
    
    res.json({
      success: true,
      data: logs
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

// 获取系统设置
app.get('/api/admin/settings', async (req, res) => {
  try {
    const settings = await readJsonFile(SETTINGS_FILE) || {};
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('获取系统设置失败:', error);
    res.status(500).json({
      success: false,
      message: '获取系统设置失败',
      error: error.message
    });
  }
});

// 更新系统设置
app.post('/api/admin/settings', async (req, res) => {
  try {
    const newSettings = req.body;
    
    if (!newSettings || typeof newSettings !== 'object') {
      return res.status(400).json({
        success: false,
        message: '无效的设置数据'
      });
    }
    
    const result = await writeJsonFile(SETTINGS_FILE, newSettings);
    
    if (result) {
      await addLog('info', '更新系统设置', JSON.stringify(newSettings));
      
      res.json({
        success: true,
        message: '设置已更新',
        data: newSettings
      });
    } else {
      throw new Error('写入设置文件失败');
    }
  } catch (error) {
    console.error('更新系统设置失败:', error);
    res.status(500).json({
      success: false,
      message: '更新系统设置失败',
      error: error.message
    });
  }
});

// 服务器管理API

// 获取所有服务器
app.get('/api/admin/servers', async (req, res) => {
  try {
    const servers = await readJsonFile(SERVERS_FILE) || [];
    
    res.json({
      success: true,
      data: servers
    });
  } catch (error) {
    console.error('获取服务器列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取服务器列表失败',
      error: error.message
    });
  }
});

// 添加新服务器
app.post('/api/admin/servers', async (req, res) => {
  try {
    const newServer = req.body;
    const servers = await readJsonFile(SERVERS_FILE) || [];
    
    // 验证必需字段
    if (!newServer.name || !newServer.protocol || !newServer.port) {
      return res.status(400).json({
        success: false,
        message: '缺少必需字段'
      });
    }
    
    // 生成ID
    const maxId = servers.reduce((max, server) => Math.max(max, server.id), 0);
    newServer.id = maxId + 1;
    
    // 添加默认值
    if (!newServer.traffic) newServer.traffic = { upload: 0, download: 0 };
    
    servers.push(newServer);
    
    const result = await writeJsonFile(SERVERS_FILE, servers);
    
    if (result) {
      await addLog('info', '添加服务器', `添加了新服务器: ${newServer.name} (${newServer.protocol}, ${newServer.port})`);
      
      res.json({
        success: true,
        message: '服务器已添加',
        data: newServer
      });
    } else {
      throw new Error('写入服务器数据失败');
    }
  } catch (error) {
    console.error('添加服务器失败:', error);
    res.status(500).json({
      success: false,
      message: '添加服务器失败',
      error: error.message
    });
  }
});

// 更新服务器
app.put('/api/admin/servers/:id', async (req, res) => {
  try {
    const serverId = parseInt(req.params.id);
    const updatedServer = req.body;
    const servers = await readJsonFile(SERVERS_FILE) || [];
    
    const serverIndex = servers.findIndex(server => server.id === serverId);
    
    if (serverIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '服务器不存在'
      });
    }
    
    // 合并更新数据
    servers[serverIndex] = { ...servers[serverIndex], ...updatedServer };
    
    const result = await writeJsonFile(SERVERS_FILE, servers);
    
    if (result) {
      await addLog('info', '更新服务器', `更新了服务器: ${servers[serverIndex].name} (ID: ${serverId})`);
      
      res.json({
        success: true,
        message: '服务器已更新',
        data: servers[serverIndex]
      });
    } else {
      throw new Error('写入服务器数据失败');
    }
  } catch (error) {
    console.error('更新服务器失败:', error);
    res.status(500).json({
      success: false,
      message: '更新服务器失败',
      error: error.message
    });
  }
});

// 删除服务器
app.delete('/api/admin/servers/:id', async (req, res) => {
  try {
    const serverId = parseInt(req.params.id);
    const servers = await readJsonFile(SERVERS_FILE) || [];
    
    const serverIndex = servers.findIndex(server => server.id === serverId);
    
    if (serverIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '服务器不存在'
      });
    }
    
    const serverName = servers[serverIndex].name;
    servers.splice(serverIndex, 1);
    
    const result = await writeJsonFile(SERVERS_FILE, servers);
    
    if (result) {
      await addLog('warn', '删除服务器', `删除了服务器: ${serverName} (ID: ${serverId})`);
      
      res.json({
        success: true,
        message: '服务器已删除'
      });
    } else {
      throw new Error('写入服务器数据失败');
    }
  } catch (error) {
    console.error('删除服务器失败:', error);
    res.status(500).json({
      success: false,
      message: '删除服务器失败',
      error: error.message
    });
  }
});

// 切换服务器状态
app.post('/api/admin/servers/:id/toggle', async (req, res) => {
  try {
    const serverId = parseInt(req.params.id);
    const { status } = req.body;
    const servers = await readJsonFile(SERVERS_FILE) || [];
    
    const serverIndex = servers.findIndex(server => server.id === serverId);
    
    if (serverIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '服务器不存在'
      });
    }
    
    servers[serverIndex].status = !!status;
    
    const result = await writeJsonFile(SERVERS_FILE, servers);
    
    if (result) {
      await addLog('info', '切换服务器状态', 
        `服务器 ${servers[serverIndex].name} (ID: ${serverId}) 状态已切换为 ${status ? '启用' : '禁用'}`);
      
      res.json({
        success: true,
        message: `服务器已${status ? '启用' : '禁用'}`,
        data: servers[serverIndex]
      });
    } else {
      throw new Error('写入服务器数据失败');
    }
  } catch (error) {
    console.error('切换服务器状态失败:', error);
    res.status(500).json({
      success: false,
      message: '切换服务器状态失败',
      error: error.message
    });
  }
});

// 重置服务器流量
app.post('/api/admin/servers/:id/reset-traffic', async (req, res) => {
  try {
    const serverId = parseInt(req.params.id);
    const servers = await readJsonFile(SERVERS_FILE) || [];
    
    const serverIndex = servers.findIndex(server => server.id === serverId);
    
    if (serverIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '服务器不存在'
      });
    }
    
    servers[serverIndex].traffic = { upload: 0, download: 0 };
    
    const result = await writeJsonFile(SERVERS_FILE, servers);
    
    if (result) {
      await addLog('info', '重置服务器流量', `重置了服务器 ${servers[serverIndex].name} (ID: ${serverId}) 的流量统计`);
      
      res.json({
        success: true,
        message: '服务器流量已重置',
        data: servers[serverIndex]
      });
    } else {
      throw new Error('写入服务器数据失败');
    }
  } catch (error) {
    console.error('重置服务器流量失败:', error);
    res.status(500).json({
      success: false,
      message: '重置服务器流量失败',
      error: error.message
    });
  }
});

// 修改Xray订阅API，加入管理端令牌认证
app.get('/api/subscription', async (req, res) => {
  try {
    const { token } = req.query;
    
    // 简单验证令牌
    if (token !== 'a4b72e9c0f31d5a7b8e9') {
      return res.status(403).json({
        success: false,
        message: '无效的访问令牌'
      });
    }

    const servers = await readJsonFile(SERVERS_FILE) || [];
    
    // 仅获取启用的服务器
    const activeServers = servers.filter(server => server.status);
    
    // 生成Base64编码的订阅内容
    const subscriptionContent = activeServers.map(server => {
      const id = `a3482e88-686a-4a58-8126-99c9df64b7${server.id.toString().padStart(2, '0')}`;
      
      // 生成服务器链接 (示例格式，实际格式根据协议可能不同)
      return `${server.protocol}://${Buffer.from(JSON.stringify({
        id,
        name: server.name,
        port: server.port,
        protocol: server.protocol
      })).toString('base64')}`;
    }).join('\n');
    
    // 返回Base64编码的订阅内容
    res.setHeader('Content-Type', 'text/plain');
    res.send(Buffer.from(subscriptionContent).toString('base64'));
    
    // 记录访问日志
    await addLog('info', '访问订阅', `IP: ${req.ip}`);
  } catch (error) {
    console.error('获取订阅失败:', error);
    res.status(500).json({
      success: false,
      message: '获取订阅失败',
      error: error.message
    });
  }
});

// 用户管理API

// 获取所有用户
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await readJsonFile(USERS_FILE) || [];
    
    // 移除密码字段后返回数据
    const safeUsers = users.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
    
    res.json({
      success: true,
      data: safeUsers
    });
    
    await addLog('info', '获取用户列表', '管理员查看所有用户');
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户列表失败',
      error: error.message
    });
  }
});

// 创建新用户
app.post('/api/admin/users', async (req, res) => {
  try {
    const userData = req.body;
    const users = await readJsonFile(USERS_FILE) || [];
    
    // 验证必填字段
    if (!userData.username || !userData.password || !userData.email || !userData.phone) {
      return res.status(400).json({
        success: false,
        message: '用户名、密码、邮箱和手机号为必填项'
      });
    }
    
    // 检查用户名是否已存在
    if (users.some(user => user.username === userData.username)) {
      return res.status(400).json({
        success: false,
        message: '用户名已存在'
      });
    }

    // 检查手机号是否已存在
    if (users.some(user => 
      user.phone === userData.phone || user.profile?.phone === userData.phone)) {
      return res.status(400).json({
        success: false,
        message: '手机号已被注册'
      });
    }
    
    // 生成用户ID
    const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);
    
    // 处理servers_access字段，确保是数组
    let serversAccess = [];
    if (userData.servers_access) {
      if (Array.isArray(userData.servers_access)) {
        serversAccess = userData.servers_access;
      } else if (typeof userData.servers_access === 'string' && userData.servers_access.trim()) {
        serversAccess = userData.servers_access
          .split(',')
          .map(id => parseInt(id.trim()))
          .filter(id => !isNaN(id));
      } else if (typeof userData.servers_access === 'number') {
        serversAccess = [userData.servers_access];
      }
    }
    
    // 创建新用户
    const newUser = {
      id: maxId + 1,
      username: userData.username,
      password: userData.password, // 实际应用中应加密
      email: userData.email,
      phone: userData.phone,
      role: userData.role || 'user',
      status: userData.status || 'active',
      created_at: new Date().toISOString(),
      last_login: null,
      traffic_limit: userData.traffic_limit || 5368709120, // 5GB默认
      traffic_used: 0,
      servers_access: serversAccess,
      subscription_url: generateSubscriptionToken(),
      profile: {
        display_name: userData.profile?.display_name || userData.username,
        avatar: userData.profile?.avatar || '',
        phone: userData.phone // 始终使用主phone字段
      }
    };
    
    users.push(newUser);
    
    const result = await writeJsonFile(USERS_FILE, users);
    
    if (result) {
      await addLog('info', '创建用户', `管理员创建了新用户: ${newUser.username}`);
      
      // 不返回密码
      const { password, ...safeUser } = newUser;
      
      res.status(201).json({
        success: true,
        message: '用户创建成功',
        data: safeUser
      });
    } else {
      throw new Error('写入用户数据失败');
    }
  } catch (error) {
    console.error('创建用户失败:', error);
    res.status(500).json({
      success: false,
      message: '创建用户失败',
      error: error.message
    });
  }
});

// 更新用户
app.put('/api/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    const users = await readJsonFile(USERS_FILE) || [];
    
    // 检查用户是否存在
    const userIndex = users.findIndex(user => user.id === parseInt(id));
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 如果提供了用户名，检查是否被其他用户使用
    if (userData.username) {
      if (users.some((user, index) => 
        user.username === userData.username && index !== userIndex
      )) {
        return res.status(400).json({
          success: false,
          message: '用户名已存在'
        });
      }
    }
    
    // 如果提供了手机号，检查是否被其他用户使用
    if (userData.phone) {
      if (users.some((user, index) => 
        (user.phone === userData.phone || 
         user.profile?.phone === userData.phone) && 
        index !== userIndex
      )) {
        return res.status(400).json({
          success: false,
          message: '手机号已被注册'
        });
      }
    }
    
    // 处理servers_access字段，确保是数组
    if (userData.servers_access) {
      let serversAccess = [];
      if (Array.isArray(userData.servers_access)) {
        serversAccess = userData.servers_access;
      } else if (typeof userData.servers_access === 'string' && userData.servers_access.trim()) {
        serversAccess = userData.servers_access
          .split(',')
          .map(id => parseInt(id.trim()))
          .filter(id => !isNaN(id));
      } else if (typeof userData.servers_access === 'number') {
        serversAccess = [userData.servers_access];
      }
      userData.servers_access = serversAccess;
    }
    
    // 记录原始用户名和其他信息用于日志
    const originalUsername = users[userIndex].username;
    
    // 部分更新用户信息，只更新提供的字段
    const protectedFields = ['id', 'created_at']; // 这些字段不允许修改
    
    // 遍历请求中的所有字段
    Object.keys(userData).forEach(field => {
      // 跳过受保护的字段
      if (!protectedFields.includes(field) && userData[field] !== undefined) {
        if (field === 'profile') {
          // 特殊处理profile对象，合并而不是替换
          users[userIndex].profile = {
            ...users[userIndex].profile || {},
            ...userData.profile
          };
          
          // 如果更新了phone字段，同步更新profile中的phone
          if (userData.phone) {
            users[userIndex].profile.phone = userData.phone;
          }
        } else {
          // 更新其他普通字段
          users[userIndex][field] = userData[field];
        }
      }
    });
    
    // 确保profile字段存在
    if (!users[userIndex].profile) {
      users[userIndex].profile = {
        display_name: users[userIndex].username,
        avatar: '',
        phone: users[userIndex].phone || ''
      };
    }
    
    // 调试信息
    console.log(`正在更新用户: ID=${id}, 原用户名=${originalUsername}`);
    console.log('更新后的用户数据:', JSON.stringify(users[userIndex], null, 2));
    
    await writeJsonFile(USERS_FILE, users);
    
    // 记录操作日志
    await addLog('info', '更新用户', `用户 ${users[userIndex].username} (ID: ${id}) 已更新，原用户名: ${originalUsername}`);
    
    // 不返回密码
    const { password, ...safeUser } = users[userIndex];
    
    res.json({
      success: true,
      message: '用户已更新',
      data: safeUser
    });
  } catch (error) {
    console.error('更新用户失败:', error);
    res.status(500).json({
      success: false,
      message: '更新用户失败'
    });
  }
});

// 删除用户
app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const users = await readJsonFile(USERS_FILE) || [];
    
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    const username = users[userIndex].username;
    
    // 不允许删除最后一个管理员
    if (users[userIndex].role === 'admin' && 
        users.filter(user => user.role === 'admin').length === 1) {
      return res.status(400).json({
        success: false,
        message: '无法删除唯一的管理员账户'
      });
    }
    
    users.splice(userIndex, 1);
    
    const result = await writeJsonFile(USERS_FILE, users);
    
    if (result) {
      await addLog('warn', '删除用户', `管理员删除了用户: ${username} (ID: ${userId})`);
      
      res.json({
        success: true,
        message: '用户删除成功'
      });
    } else {
      throw new Error('写入用户数据失败');
    }
  } catch (error) {
    console.error('删除用户失败:', error);
    res.status(500).json({
      success: false,
      message: '删除用户失败',
      error: error.message
    });
  }
});

// 重置用户流量
app.post('/api/admin/users/:id/reset-traffic', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const users = await readJsonFile(USERS_FILE) || [];
    
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    users[userIndex].traffic_used = 0;
    
    const result = await writeJsonFile(USERS_FILE, users);
    
    if (result) {
      await addLog('info', '重置用户流量', `管理员重置了用户 ${users[userIndex].username} (ID: ${userId}) 的流量统计`);
      
      // 不返回密码
      const { password, ...safeUser } = users[userIndex];
      
      res.json({
        success: true,
        message: '用户流量已重置',
        data: safeUser
      });
    } else {
      throw new Error('写入用户数据失败');
    }
  } catch (error) {
    console.error('重置用户流量失败:', error);
    res.status(500).json({
      success: false,
      message: '重置用户流量失败',
      error: error.message
    });
  }
});

// 更新用户状态
app.post('/api/admin/users/:id/toggle-status', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { status } = req.body;
    const users = await readJsonFile(USERS_FILE) || [];
    
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    if (!['active', 'suspended', 'banned'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '无效的状态值，应为 active、suspended 或 banned'
      });
    }
    
    // 不允许禁用最后一个管理员
    if (users[userIndex].role === 'admin' && 
        status !== 'active' && 
        users.filter(user => user.role === 'admin' && user.status === 'active').length === 1) {
      return res.status(400).json({
        success: false,
        message: '无法禁用唯一的活跃管理员账户'
      });
    }
    
    users[userIndex].status = status;
    
    const result = await writeJsonFile(USERS_FILE, users);
    
    if (result) {
      const statusText = status === 'active' ? '激活' : status === 'suspended' ? '暂停' : '封禁';
      await addLog('info', '更新用户状态', `管理员将用户 ${users[userIndex].username} (ID: ${userId}) 的状态改为了${statusText}`);
      
      // 不返回密码
      const { password, ...safeUser } = users[userIndex];
      
      res.json({
        success: true,
        message: `用户已${statusText}`,
        data: safeUser
      });
    } else {
      throw new Error('写入用户数据失败');
    }
  } catch (error) {
    console.error('更新用户状态失败:', error);
    res.status(500).json({
      success: false,
      message: '更新用户状态失败',
      error: error.message
    });
  }
});

// 用户登录API
app.post('/api/auth/login', async (req, res) => {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] POST /api/auth/login - 开始`);
  try {
    const { phone, password } = req.body;
    console.log('请求体:', req.body);
    
    // 读取用户数据
    const users = await readJsonFile(USERS_FILE);
    
    // 查找用户
    const user = users.find(u => u.phone === phone && u.password === password);
    
    if (user) {
      // 生成令牌
      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // 返回用户信息和令牌（不包含密码）
      const { password, ...userInfo } = user;
      
      // 更新用户最后登录时间
      user.last_login = new Date().toISOString();
      await writeJsonFile(USERS_FILE, users);
      
      // 构建响应数据
      const responseData = {
        success: true,
        data: {
          token,
          user: userInfo
        }
      };
      
      // 保存响应数据用于日志记录
      res.locals.responseData = {
        success: true,
        message: '登录成功',
        userId: user.id
      };
      
      res.json(responseData);
    } else {
      res.json({
        success: false,
        message: '手机号或密码错误'
      });
    }
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      success: false,
      message: '登录失败'
    });
  }
  
  const endTime = Date.now();
  console.log(`[${new Date().toISOString()}] POST /api/auth/login - 响应: ${JSON.stringify(res.locals.responseData || {})}`);
  console.log(`请求处理时间: ${endTime - startTime}ms`);
});

// 用户注册
app.post('/api/auth/register', async (req, res) => {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] POST /api/auth/register - 开始`);
  try {
    const { username, phone, password, avatar = '' } = req.body;
    console.log('请求体:', req.body);
    
    // 检查必填字段
    if (!username || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: '姓名、手机号和密码为必填项'
      });
    }
    
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: '手机号格式不正确'
      });
    }
    
    // 验证密码长度
    if (password.length < 6 || password.length > 20) {
      return res.status(400).json({
        success: false,
        message: '密码长度应为6-20位'
      });
    }
    
    // 读取用户数据
    const users = await readJsonFile(USERS_FILE) || [];
    
    // 检查手机号是否已注册
    if (users.some(u => u.phone === phone)) {
      return res.status(400).json({
        success: false,
        message: '该手机号已被注册'
      });
    }
    
    // 生成新用户ID
    const newUserId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    
    // 创建新用户
    const newUser = {
      id: newUserId,
      username,
      password, // 实际应用中应对密码进行加密处理
      email: '',
      phone,
      role: 'user',
      status: 'active',
      created_at: new Date().toISOString(),
      last_login: null,
      traffic_limit: 5368709120, // 5GB 流量限制
      traffic_used: 0,
      servers_access: [1],
      subscription_url: generateSubscriptionToken(),
      profile: {
        display_name: username,
        avatar: avatar || 'https://via.placeholder.com/40',
        phone
      }
    };
    
    // 添加新用户
    users.push(newUser);
    
    // 保存用户数据
    await writeJsonFile(USERS_FILE, users);
    
    // 生成令牌
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // 返回用户信息和令牌（不包含密码）
    const { password: pwd, ...userInfo } = newUser;
    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        token,
        user: userInfo
      }
    });
    
    // 记录注册日志
    await addLog('info', `新用户注册: ${username}`, `ID: ${newUserId}, 手机号: ${phone}`);
    
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({
      success: false,
      message: '注册失败，请稍后再试'
    });
  }
  
  const endTime = Date.now();
  console.log(`[${new Date().toISOString()}] POST /api/auth/register - 响应: ${JSON.stringify(res.locals.responseData || {})}`);
  console.log(`请求处理时间: ${endTime - startTime}ms`);
});

// 获取用户信息
app.get('/api/auth/me', async (req, res) => {
  try {
    // 实际应用中应从请求头获取并验证token
    // 这里为了简化，从查询参数中获取用户ID
    const userId = parseInt(req.query.userId);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '未提供认证信息'
      });
    }
    
    const users = await readJsonFile(USERS_FILE) || [];
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 检查用户状态
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: '账户已被禁用'
      });
    }
    
    // 不返回密码
    const { password, ...safeUser } = user;
    
    res.json({
      success: true,
      data: safeUser
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败',
      error: error.message
    });
  }
});

// 用户订阅API
app.get('/api/user/subscription/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const users = await readJsonFile(USERS_FILE) || [];
    const user = users.find(u => u.subscription_url === token);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '订阅链接无效'
      });
    }
    
    // 检查用户状态
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: '账户已被禁用'
      });
    }
    
    const servers = await readJsonFile(SERVERS_FILE) || [];
    
    // 过滤用户可访问的、且状态为启用的服务器
    const accessibleServers = servers.filter(server => 
      server.status && user.servers_access.includes(server.id)
    );
    
    // 生成订阅内容
    const subscriptionContent = accessibleServers.map(server => {
      const id = `a3482e88-686a-4a58-8126-99c9df64b7${server.id.toString().padStart(2, '0')}`;
      
      // 配置中添加用户标识
      return `${server.protocol}://${Buffer.from(JSON.stringify({
        id,
        name: server.name,
        port: server.port,
        protocol: server.protocol,
        userId: user.id
      })).toString('base64')}`;
    }).join('\n');
    
    // 返回Base64编码的订阅内容
    res.setHeader('Content-Type', 'text/plain');
    res.send(Buffer.from(subscriptionContent).toString('base64'));
    
    // 记录访问日志
    await addLog('info', '访问用户订阅', `用户 ${user.username} (ID: ${user.id}) 访问了订阅`);
  } catch (error) {
    console.error('获取用户订阅失败:', error);
    res.status(500).json({
      success: false,
      message: '获取订阅失败',
      error: error.message
    });
  }
});

// 获取用户资料
app.get('/api/user/profile/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const users = await readJsonFile(USERS_FILE) || [];
    
    const user = users.find(user => user.id === userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 不返回敏感信息
    const { password, ...safeUser } = user;
    
    res.json({
      success: true,
      data: safeUser
    });
  } catch (error) {
    console.error('获取用户资料失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户资料失败',
      error: error.message
    });
  }
});

// 更新用户资料
app.put('/api/user/profile/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const profileData = req.body;
    const users = await readJsonFile(USERS_FILE) || [];
    
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 记录原始数据用于日志
    const originalUsername = users[userIndex].username;
    
    // 更新用户资料，保留未提供的字段
    // 分开处理profile对象和顶层字段
    if (profileData.profile) {
      users[userIndex].profile = {
        ...users[userIndex].profile,  // 保留原有profile字段
        ...profileData.profile         // 更新提供的profile字段
      };
    }
    
    // 如果有其他顶层字段，进行更新（除了敏感字段外）
    const sensitiveFields = ['id', 'password', 'created_at', 'role', 'traffic_limit', 'traffic_used', 'servers_access', 'subscription_url'];
    
    // 遍历请求中的所有字段
    Object.keys(profileData).forEach(field => {
      // 跳过profile字段(已单独处理)和敏感字段
      if (field !== 'profile' && !sensitiveFields.includes(field) && profileData[field] !== undefined) {
        users[userIndex][field] = profileData[field];
      }
    });
    
    // 如果有兴趣爱好字段，则更新
    if (profileData.interests) {
      users[userIndex].interests = profileData.interests;
    }
    
    // 记录日志并调试输出
    console.log(`正在更新用户资料: ID=${userId}, 原用户名=${originalUsername}`);
    console.log('更新后的用户数据:', JSON.stringify(users[userIndex], null, 2));
    
    const result = await writeJsonFile(USERS_FILE, users);
    
    if (result) {
      // 不返回密码
      const { password, ...safeUser } = users[userIndex];
      
      res.json({
        success: true,
        message: '用户资料已更新',
        data: safeUser
      });
    } else {
      throw new Error('写入用户数据失败');
    }
  } catch (error) {
    console.error('更新用户资料失败:', error);
    res.status(500).json({
      success: false,
      message: '更新用户资料失败',
      error: error.message
    });
  }
});

// 根据兴趣爱好生成个人简介
app.post('/api/user/generate-bio', async (req, res) => {
  try {
    const { user_id, interests } = req.body;
    
    if (!user_id || !interests || !Array.isArray(interests)) {
      return res.status(400).json({
        success: false,
        message: '无效的请求参数'
      });
    }
    
    // 生成简介的逻辑
    let bio = `我是一位热爱`;
    
    // 按兴趣度排序，先处理较高的兴趣度
    const sortedInterests = [...interests].sort((a, b) => b.level - a.level);
    
    // 获取兴趣分类和名称
    const categories = [...new Set(sortedInterests.map(interest => interest.category))];
    const highInterestNames = sortedInterests
      .filter(interest => interest.level >= 2)
      .map(interest => interest.name);
    
    // 生成简介
    if (categories.length > 0) {
      bio += categories.slice(0, 3).join('、');
      bio += '的人。';
    } else {
      bio += '生活的人。';
    }
    
    if (highInterestNames.length > 0) {
      bio += `特别喜欢${highInterestNames.slice(0, 5).join('、')}。`;
    }
    
    bio += '希望能在这里认识更多志同道合的朋友！';
    
    // 返回生成的简介
    res.json({
      success: true,
      data: { bio }
    });
  } catch (error) {
    console.error('生成个人简介失败:', error);
    res.status(500).json({
      success: false,
      message: '生成个人简介失败',
      error: error.message
    });
  }
});

// 保存聊天历史记录
app.post('/api/chat/history', async (req, res) => {
  try {
    const { user_id, messages, title } = req.body;
    
    if (!user_id || !messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: '无效的请求参数'
      });
    }
    
    // 读取现有的聊天历史记录
    let chatHistories = [];
    try {
      chatHistories = await readJsonFile(CHAT_HISTORY_FILE) || [];
    } catch (error) {
      // 如果文件不存在，则创建一个空数组
      chatHistories = [];
    }
    
    // 生成新的聊天历史记录ID
    const maxId = chatHistories.length > 0 
      ? Math.max(...chatHistories.map(history => history.id)) 
      : 0;
    
    // 创建新的聊天历史记录
    const newChatHistory = {
      id: maxId + 1,
      user_id,
      messages,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      title: title || `与AI助手的对话 - ${new Date().toLocaleString()}`
    };
    
    // 添加到历史记录列表
    chatHistories.push(newChatHistory);
    
    // 写入文件
    const result = await writeJsonFile(CHAT_HISTORY_FILE, chatHistories);
    
    if (result) {
      res.json({
        success: true,
        message: '聊天历史记录已保存',
        data: { id: newChatHistory.id }
      });
    } else {
      throw new Error('写入聊天历史记录失败');
    }
  } catch (error) {
    console.error('保存聊天历史记录失败:', error);
    res.status(500).json({
      success: false,
      message: '保存聊天历史记录失败',
      error: error.message
    });
  }
});

// 获取用户的聊天历史记录列表
app.get('/api/chat/history/user/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // 读取聊天历史记录
    const chatHistories = await readJsonFile(CHAT_HISTORY_FILE) || [];
    
    // 过滤出指定用户的聊天历史记录
    const userChatHistories = chatHistories.filter(history => history.user_id === userId);
    
    // 按更新时间倒序排序
    userChatHistories.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    
    res.json({
      success: true,
      data: userChatHistories
    });
  } catch (error) {
    console.error('获取聊天历史记录列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取聊天历史记录列表失败',
      error: error.message
    });
  }
});

// 获取特定聊天历史记录详情
app.get('/api/chat/history/:id', async (req, res) => {
  try {
    const chatId = parseInt(req.params.id);
    
    // 读取聊天历史记录
    const chatHistories = await readJsonFile(CHAT_HISTORY_FILE) || [];
    
    // 查找特定的聊天历史记录
    const chatHistory = chatHistories.find(history => history.id === chatId);
    
    if (!chatHistory) {
      return res.status(404).json({
        success: false,
        message: '聊天历史记录不存在'
      });
    }
    
    res.json({
      success: true,
      data: chatHistory
    });
  } catch (error) {
    console.error('获取聊天历史记录详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取聊天历史记录详情失败',
      error: error.message
    });
  }
});

// 删除聊天历史记录
app.delete('/api/chat/history/:id', async (req, res) => {
  try {
    const chatId = parseInt(req.params.id);
    
    // 读取聊天历史记录
    const chatHistories = await readJsonFile(CHAT_HISTORY_FILE) || [];
    
    // 查找特定的聊天历史记录索引
    const chatIndex = chatHistories.findIndex(history => history.id === chatId);
    
    if (chatIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '聊天历史记录不存在'
      });
    }
    
    // 删除记录
    chatHistories.splice(chatIndex, 1);
    
    // 写入文件
    const result = await writeJsonFile(CHAT_HISTORY_FILE, chatHistories);
    
    if (result) {
      res.json({
        success: true,
        message: '聊天历史记录已删除'
      });
    } else {
      throw new Error('写入聊天历史记录失败');
    }
  } catch (error) {
    console.error('删除聊天历史记录失败:', error);
    res.status(500).json({
      success: false,
      message: '删除聊天历史记录失败',
      error: error.message
    });
  }
});

// AI主动问候
app.get('/api/ai/greeting/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const users = await readJsonFile(USERS_FILE) || [];
    
    // 查找用户
    const user = users.find(user => user.id === userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 根据用户的登录时间、个人资料等生成个性化问候语
    const username = user.profile?.display_name || user.username;
    const lastLogin = user.last_login ? new Date(user.last_login) : null;
    const now = new Date();
    let greeting = '';
    
    // 根据时间生成不同的问候语
    const hour = now.getHours();
    if (hour >= 5 && hour < 12) {
      greeting = `早上好，${username}！`;
    } else if (hour >= 12 && hour < 18) {
      greeting = `下午好，${username}！`;
    } else {
      greeting = `晚上好，${username}！`;
    }
    
    // 根据上次登录时间添加内容
    if (lastLogin) {
      const daysDiff = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff > 7) {
        greeting += `好久不见了，很高兴您回来！`;
      } else if (daysDiff > 1) {
        greeting += `距离上次见面已经${daysDiff}天了。`;
      } else {
        greeting += `今天过得怎么样？`;
      }
    }
    
    // 添加问候的主要内容
    greeting += `\n\n我是您的AI助手，很想了解您的兴趣爱好，这样可以为您提供更贴心的服务。方便告诉我您喜欢做什么吗？`;
    
    res.json({
      success: true,
      data: {
        message: greeting
      }
    });
  } catch (error) {
    console.error('生成AI问候语失败:', error);
    res.status(500).json({
      success: false,
      message: '生成AI问候语失败',
      error: error.message
    });
  }
});

// 分析用户对话，提取兴趣爱好
app.post('/api/ai/analyze-interests', async (req, res) => {
  try {
    const { user_id, messages } = req.body;
    
    if (!user_id || !messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: '无效的请求参数'
      });
    }
    
    // 合并所有用户消息内容
    const userMessages = messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content)
      .join(' ');
    
    // 提取兴趣爱好的实现，使用更细致的匹配规则
    const interests = [];
    
    // 使用正则表达式进行更精确的匹配
    const containsKeyword = (text, keywords) => {
      for (const keyword of keywords) {
        const regex = new RegExp(`\\b${keyword}\\b|${keyword}`, 'i');
        if (regex.test(text)) return true;
      }
      return false;
    };
    
    // 计算匹配强度 - 出现多次或明确表达喜欢的关键词会获得更高的级别
    const getInterestLevel = (text, keywords, baseLevel = 2) => {
      let level = baseLevel;
      
      // 检查是否明确表达了喜欢
      const likePatterns = ['喜欢', '热爱', '爱好', '最爱', '最喜欢', '非常喜欢', '特别喜欢', '很喜欢'];
      for (const pattern of likePatterns) {
        for (const keyword of keywords) {
          if (text.includes(pattern + keyword)) {
            return 3; // 明确表达喜欢，最高级别
          }
        }
      }
      
      // 检查关键词出现次数
      let count = 0;
      for (const keyword of keywords) {
        const regex = new RegExp(keyword, 'gi');
        const matches = text.match(regex);
        if (matches) count += matches.length;
      }
      
      if (count >= 3) level = 3;
      
      return level;
    };
    
    // 添加兴趣的辅助函数
    const addInterest = (category, name, keywords, baseLevel = 2) => {
      if (containsKeyword(userMessages, keywords)) {
        const level = getInterestLevel(userMessages, keywords, baseLevel);
        interests.push({
          category,
          name,
          level
        });
        return true;
      }
      return false;
    };

    // 阅读类兴趣
    if (addInterest('阅读', '读书', ['阅读', '看书', '读书', '书籍', '书本', '书店', '图书馆'])) {
      // 具体书籍类型
      addInterest('阅读', '小说', ['小说', '故事书', '言情', '武侠', '科幻', '悬疑']);
      addInterest('阅读', '历史书籍', ['历史书', '历史书籍', '历史读物', '历史小说']);
      addInterest('阅读', '诗词', ['诗词', '古诗', '诗歌', '词牌', '唐诗', '宋词']);
      addInterest('阅读', '传记', ['传记', '名人传', '自传', '人物传记']);
      addInterest('阅读', '养生保健类书籍', ['养生书', '保健书', '健康书籍']);
    }
    
    // 运动类兴趣
    if (addInterest('运动', '健身', ['运动', '锻炼', '健身', '健身房', '体育活动', '健身操'])) {
      // 具体运动类型
      addInterest('运动', '太极拳', ['太极', '太极拳', '打太极']);
      addInterest('运动', '散步', ['散步', '走路', '遛弯', '慢走', '健走']);
      addInterest('运动', '广场舞', ['广场舞', '跳舞', '广场舞蹈']);
      addInterest('运动', '游泳', ['游泳', '水上运动', '游泳池']);
      addInterest('运动', '瑜伽', ['瑜伽', '瑜伽练习', '瑜伽馆']);
      addInterest('运动', '乒乓球', ['乒乓球', '打乒乓', '乒乓']);
      addInterest('运动', '下棋', ['象棋', '围棋', '国际象棋', '五子棋', '军棋', '跳棋', '下棋']);
      addInterest('运动', '打牌', ['打牌', '扑克', '麻将', '斗地主', '桥牌']);
    }
    
    // 娱乐类兴趣
    addInterest('娱乐', '看电影', ['电影', '看电影', '电影院', '观影', '影片']);
    addInterest('娱乐', '看电视', ['电视', '电视剧', '看电视', '连续剧', '剧集']);
    addInterest('娱乐', '听音乐', ['音乐', '听歌', '歌曲', '民乐', '古典音乐', '流行音乐']);
    addInterest('娱乐', '戏曲', ['戏曲', '京剧', '豫剧', '越剧', '黄梅戏', '评剧', '花鼓戏', '地方戏']);
    
    // 艺术类兴趣
    addInterest('艺术', '书法', ['书法', '写字', '毛笔字', '硬笔', '书写', '书画']);
    addInterest('艺术', '绘画', ['绘画', '画画', '水彩', '国画', '油画', '素描', '彩铅']);
    addInterest('艺术', '摄影', ['摄影', '拍照', '拍摄', '照相', '摄像']);
    addInterest('艺术', '手工艺', ['手工', '编织', '剪纸', '刺绣', '十字绣', '折纸', '布艺']);
    
    // 社交类兴趣
    addInterest('社交', '聊天', ['聊天', '社交', '交流', '聊天软件', '闲聊', '语音聊天']);
    addInterest('社交', '朋友聚会', ['聚会', '朋友聚会', '老友聚会', '同学聚会', '茶话会']);
    
    // 烹饪类兴趣
    addInterest('烹饪', '做饭', ['做饭', '烹饪', '烧菜', '厨艺', '煮饭', '下厨']);
    addInterest('烹饪', '烘焙', ['烘焙', '蛋糕', '面包', '饼干', '点心']);
    
    // 旅游类兴趣
    addInterest('旅游', '旅行', ['旅游', '旅行', '出游', '出门游玩', '观光', '度假']);
    addInterest('旅游', '采风', ['采风', '风光摄影', '自然风光', '风景']);
    
    // 园艺类兴趣
    addInterest('园艺', '种花', ['种花', '养花', '花卉', '园艺', '花草', '盆栽']);
    addInterest('园艺', '种菜', ['种菜', '菜园', '家庭农场', '阳台种菜', '蔬菜种植']);
    
    // 收藏类兴趣
    addInterest('收藏', '集邮', ['集邮', '邮票', '收集邮票']);
    addInterest('收藏', '收藏', ['收藏', '古董', '古玩', '字画', '钱币', '纪念币']);
    
    // 养生类兴趣
    addInterest('养生', '中医养生', ['养生', '中医', '保健', '按摩', '针灸', '拔罐', '刮痧']);
    addInterest('养生', '茶道', ['茶道', '品茶', '茶艺', '茶文化', '泡茶']);
    
    // 科技类兴趣
    addInterest('科技', '电脑', ['电脑', '计算机', '上网', '网页', '浏览器']);
    addInterest('科技', '智能手机', ['手机', '智能手机', '手机应用', 'APP', '应用程序']);
    
    // 音乐表演类兴趣
    addInterest('音乐', '唱歌', ['唱歌', 'K歌', '卡拉OK', '唱戏', '合唱团']);
    addInterest('音乐', '乐器演奏', ['演奏', '二胡', '古筝', '钢琴', '吉他', '乐器', '萨克斯', '琵琶', '笛子']);
    
    // 宠物类兴趣
    addInterest('宠物', '养宠物', ['宠物', '猫', '狗', '小猫', '小狗', '鱼缸', '观赏鱼', '乌龟', '鸟']);
    
    // 返回提取的兴趣爱好
    res.json({
      success: true,
      data: {
        interests
      }
    });
  } catch (error) {
    console.error('分析用户兴趣爱好失败:', error);
    res.status(500).json({
      success: false,
      message: '分析用户兴趣爱好失败',
      error: error.message
    });
  }
});

// 获取用户兴趣爱好收集的推荐问题
app.post('/api/ai/interest-questions', async (req, res) => {
  try {
    const { user_id, current_interests } = req.body;
    
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: '无效的请求参数'
      });
    }
    
    let questions = [];
    
    // 如果用户还没有兴趣爱好，提供一些通用问题
    if (!current_interests || current_interests.length === 0) {
      questions = [
        '您平时有哪些休闲活动或爱好呢？',
        '您喜欢什么类型的书籍或者电影？',
        '您有没有参加过什么有趣的社交活动？',
        '您在体育方面有什么爱好吗？比如散步或太极等。',
        '您有没有参加过一些社区组织的活动？',
        '您喜欢做饭或者烹饪吗？有什么拿手菜？',
        '您有收藏什么东西的习惯吗？比如邮票、纪念币等。',
        '您平时喜欢听什么类型的音乐？',
        '您对园艺或养花种草有兴趣吗？',
        '您养宠物吗？喜欢什么样的宠物？'
      ];
    } else {
      // 根据已有的兴趣爱好提供更具针对性的问题
      const categories = [...new Set(current_interests.map(interest => interest.category))];
      const interestNames = current_interests.map(interest => interest.name);
      
      // 针对已有的类别提问
      if (categories.includes('阅读')) {
        questions.push('您最近在读什么书呢？有什么推荐的好书吗？');
        questions.push('您更喜欢什么类型的书？是小说、历史还是传记？');
        questions.push('您有固定的阅读时间吗？一般在什么时候喜欢读书？');
        if (interestNames.includes('小说')) {
          questions.push('您喜欢哪位小说家的作品？有最喜欢的一部作品吗？');
        }
        if (interestNames.includes('历史书籍')) {
          questions.push('您对哪个历史时期最感兴趣？最近读了哪本历史书籍？');
        }
      }
      
      if (categories.includes('运动')) {
        questions.push('您经常进行哪些运动活动？一周会锻炼几次呢？');
        questions.push('您喜欢独自锻炼还是和朋友一起？');
        questions.push('运动对您的健康有什么积极影响吗？');
        
        if (interestNames.includes('太极拳')) {
          questions.push('您练习太极拳多久了？能分享一些太极拳的益处吗？');
        }
        if (interestNames.includes('广场舞')) {
          questions.push('您参加广场舞的频率是多少？喜欢跳什么风格的广场舞？');
        }
        if (interestNames.includes('散步')) {
          questions.push('您一般在什么时间散步？有固定的散步路线吗？');
        }
      }
      
      if (categories.includes('艺术')) {
        questions.push('您对哪种艺术形式最感兴趣？书法、绘画还是其他的？');
        questions.push('您是自学的还是参加过相关课程？');
        questions.push('您创作艺术作品的频率是多少？有没有特别满意的作品？');
        
        if (interestNames.includes('书法')) {
          questions.push('您习练哪种字体？是行书、楷书还是其他？');
        }
        if (interestNames.includes('绘画')) {
          questions.push('您喜欢用什么材料作画？水彩、油画还是国画？');
        }
      }
      
      if (categories.includes('娱乐')) {
        questions.push('您看电影/电视的频率是多少？一般在什么时间看？');
        questions.push('您最近看过什么好看的电影或电视剧？能推荐一下吗？');
        
        if (interestNames.includes('看电影')) {
          questions.push('您喜欢什么类型的电影？有最喜欢的导演或演员吗？');
        }
        if (interestNames.includes('戏曲')) {
          questions.push('您喜欢哪种戏曲？是京剧、豫剧还是其他地方戏？');
        }
      }
      
      if (categories.includes('烹饪')) {
        questions.push('您经常下厨吗？最拿手的菜是什么？');
        questions.push('您喜欢尝试新的菜谱吗？最近有学会什么新菜吗？');
        
        if (interestNames.includes('烘焙')) {
          questions.push('您喜欢烘焙什么食品？蛋糕、面包还是饼干？');
        }
      }
      
      if (categories.includes('旅游')) {
        questions.push('您最近去过哪些地方旅游？有什么难忘的经历吗？');
        questions.push('您有计划中的下一个旅行目的地吗？');
        questions.push('您更喜欢国内游还是国外游？喜欢什么样的旅游方式？');
      }
      
      if (categories.includes('园艺')) {
        questions.push('您种植了哪些花卉或植物？养护它们有什么窍门吗？');
        questions.push('您是在阳台上种植还是有专门的花园？');
        
        if (interestNames.includes('种菜')) {
          questions.push('您种植了哪些蔬菜？收获的成就感如何？');
        }
      }
      
      if (categories.includes('收藏')) {
        questions.push('您收藏这些物品多久了？收藏过程中有什么有趣的故事吗？');
        questions.push('您是如何开始这个收藏爱好的？');
      }
      
      if (categories.includes('养生')) {
        questions.push('您平时有哪些养生习惯？能分享一些养生心得吗？');
        questions.push('您是从什么时候开始关注养生的？');
        
        if (interestNames.includes('茶道')) {
          questions.push('您喜欢什么类型的茶？有特别喜欢的茶具吗？');
        }
      }
      
      if (categories.includes('音乐')) {
        questions.push('您喜欢什么风格的音乐？有最喜欢的歌手或乐队吗？');
        
        if (interestNames.includes('乐器演奏')) {
          questions.push('您演奏乐器多久了？能分享一下学习过程中的经历吗？');
        }
        if (interestNames.includes('唱歌')) {
          questions.push('您喜欢唱什么类型的歌曲？参加过合唱团或其他音乐活动吗？');
        }
      }
      
      if (categories.includes('宠物')) {
        questions.push('您养的宠物叫什么名字？能分享一些与它相处的趣事吗？');
        questions.push('养宠物给您的生活带来了什么变化？');
      }
      
      // 提供一些探索新兴趣的问题
      const missingCategories = [
        {category: '社交', question: '您平时参加社区活动吗？比如什么类型的活动？'},
        {category: '娱乐', question: '您平时如何放松自己？有看电视或电影的习惯吗？'},
        {category: '烹饪', question: '您喜欢下厨做饭吗？有什么拿手菜？'},
        {category: '旅游', question: '您喜欢旅游吗？有什么想去但还没去过的地方？'},
        {category: '园艺', question: '您对种花养草有兴趣吗？家里养了什么植物？'},
        {category: '收藏', question: '您有收藏什么物品的习惯吗？比如邮票、纪念币等。'},
        {category: '养生', question: '您平时有关注养生保健吗？有哪些养生习惯？'},
        {category: '科技', question: '您对智能手机或电脑使用得熟练吗？有没有感兴趣的APP或功能？'},
        {category: '音乐', question: '您喜欢听音乐或唱歌吗？喜欢什么类型的音乐？'},
        {category: '宠物', question: '您喜欢小动物吗？有没有想过养宠物？'}
      ];
      
      // 添加一些用户尚未涉及的类别的问题
      for (const item of missingCategories) {
        if (!categories.includes(item.category) && questions.length < 8) {
          questions.push(item.question);
        }
      }
      
      // 确保问题数量至少为3个，最多不超过10个
      if (questions.length < 3) {
        questions.push('还有什么其他的兴趣爱好想和我分享吗？');
        questions.push('您有没有想尝试但还没有机会尝试的新活动？');
        questions.push('您的朋友们都有哪些兴趣爱好？有没有您也想尝试的？');
      }
      
      // 如果问题太多，随机选择一部分
      if (questions.length > 10) {
        // 保留前3个针对性问题，其余随机选择
        const priorityQuestions = questions.slice(0, 3);
        const remainingQuestions = questions.slice(3);
        
        // 打乱剩余问题的顺序
        for (let i = remainingQuestions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [remainingQuestions[i], remainingQuestions[j]] = [remainingQuestions[j], remainingQuestions[i]];
        }
        
        // 组合最终的问题列表
        questions = [...priorityQuestions, ...remainingQuestions.slice(0, 7)];
      }
    }
    
    res.json({
      success: true,
      data: {
        questions
      }
    });
  } catch (error) {
    console.error('获取兴趣问题失败:', error);
    res.status(500).json({
      success: false,
      message: '获取兴趣问题失败',
      error: error.message
    });
  }
});

// 用户好友API
// 搜索用户
app.get('/api/users/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    console.log('收到搜索请求，搜索关键词:', query);
    
    if (!query || query.trim() === '') {
      console.log('搜索关键词为空，返回空结果');
      return res.json({
        success: true,
        data: []
      });
    }
    
    const users = await readJsonFile(USERS_FILE) || [];
    console.log('从数据库读取到用户数量:', users.length);
    
    // 搜索匹配的用户 (通过用户名或手机号)
    const searchResults = users
      .filter(user => 
        user.username.includes(query) || 
        user.phone.includes(query) ||
        (user.profile?.display_name && user.profile.display_name.includes(query))
      )
      .map(user => {
        // 不返回敏感信息
        const { password, ...safeUser } = user;
        return {
          id: safeUser.id,
          username: safeUser.username,
          phone: safeUser.phone,
          avatar: safeUser.profile?.avatar || '',
          display_name: safeUser.profile?.display_name || safeUser.username
        };
      });
    
    console.log(`搜索结果: 找到 ${searchResults.length} 个匹配用户`);
    if (searchResults.length > 0) {
      console.log('搜索结果第一项:', searchResults[0]);
    }
    
    res.json({
      success: true,
      data: searchResults
    });
  } catch (error) {
    console.error('搜索用户失败:', error);
    res.status(500).json({
      success: false,
      message: '搜索用户失败',
      error: error.message
    });
  }
});

// 获取好友关系
app.get('/api/friends/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    console.log(`获取用户 ${userId} 的好友关系`);
    
    // 读取用户数据
    const users = await readJsonFile(USERS_FILE) || [];
    // 读取好友关系数据
    const friendships = await readJsonFile(FRIENDSHIPS_FILE) || [];
    
    console.log(`读取到 ${friendships.length} 条好友关系记录`);
    
    // 筛选出与当前用户相关的好友关系
    const userFriendships = friendships.filter(
      f => f.user1 === userId || f.user2 === userId
    );
    
    console.log(`找到 ${userFriendships.length} 条与用户 ${userId} 相关的好友关系`);
    
    // 构建好友列表、待处理请求列表和已发送请求列表
    const friends = [];
    const pending = [];
    const requested = [];
    
    for (const friendship of userFriendships) {
      // 确定对方用户ID
      const otherUserId = friendship.user1 === userId ? friendship.user2 : friendship.user1;
      // 获取对方用户信息
      const otherUser = users.find(u => u.id === otherUserId);
      
      if (!otherUser) {
        console.error(`找不到用户 ${otherUserId} 的信息`);
        continue;
      }
      
      // 创建基本的用户信息对象
      const userInfo = {
        id: otherUser.id,
        username: otherUser.username,
        phone: otherUser.phone,
        avatar: otherUser.profile?.avatar || '',
        status: Math.random() > 0.5 ? 'online' : 'offline', // 随机在线状态
        lastSeen: '1小时前',
      };
      
      // 根据好友关系状态，添加到对应的列表中
      if (friendship.status === 'friends') {
        friends.push({
          ...userInfo,
          relationship: 'friend',
          tag: otherUser.profile?.tags || []
        });
      } else if (friendship.status === 'requested') {
        // 根据请求的发起方向，确定是待处理请求还是已发送请求
        if (friendship.user1 === userId) {
          // 当前用户发起的请求
          requested.push({
            ...userInfo,
            relationship: 'requested'
          });
        } else {
          // 当前用户收到的请求
          pending.push({
            ...userInfo,
            relationship: 'pending'
          });
        }
      }
    }
    
    console.log(`用户 ${userId} 的好友数量: ${friends.length}`);
    console.log(`用户 ${userId} 的待处理请求数量: ${pending.length}`);
    console.log(`用户 ${userId} 的已发送请求数量: ${requested.length}`);
    
    // 如果没有真实数据，添加一些模拟数据以便前端测试
    if (friends.length === 0 && pending.length === 0 && requested.length === 0) {
      console.log('没有找到真实的好友关系数据，使用模拟数据');
      
      // 使用模拟数据
      const friendsData = {
        friends: [
          { 
            id: 1, 
            username: '李大爷', 
            phone: '13912345678',
            avatar: '', 
            status: 'online',
            relationship: 'friend',
            tag: ['邻居', '老年活动']
          },
          { 
            id: 2, 
            username: '王奶奶', 
            phone: '13687654321',
            avatar: '', 
            status: 'offline', 
            lastSeen: '1小时前',
            relationship: 'friend',
            tag: ['健康群', '广场舞']
          }
        ],
        pending: [
          { 
            id: 5, 
            username: '张医生', 
            phone: '13822221111',
            avatar: '', 
            status: 'online',
            relationship: 'pending',
            tag: ['医疗咨询']
          }
        ],
        requested: [
          { 
            id: 6, 
            username: '周老师', 
            phone: '13833332222',
            avatar: '', 
            status: 'offline',
            relationship: 'requested',
            lastSeen: '2小时前'
          }
        ]
      };
      
      res.json({
        success: true,
        data: friendsData
      });
    } else {
      // 返回真实数据
      res.json({
        success: true,
        data: {
          friends,
          pending,
          requested
        }
      });
    }
  } catch (error) {
    console.error('获取好友关系失败:', error);
    res.status(500).json({
      success: false,
      message: '获取好友关系失败',
      error: error.message
    });
  }
});

// 发送好友请求
app.post('/api/friends/request', async (req, res) => {
  try {
    const { userId, targetId } = req.body;
    console.log('收到好友请求:', { userId, targetId });
    
    if (!userId || !targetId) {
      return res.status(400).json({
        success: false,
        message: '缺少必需参数'
      });
    }
    
    // 将字符串转换为数字
    const userIdNum = parseInt(userId);
    const targetIdNum = parseInt(targetId);
    
    // 验证用户是否存在
    const users = await readJsonFile(USERS_FILE) || [];
    const sender = users.find(u => u.id === userIdNum);
    const receiver = users.find(u => u.id === targetIdNum);
    
    if (!sender || !receiver) {
      console.error(`用户不存在: sender=${!!sender}, receiver=${!!receiver}`);
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 检查是否已经是好友
    const friendships = await readJsonFile(FRIENDSHIPS_FILE) || [];
    const existingFriendship = friendships.find(
      f => (f.user1 === userIdNum && f.user2 === targetIdNum) || 
           (f.user1 === targetIdNum && f.user2 === userIdNum)
    );
    
    if (existingFriendship && existingFriendship.status === 'friends') {
      return res.status(400).json({
        success: false,
        message: '已经是好友关系'
      });
    }
    
    // 检查是否已经发送过请求
    const existingRequest = friendships.find(
      f => f.user1 === userIdNum && f.user2 === targetIdNum && f.status === 'requested'
    );
    
    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: '已经发送过好友请求'
      });
    }
    
    // 创建或更新好友请求记录
    if (existingFriendship) {
      existingFriendship.status = 'requested';
      existingFriendship.requestTime = new Date().toISOString();
    } else {
      friendships.push({
        id: friendships.length > 0 ? Math.max(...friendships.map(f => f.id)) + 1 : 1,
        user1: userIdNum,
        user2: targetIdNum,
        status: 'requested', // 'requested', 'accepted', 'rejected'
        requestTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      });
    }
    
    // 保存更新后的好友关系数据
    const saveResult = await writeJsonFile(FRIENDSHIPS_FILE, friendships);
    
    if (!saveResult) {
      throw new Error('保存好友请求失败');
    }
    
    console.log(`好友请求已保存: 用户${userIdNum}向用户${targetIdNum}发送请求`);
    
    res.json({
      success: true,
      message: '好友请求已发送',
      data: {
        status: 'requested'
      }
    });
  } catch (error) {
    console.error('发送好友请求失败:', error);
    res.status(500).json({
      success: false,
      message: '发送好友请求失败',
      error: error.message
    });
  }
});

// 接受好友请求
app.post('/api/friends/accept', async (req, res) => {
  try {
    const { userId, requestId } = req.body;
    console.log('接受好友请求:', { userId, requestId });
    
    if (!userId || !requestId) {
      return res.status(400).json({
        success: false,
        message: '缺少必需参数'
      });
    }
    
    // 将字符串转为数字
    const userIdNum = parseInt(userId);
    const requestIdNum = parseInt(requestId);
    
    // 验证用户是否存在
    const users = await readJsonFile(USERS_FILE) || [];
    const currentUser = users.find(u => u.id === userIdNum);
    const requester = users.find(u => u.id === requestIdNum);
    
    if (!currentUser || !requester) {
      console.error(`用户不存在: currentUser=${!!currentUser}, requester=${!!requester}`);
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 读取好友关系
    const friendships = await readJsonFile(FRIENDSHIPS_FILE) || [];
    
    // 查找对应的好友请求
    const requestIndex = friendships.findIndex(
      f => f.user1 === requestIdNum && f.user2 === userIdNum && f.status === 'requested'
    );
    
    if (requestIndex === -1) {
      console.error('未找到对应的好友请求');
      return res.status(404).json({
        success: false,
        message: '未找到对应的好友请求'
      });
    }
    
    // 更新好友关系状态为已接受
    friendships[requestIndex].status = 'friends';
    friendships[requestIndex].updateTime = new Date().toISOString();
    
    // 保存更新后的好友关系
    const saveResult = await writeJsonFile(FRIENDSHIPS_FILE, friendships);
    
    if (!saveResult) {
      throw new Error('保存好友关系失败');
    }
    
    console.log(`好友请求已接受: 用户${userIdNum}接受了用户${requestIdNum}的请求`);
    
    res.json({
      success: true,
      message: '已接受好友请求',
      data: {
        status: 'friend'
      }
    });
  } catch (error) {
    console.error('接受好友请求失败:', error);
    res.status(500).json({
      success: false,
      message: '接受好友请求失败',
      error: error.message
    });
  }
});

// 拒绝好友请求
app.post('/api/friends/reject', async (req, res) => {
  try {
    const { userId, requestId } = req.body;
    console.log('拒绝好友请求:', { userId, requestId });
    
    if (!userId || !requestId) {
      return res.status(400).json({
        success: false,
        message: '缺少必需参数'
      });
    }
    
    // 将字符串转为数字
    const userIdNum = parseInt(userId);
    const requestIdNum = parseInt(requestId);
    
    // 验证用户是否存在
    const users = await readJsonFile(USERS_FILE) || [];
    const currentUser = users.find(u => u.id === userIdNum);
    const requester = users.find(u => u.id === requestIdNum);
    
    if (!currentUser || !requester) {
      console.error(`用户不存在: currentUser=${!!currentUser}, requester=${!!requester}`);
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 读取好友关系
    const friendships = await readJsonFile(FRIENDSHIPS_FILE) || [];
    
    // 查找对应的好友请求
    const requestIndex = friendships.findIndex(
      f => f.user1 === requestIdNum && f.user2 === userIdNum && f.status === 'requested'
    );
    
    if (requestIndex === -1) {
      console.error('未找到对应的好友请求');
      return res.status(404).json({
        success: false,
        message: '未找到对应的好友请求'
      });
    }
    
    // 从好友关系表中删除该请求
    friendships.splice(requestIndex, 1);
    
    // 保存更新后的好友关系
    const saveResult = await writeJsonFile(FRIENDSHIPS_FILE, friendships);
    
    if (!saveResult) {
      throw new Error('保存好友关系失败');
    }
    
    console.log(`好友请求已拒绝: 用户${userIdNum}拒绝了用户${requestIdNum}的请求`);
    
    res.json({
      success: true,
      message: '已拒绝好友请求',
      data: {
        status: 'rejected'
      }
    });
  } catch (error) {
    console.error('拒绝好友请求失败:', error);
    res.status(500).json({
      success: false,
      message: '拒绝好友请求失败',
      error: error.message
    });
  }
});

// 取消好友请求
app.delete('/api/friends/request/:userId/:targetId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const targetId = parseInt(req.params.targetId);
    
    console.log(`取消好友请求: 用户${userId}取消向用户${targetId}发送的请求`);
    
    // 读取好友关系
    const friendships = await readJsonFile(FRIENDSHIPS_FILE) || [];
    
    // 查找对应的好友请求
    const requestIndex = friendships.findIndex(
      f => f.user1 === userId && f.user2 === targetId && f.status === 'requested'
    );
    
    if (requestIndex === -1) {
      console.error('未找到对应的好友请求');
      return res.status(404).json({
        success: false,
        message: '未找到对应的好友请求'
      });
    }
    
    // 从好友关系表中删除该请求
    friendships.splice(requestIndex, 1);
    
    // 保存更新后的好友关系
    const saveResult = await writeJsonFile(FRIENDSHIPS_FILE, friendships);
    
    if (!saveResult) {
      throw new Error('保存好友关系失败');
    }
    
    console.log(`好友请求已取消: 用户${userId}取消了向用户${targetId}发送的请求`);
    
    res.json({
      success: true,
      message: '已取消好友请求',
      data: {
        status: 'none'
      }
    });
  } catch (error) {
    console.error('取消好友请求失败:', error);
    res.status(500).json({
      success: false,
      message: '取消好友请求失败',
      error: error.message
    });
  }
});

// 删除好友
app.delete('/api/friends/:userId/:friendId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const friendId = parseInt(req.params.friendId);
    
    console.log(`删除好友: 用户${userId}删除好友${friendId}`);
    
    // 读取好友关系
    const friendships = await readJsonFile(FRIENDSHIPS_FILE) || [];
    
    // 查找对应的好友关系
    const friendshipIndex = friendships.findIndex(
      f => ((f.user1 === userId && f.user2 === friendId) || 
            (f.user1 === friendId && f.user2 === userId)) && 
           f.status === 'friends'
    );
    
    if (friendshipIndex === -1) {
      console.error('未找到对应的好友关系');
      return res.status(404).json({
        success: false,
        message: '未找到对应的好友关系'
      });
    }
    
    // 从好友关系表中删除该关系
    friendships.splice(friendshipIndex, 1);
    
    // 保存更新后的好友关系
    const saveResult = await writeJsonFile(FRIENDSHIPS_FILE, friendships);
    
    if (!saveResult) {
      throw new Error('保存好友关系失败');
    }
    
    console.log(`已删除好友关系: 用户${userId}已删除好友${friendId}`);
    
    res.json({
      success: true,
      message: '已删除好友',
      data: {
        status: 'none'
      }
    });
  } catch (error) {
    console.error('删除好友失败:', error);
    res.status(500).json({
      success: false,
      message: '删除好友失败',
      error: error.message
    });
  }
});

// 根路径响应
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>后端管理服务器</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          h1 { color: #333; }
          .container { max-width: 800px; margin: 0 auto; }
          .card { background: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          code { background: #e0e0e0; padding: 2px 4px; border-radius: 3px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>后端管理服务器已启动!</h1>
          <div class="card">
            <p>服务器状态: <strong>在线</strong></p>
            <p>服务器时间: ${new Date().toLocaleString()}</p>
            <p>版本: 1.0.0</p>
          </div>
          
          <div class="card">
            <h2>可用API端点:</h2>
            <table>
              <tr>
                <th>路径</th>
                <th>方法</th>
                <th>描述</th>
              </tr>
              <tr>
                <td><code>/api/status</code></td>
                <td>GET</td>
                <td>获取服务器状态</td>
              </tr>
              <tr>
                <td><code>/api/users</code></td>
                <td>GET</td>
                <td>获取用户列表</td>
              </tr>
              <tr>
                <td><code>/api/admin/dashboard</code></td>
                <td>GET</td>
                <td>获取管理仪表盘数据</td>
              </tr>
              <tr>
                <td><code>/api/admin/traffic</code></td>
                <td>GET</td>
                <td>获取流量统计数据</td>
              </tr>
              <tr>
                <td><code>/api/admin/logs</code></td>
                <td>GET</td>
                <td>获取系统日志</td>
              </tr>
              <tr>
                <td><code>/api/admin/settings</code></td>
                <td>GET</td>
                <td>获取系统设置</td>
              </tr>
              <tr>
                <td><code>/api/admin/settings</code></td>
                <td>POST</td>
                <td>更新系统设置</td>
              </tr>
              <tr>
                <td><code>/api/admin/servers</code></td>
                <td>GET</td>
                <td>获取所有服务器</td>
              </tr>
              <tr>
                <td><code>/api/admin/servers</code></td>
                <td>POST</td>
                <td>添加新服务器</td>
              </tr>
              <tr>
                <td><code>/api/admin/servers/:id</code></td>
                <td>PUT</td>
                <td>更新服务器</td>
              </tr>
              <tr>
                <td><code>/api/admin/servers/:id</code></td>
                <td>DELETE</td>
                <td>删除服务器</td>
              </tr>
              <tr>
                <td><code>/api/admin/servers/:id/toggle</code></td>
                <td>POST</td>
                <td>切换服务器状态</td>
              </tr>
              <tr>
                <td><code>/api/admin/servers/:id/reset-traffic</code></td>
                <td>POST</td>
                <td>重置服务器流量</td>
              </tr>
              <tr>
                <td><code>/api/subscription</code></td>
                <td>GET</td>
                <td>获取Xray订阅</td>
              </tr>
            </table>
          </div>
          
          <div class="card">
            <h2>管理面板访问:</h2>
            <p>前端管理面板: <a href="http://localhost:3000/admin" target="_blank">http://localhost:3000/admin</a></p>
            <p>完整仪表盘: <a href="http://localhost:3000/admin/dashboard" target="_blank">http://localhost:3000/admin/dashboard</a></p>
          </div>
        </div>
      </body>
    </html>
  `);
});

// 静态文件(如果有)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

// 添加远程服务配置指南
app.get('/api/remote-setup-guide', (req, res) => {
  res.json({
    title: '远程服务器配置指南',
    steps: [
      {
        title: '使用ngrok设置公网访问',
        content: '使用ngrok可以将本地Ollama服务暴露到公网，实现从任何地方访问您的本地大模型。',
        commands: [
          {
            description: '安装ngrok (如果尚未安装)',
            command: '访问 https://ngrok.com/download 下载并安装'
          },
          {
            description: '启动ngrok代理Ollama API (默认端口11434)',
            command: 'ngrok http 11434'
          },
          {
            description: '复制ngrok输出的转发URL',
            command: '例如: https://1234abcd.ngrok-free.app'
          }
        ]
      },
      {
        title: '启动本地Ollama服务',
        content: '确保Ollama服务在本地正常运行，且已下载所需的模型。',
        commands: [
          {
            description: '检查Ollama是否正在运行',
            command: 'ollama ps'
          },
          {
            description: '下载gemma3:12b模型 (如果尚未下载)',
            command: 'ollama pull gemma3:12b'
          }
        ]
      },
      {
        title: '连接到远程服务',
        content: '在AI牵伴应用的远程AI聊天页面中，输入您的ngrok URL并连接。',
        note: '注意：请勿将您的ngrok URL分享给不信任的人，否则他们将可以访问您的Ollama服务。'
      }
    ]
  });
}); 