/**
 * 服务器配置文件
 */
module.exports = {
  // 服务器端口
  port: process.env.PORT || 3001,
  
  // 环境设置
  environment: process.env.NODE_ENV || 'development',
  
  // 数据库配置
  database: {
    // Supabase配置在环境变量中
    useSupabase: true,
  },
  
  // 日志配置
  logs: {
    level: process.env.LOG_LEVEL || 'info',
    filename: 'server.log',
  },
  
  // CORS配置
  cors: {
    allowedOrigins: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  },
  
  // 安全配置
  security: {
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 100, // 每个IP限制100个请求
    },
    helmet: true, // 启用helmet安全头
  },
  
  // 静态文件配置
  static: {
    path: 'dist',
    cacheControl: 'public, max-age=86400',
  },
}; 