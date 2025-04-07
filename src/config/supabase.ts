import { createClient } from '@supabase/supabase-js';

// 由于我们没有实际的Supabase项目，这里使用占位URL和密钥
// 在实际使用时，创建Supabase账号后替换为真实URL和密钥
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 测试连接函数 - 确认Supabase是否正确配置
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('health_records').select('count');
    if (error) throw error;
    return { success: true, message: 'Supabase连接成功' };
  } catch (error) {
    console.error('Supabase连接测试失败:', error);
    return { 
      success: false, 
      message: `Supabase连接失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
}; 