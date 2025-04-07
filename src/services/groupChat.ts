import { supabase } from '../config/supabase';

// 群组类型定义
export interface Group {
  id?: number;
  name: string;
  description?: string;
  created_by: string;
  avatar_url?: string;
  created_at?: string;
}

// 群组成员类型定义
export interface GroupMember {
  id?: number;
  group_id: number;
  user_id: string;
  role: 'admin' | 'member';
  joined_at?: string;
  user?: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  };
}

// 消息类型定义
export interface ChatMessage {
  id?: number;
  group_id: number;
  user_id: string;
  content: string;
  image_url?: string;
  created_at?: string;
  user?: {
    full_name?: string;
    avatar_url?: string;
  };
}

// Supabase返回的群组成员数据类型
interface GroupMemberWithGroup {
  group: {
    id: number;
    name: string;
    description?: string;
    created_by: string;
    avatar_url?: string;
    created_at?: string;
  };
}

// 群聊服务类
export class GroupChatService {
  // 获取用户所在的所有群组
  static async getUserGroups(userId: string): Promise<Group[]> {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          group:groups(id, name, description, created_by, avatar_url, created_at)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      // 将嵌套结果转换为简单的群组数组
      if (!data) return [];
      
      const groups: Group[] = [];
      for (const item of data) {
        const memberWithGroup = item as unknown as GroupMemberWithGroup;
        if (memberWithGroup.group) {
          groups.push(memberWithGroup.group);
        }
      }
      
      return groups;
    } catch (error) {
      console.error('获取用户群组失败:', error);
      throw error;
    }
  }

  // 创建新群组
  static async createGroup(group: Group): Promise<Group> {
    try {
      // 创建群组
      const { data, error } = await supabase
        .from('groups')
        .insert(group)
        .select()
        .single();

      if (error) throw error;

      // 自动将创建者添加为管理员
      await supabase
        .from('group_members')
        .insert({
          group_id: data.id,
          user_id: group.created_by,
          role: 'admin'
        });

      return data;
    } catch (error) {
      console.error('创建群组失败:', error);
      throw error;
    }
  }

  // 添加成员到群组
  static async addMember(groupId: number, userId: string, role: 'admin' | 'member' = 'member'): Promise<void> {
    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: userId,
          role
        });

      if (error) throw error;
    } catch (error) {
      console.error('添加群组成员失败:', error);
      throw error;
    }
  }

  // 从群组移除成员
  static async removeMember(groupId: number, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('移除群组成员失败:', error);
      throw error;
    }
  }

  // 获取群组成员
  static async getGroupMembers(groupId: number): Promise<GroupMember[]> {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          *,
          user:profiles(id, full_name, avatar_url)
        `)
        .eq('group_id', groupId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取群组成员失败:', error);
      throw error;
    }
  }

  // 发送消息到群组
  static async sendMessage(message: ChatMessage): Promise<ChatMessage> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert(message)
        .select(`
          *,
          user:profiles(full_name, avatar_url)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('发送消息失败:', error);
      throw error;
    }
  }

  // 获取群组消息历史
  static async getGroupMessages(groupId: number, limit = 20, before?: number): Promise<ChatMessage[]> {
    try {
      let query = supabase
        .from('chat_messages')
        .select(`
          *,
          user:profiles(full_name, avatar_url)
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: false })
        .limit(limit);

      // 如果提供了before参数，则获取比此消息ID更早的消息
      if (before) {
        query = query.lt('id', before);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取群组消息失败:', error);
      throw error;
    }
  }

  // 上传图片消息
  static async uploadImageMessage(groupId: number, userId: string, file: File, content?: string): Promise<ChatMessage> {
    try {
      // 生成唯一文件名
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `chat_images/${fileName}`;

      // 上传文件到存储
      const { error: uploadError } = await supabase.storage
        .from('chat_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 获取文件公共URL
      const { data: urlData } = supabase.storage
        .from('chat_images')
        .getPublicUrl(filePath);

      // 创建消息记录
      const messageData: ChatMessage = {
        group_id: groupId,
        user_id: userId,
        content: content || '图片',
        image_url: urlData.publicUrl
      };

      return await this.sendMessage(messageData);
    } catch (error) {
      console.error('上传图片消息失败:', error);
      throw error;
    }
  }

  // 实时订阅群组新消息
  static subscribeToMessages(groupId: number, callback: (message: ChatMessage) => void) {
    return supabase
      .channel(`group-${groupId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `group_id=eq.${groupId}`
      }, (payload) => {
        // 需要额外获取用户信息，因为实时事件不包含关联数据
        this.getMessageWithUser(payload.new.id)
          .then(message => {
            if (message) callback(message);
          })
          .catch(error => console.error('获取消息用户信息失败:', error));
      })
      .subscribe();
  }

  // 获取包含用户信息的单条消息
  private static async getMessageWithUser(messageId: number): Promise<ChatMessage | null> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          user:profiles(full_name, avatar_url)
        `)
        .eq('id', messageId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('获取消息详情失败:', error);
      return null;
    }
  }
} 