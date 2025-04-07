import { supabase } from '../config/supabase';

// 健康记录类型定义
export interface HealthRecord {
  id?: number;
  user_id: string;
  record_date: string;
  blood_pressure?: string;
  heart_rate?: number;
  blood_sugar?: number;
  weight?: number;
  temperature?: number;
  note?: string;
  created_at?: string;
}

// 健康记录服务类
export class HealthRecordService {
  // 获取用户所有健康记录
  static async getUserRecords(userId: string): Promise<HealthRecord[]> {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', userId)
        .order('record_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取健康记录失败:', error);
      throw error;
    }
  }

  // 获取单条健康记录
  static async getRecord(recordId: number): Promise<HealthRecord | null> {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('id', recordId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('获取健康记录详情失败:', error);
      throw error;
    }
  }

  // 创建新的健康记录
  static async createRecord(record: HealthRecord): Promise<HealthRecord> {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .insert(record)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('创建健康记录失败:', error);
      throw error;
    }
  }

  // 更新健康记录
  static async updateRecord(id: number, record: Partial<HealthRecord>): Promise<HealthRecord> {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .update(record)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('更新健康记录失败:', error);
      throw error;
    }
  }

  // 删除健康记录
  static async deleteRecord(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('health_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('删除健康记录失败:', error);
      throw error;
    }
  }

  // 按日期范围查询记录
  static async getRecordsByDateRange(
    userId: string, 
    startDate: string, 
    endDate: string
  ): Promise<HealthRecord[]> {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', userId)
        .gte('record_date', startDate)
        .lte('record_date', endDate)
        .order('record_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('按日期获取健康记录失败:', error);
      throw error;
    }
  }
} 