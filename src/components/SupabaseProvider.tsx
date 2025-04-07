import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { User } from '../services/user';
import { SpinLoading, Toast } from 'antd-mobile';

// 创建上下文类型
interface SupabaseContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateUserProfile: (profile: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

// 创建上下文
const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// 提供者组件
export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化 - 检查当前会话和用户
  useEffect(() => {
    const checkUser = async () => {
      try {
        setIsLoading(true);
        
        // 获取当前会话
        const { data: { session } } = await supabase.auth.getSession();
        
        // 如果有会话，获取用户资料
        if (session?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('获取用户资料失败:', error);
            setError('获取用户资料失败');
          } else {
            setUser(data);
          }
        }
      } catch (err) {
        console.error('初始化会话检查失败:', err);
        setError('会话检查失败');
      } finally {
        setIsLoading(false);
      }
    };

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // 用户登录时获取资料
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('获取用户资料失败:', error);
          setError('获取用户资料失败');
        } else {
          setUser(data);
        }
      } else if (event === 'SIGNED_OUT') {
        // 用户登出时清除状态
        setUser(null);
      }
    });

    // 初始检查
    checkUser();

    // 清理订阅
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 登录方法
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Toast.show({
          content: '登录失败: ' + error.message,
          position: 'bottom',
        });
        return { success: false, error: error.message };
      }

      // 获取用户资料
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        Toast.show({
          content: '获取用户信息失败',
          position: 'bottom',
        });
        return { success: true, error: '获取用户信息失败' };
      }

      setUser(profileData);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '登录过程中发生错误';
      Toast.show({
        content: errorMessage,
        position: 'bottom',
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // 注册方法
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setIsLoading(true);
      
      // 创建认证用户
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Toast.show({
          content: '注册失败: ' + error.message,
          position: 'bottom',
        });
        return { success: false, error: error.message };
      }

      // 如果注册成功但需要验证邮箱
      if (data?.user && !data.user.confirmed_at) {
        Toast.show({
          content: '注册成功，请检查邮箱完成验证',
          position: 'bottom',
        });
      }

      // 创建用户资料
      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            full_name: fullName,
          });

        if (profileError) {
          Toast.show({
            content: '创建用户资料失败',
            position: 'bottom',
          });
          return { success: true, error: '创建用户资料失败' };
        }

        // 获取创建的资料
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        setUser(profileData);
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '注册过程中发生错误';
      Toast.show({
        content: errorMessage,
        position: 'bottom',
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // 登出方法
  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsLoading(false);
  };

  // 更新用户资料
  const updateUserProfile = async (profile: Partial<User>) => {
    if (!user?.id) {
      return { success: false, error: '用户未登录' };
    }

    try {
      setIsLoading(true);
      
      // 确保不更新ID和邮箱
      const updateData = { ...profile };
      delete updateData.id;
      delete updateData.email;
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        Toast.show({
          content: '更新资料失败: ' + error.message,
          position: 'bottom',
        });
        return { success: false, error: error.message };
      }

      setUser(data);
      Toast.show({
        content: '资料更新成功',
        position: 'bottom',
      });
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新资料过程中发生错误';
      Toast.show({
        content: errorMessage,
        position: 'bottom',
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // 上下文值
  const value = {
    user,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
  };

  // 如果全局加载中，显示加载指示器
  if (isLoading && !user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <SpinLoading color='primary' />
        <div>加载中...</div>
      </div>
    );
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

// 自定义钩子，便于使用上下文
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase 必须在 SupabaseProvider 内部使用');
  }
  return context;
}; 