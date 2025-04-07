import { supabase } from '../config/supabase';

// 用户类型定义
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  emergency_contact?: string;
  created_at?: string;
}

// 注册请求类型
export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

// 登录请求类型
export interface LoginRequest {
  email: string;
  password: string;
}

// 用户服务类
export class UserService {
  // 用户注册
  static async register(request: RegisterRequest): Promise<{ user: User | null; error: any }> {
    try {
      // 1. 创建认证用户
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: request.email,
        password: request.password,
      });

      if (authError) throw authError;
      
      // 如果注册成功但用户为null，可能是确认邮件已发送
      if (!authData.user) {
        return { 
          user: null, 
          error: { message: '注册成功，请检查邮箱完成验证' } 
        };
      }

      // 2. 创建用户资料
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: request.email,
          full_name: request.full_name || '',
        })
        .select()
        .single();

      if (profileError) throw profileError;

      return { user: profileData, error: null };
    } catch (error) {
      console.error('注册失败:', error);
      return { user: null, error };
    }
  }

  // 用户登录
  static async login(request: LoginRequest): Promise<{ user: User | null; error: any }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: request.email,
        password: request.password,
      });

      if (error) throw error;

      // 获取用户资料
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      return { user: profileData, error: null };
    } catch (error) {
      console.error('登录失败:', error);
      return { user: null, error };
    }
  }

  // 用户登出
  static async logout(): Promise<{ error: any }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('登出失败:', error);
      return { error };
    }
  }

  // 获取当前用户
  static async getCurrentUser(): Promise<{ user: User | null; error: any }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      if (!data.session) return { user: null, error: null };

      // 获取用户资料
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();

      if (profileError) throw profileError;

      return { user: profileData, error: null };
    } catch (error) {
      console.error('获取当前用户失败:', error);
      return { user: null, error };
    }
  }

  // 更新用户资料
  static async updateProfile(userId: string, profile: Partial<User>): Promise<{ user: User | null; error: any }> {
    try {
      // 确保不更新ID和邮箱
      delete profile.id;
      delete profile.email;
      
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { user: data, error: null };
    } catch (error) {
      console.error('更新用户资料失败:', error);
      return { user: null, error };
    }
  }

  // 上传头像
  static async uploadAvatar(userId: string, file: File): Promise<{ avatarUrl: string | null; error: any }> {
    try {
      // 生成唯一文件名
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // 上传文件到存储
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 获取文件公共URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 更新用户资料
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) throw updateError;

      return { avatarUrl: urlData.publicUrl, error: null };
    } catch (error) {
      console.error('上传头像失败:', error);
      return { avatarUrl: null, error };
    }
  }
} 