import { supabase } from '../config/supabase';

// 相册类型定义
export interface Album {
  id?: number;
  user_id: string;
  title: string;
  description?: string;
  cover_url?: string;
  created_at?: string;
  updated_at?: string;
}

// 照片类型定义
export interface Photo {
  id?: number;
  album_id: number;
  user_id: string;
  url: string;
  title?: string;
  description?: string;
  taken_at?: string;
  created_at?: string;
}

// 相册服务类
export class AlbumService {
  // 获取用户所有相册
  static async getUserAlbums(userId: string): Promise<Album[]> {
    try {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取相册列表失败:', error);
      throw error;
    }
  }

  // 获取单个相册详情
  static async getAlbum(albumId: number): Promise<Album | null> {
    try {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .eq('id', albumId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('获取相册详情失败:', error);
      throw error;
    }
  }

  // 创建新相册
  static async createAlbum(album: Album): Promise<Album> {
    try {
      const { data, error } = await supabase
        .from('albums')
        .insert(album)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('创建相册失败:', error);
      throw error;
    }
  }

  // 更新相册
  static async updateAlbum(id: number, album: Partial<Album>): Promise<Album> {
    try {
      const { data, error } = await supabase
        .from('albums')
        .update(album)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('更新相册失败:', error);
      throw error;
    }
  }

  // 删除相册
  static async deleteAlbum(id: number): Promise<void> {
    try {
      // 首先删除相册中的所有照片
      const { error: photosError } = await supabase
        .from('photos')
        .delete()
        .eq('album_id', id);
      
      if (photosError) throw photosError;

      // 然后删除相册
      const { error } = await supabase
        .from('albums')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('删除相册失败:', error);
      throw error;
    }
  }

  // 获取相册中的所有照片
  static async getAlbumPhotos(albumId: number): Promise<Photo[]> {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('album_id', albumId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取相册照片失败:', error);
      throw error;
    }
  }

  // 上传照片到相册
  static async uploadPhoto(albumId: number, userId: string, file: File, title?: string): Promise<Photo> {
    try {
      // 生成唯一文件名
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `photos/${fileName}`;

      // 上传文件到存储
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 获取文件公共URL
      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      // 创建照片记录
      const photoData: Photo = {
        album_id: albumId,
        user_id: userId,
        url: urlData.publicUrl,
        title: title || file.name,
      };

      const { data, error } = await supabase
        .from('photos')
        .insert(photoData)
        .select()
        .single();

      if (error) throw error;

      // 如果相册没有封面，将此照片设为封面
      const { data: albumData, error: albumError } = await supabase
        .from('albums')
        .select('cover_url')
        .eq('id', albumId)
        .single();

      if (albumError) {
        console.error('获取相册信息失败:', albumError);
      } else if (albumData && !albumData.cover_url) {
        await supabase
          .from('albums')
          .update({ cover_url: urlData.publicUrl })
          .eq('id', albumId);
      }

      return data;
    } catch (error) {
      console.error('上传照片失败:', error);
      throw error;
    }
  }

  // 删除照片
  static async deletePhoto(photoId: number): Promise<void> {
    try {
      // 获取照片信息，以便从存储中删除
      const { data: photoData, error: fetchError } = await supabase
        .from('photos')
        .select('url')
        .eq('id', photoId)
        .single();
      
      if (fetchError) throw fetchError;

      // 从数据库删除照片记录
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId);
      
      if (error) throw error;

      // 从URL提取文件路径
      // 注意: 此处假设URL格式，可能需要根据实际情况调整
      if (photoData && photoData.url) {
        const urlParts = photoData.url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        // 从存储中删除文件
        await supabase.storage
          .from('photos')
          .remove([`photos/${fileName}`]);
      }
    } catch (error) {
      console.error('删除照片失败:', error);
      throw error;
    }
  }
} 