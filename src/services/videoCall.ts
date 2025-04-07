import { supabase } from '../config/supabase';

// 通话记录类型定义
export interface CallRecord {
  id?: number;
  caller_id: string;
  receiver_id: string;
  start_time: string;
  end_time?: string;
  status: 'missed' | 'answered' | 'rejected' | 'ongoing';
  call_type: 'video' | 'audio';
  created_at?: string;
}

// 通话状态类型定义
export interface CallStatus {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  status: 'calling' | 'connected' | 'ended';
  type: 'video' | 'audio';
  roomId?: string;
  startTime?: Date;
}

// 视频通话服务类
export class VideoCallService {
  // 获取用户的通话记录
  static async getUserCallHistory(userId: string): Promise<CallRecord[]> {
    try {
      const { data, error } = await supabase
        .from('call_records')
        .select(`
          *,
          caller:profiles!caller_id(full_name, avatar_url),
          receiver:profiles!receiver_id(full_name, avatar_url)
        `)
        .or(`caller_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取通话记录失败:', error);
      throw error;
    }
  }

  // 创建通话记录
  static async createCallRecord(record: CallRecord): Promise<CallRecord> {
    try {
      const { data, error } = await supabase
        .from('call_records')
        .insert(record)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('创建通话记录失败:', error);
      throw error;
    }
  }

  // 更新通话记录
  static async updateCallRecord(id: number, updates: Partial<CallRecord>): Promise<CallRecord> {
    try {
      const { data, error } = await supabase
        .from('call_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('更新通话记录失败:', error);
      throw error;
    }
  }

  // 结束通话，更新结束时间和状态
  static async endCall(id: number, status: 'missed' | 'answered' | 'rejected'): Promise<CallRecord> {
    try {
      const endTime = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('call_records')
        .update({
          end_time: endTime,
          status: status
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('结束通话记录失败:', error);
      throw error;
    }
  }

  // 获取在线用户列表（示例，实际可能需要实时数据库或WebSocket）
  static async getOnlineUsers(): Promise<{ id: string; full_name: string; avatar_url?: string }[]> {
    try {
      // 这里是演示用，实际应用中可能需要使用Supabase的实时订阅或其他实时服务
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, last_online')
        // 假设last_online字段表示用户最后在线时间，这里筛选10分钟内活跃的用户
        .gte('last_online', new Date(Date.now() - 10 * 60 * 1000).toISOString());
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取在线用户失败:', error);
      throw error;
    }
  }

  // 更新用户在线状态
  static async updateUserOnlineStatus(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          last_online: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) throw error;
    } catch (error) {
      console.error('更新用户在线状态失败:', error);
      throw error;
    }
  }

  // 创建通话房间（示例，实际会使用WebRTC或其他视频通话服务）
  static createCallRoom(callerId: string, receiverId: string, callType: 'video' | 'audio'): string {
    // 生成唯一房间ID
    const roomId = `${callerId}-${receiverId}-${Date.now()}`;
    
    // 此处应实际创建视频通话房间，可能需要调用第三方服务如Twilio、Agora等
    console.log(`创建${callType}通话房间: ${roomId}`);
    
    return roomId;
  }

  // 实时订阅用户的通话请求
  static subscribeToCallRequests(userId: string, callback: (call: CallRecord) => void) {
    return supabase
      .channel(`user-calls-${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'call_records',
        filter: `receiver_id=eq.${userId}`,
      }, payload => {
        // 当有新通话请求时调用回调函数
        callback(payload.new as CallRecord);
      })
      .subscribe();
  }

  // 更新通话状态到实时数据库（用于通知其他用户）
  static async updateCallRealtime(callStatus: CallStatus): Promise<void> {
    try {
      // 此处实际应用中可能使用Supabase实时功能或其他消息传递服务
      // 例如使用实时数据库存储和同步通话状态
      const { error } = await supabase
        .from('active_calls')
        .upsert({
          id: callStatus.id,
          user_id: callStatus.userId,
          display_name: callStatus.displayName,
          avatar_url: callStatus.avatarUrl,
          status: callStatus.status,
          type: callStatus.type,
          room_id: callStatus.roomId,
          start_time: callStatus.startTime?.toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('更新通话状态失败:', error);
      throw error;
    }
  }
} 