import { Request, Response, NextFunction } from 'express';
import { supabase } from '../index';

// 验证用户是否登录中间件
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 从请求头中获取授权令牌
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未授权，请登录'
      });
    }
    
    // 提取token
    const token = authHeader.split(' ')[1];
    
    // 验证token
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return res.status(401).json({
        success: false,
        message: '无效或过期的token',
        error: error?.message
      });
    }
    
    // 将用户信息添加到请求对象
    (req as any).user = data.user;
    
    // 继续处理请求
    next();
  } catch (error) {
    console.error('认证错误:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 检查管理员权限中间件
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 先进行基本的身份验证
    await requireAuth(req, res, async () => {
      // 检查用户是否有管理员角色
      const user = (req as any).user;
      
      // 从数据库获取用户角色
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      if (error || !data || data.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: '权限不足，需要管理员权限'
        });
      }
      
      // 用户有管理员权限，继续处理请求
      next();
    });
  } catch (error) {
    console.error('权限检查错误:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
}; 