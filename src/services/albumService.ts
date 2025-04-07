// 相册服务 - 处理相册相关的数据操作

// 隐私设置类型
export enum PrivacySetting {
  PRIVATE = 'private',     // 仅自己可见
  FRIENDS = 'friends',     // 朋友可见
  PUBLIC = 'public'        // 所有人可见
}

// 共享状态类型
export enum ShareStatus {
  NOT_SHARED = 'not_shared',  // 未共享
  PENDING = 'pending',        // 等待接受
  ACCEPTED = 'accepted'       // 已接受
}

// 共享记录类型
export interface ShareRecord {
  id: string;
  albumId: string;
  sharedByUserId: string;
  sharedToUserId: string;
  status: ShareStatus;
  sharedAt: Date;
}

// 图片评论类型
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: Date;
}

// 图片类型
export interface Photo {
  id: string;
  userId: string;
  url: string;
  description: string;
  privacy: PrivacySetting;
  likes: string[]; // 用户ID数组
  comments: Comment[];
  createdAt: Date;
}

// 相册类型
export interface Album {
  id: string;
  userId: string;
  name: string;
  description: string;
  coverUrl: string;
  privacy: PrivacySetting;
  photos: Photo[];
  createdAt: Date;
}

// 模拟数据 - 实际项目中会从API获取
let albums: Album[] = [
  {
    id: '1',
    userId: 'user1',
    name: '家庭相册',
    description: '记录家庭美好时刻',
    coverUrl: 'https://via.placeholder.com/300',
    privacy: PrivacySetting.FRIENDS,
    photos: [
      {
        id: 'photo1',
        userId: 'user1',
        url: 'https://via.placeholder.com/800x600',
        description: '家庭聚餐',
        privacy: PrivacySetting.FRIENDS,
        likes: ['user2', 'user3'],
        comments: [
          {
            id: 'comment1',
            userId: 'user2',
            userName: '李奶奶',
            userAvatar: 'https://via.placeholder.com/50',
            content: '看起来很美味！',
            createdAt: new Date('2023-10-15')
          }
        ],
        createdAt: new Date('2023-10-10')
      },
      {
        id: 'photo2',
        userId: 'user1',
        url: 'https://via.placeholder.com/800x600',
        description: '公园散步',
        privacy: PrivacySetting.PUBLIC,
        likes: ['user2'],
        comments: [],
        createdAt: new Date('2023-10-12')
      }
    ],
    createdAt: new Date('2023-10-01')
  }
];

// 获取用户相册列表
export const getUserAlbums = (userId: string): Album[] => {
  return albums.filter(album => album.userId === userId);
};

// 获取单个相册详情
export const getAlbumById = (albumId: string): Album | undefined => {
  return albums.find(album => album.id === albumId);
};

// 创建新相册
export const createAlbum = (album: Omit<Album, 'id' | 'createdAt'>): Album => {
  const newAlbum: Album = {
    ...album,
    id: `album_${Date.now()}`,
    createdAt: new Date(),
  };
  
  albums.push(newAlbum);
  return newAlbum;
};

// 上传照片到相册
export const addPhotoToAlbum = (albumId: string, photo: Omit<Photo, 'id' | 'createdAt'>): Photo | null => {
  const albumIndex = albums.findIndex(album => album.id === albumId);
  
  if (albumIndex === -1) return null;
  
  const newPhoto: Photo = {
    ...photo,
    id: `photo_${Date.now()}`,
    createdAt: new Date(),
    likes: [],
    comments: []
  };
  
  albums[albumIndex].photos.push(newPhoto);
  return newPhoto;
};

// 更新照片隐私设置
export const updatePhotoPrivacy = (albumId: string, photoId: string, privacy: PrivacySetting): boolean => {
  const album = albums.find(album => album.id === albumId);
  if (!album) return false;
  
  const photoIndex = album.photos.findIndex(photo => photo.id === photoId);
  if (photoIndex === -1) return false;
  
  album.photos[photoIndex].privacy = privacy;
  return true;
};

// 点赞照片
export const likePhoto = (albumId: string, photoId: string, userId: string): boolean => {
  const album = albums.find(album => album.id === albumId);
  if (!album) return false;
  
  const photo = album.photos.find(photo => photo.id === photoId);
  if (!photo) return false;
  
  // 如果已经点赞，则取消点赞
  if (photo.likes.includes(userId)) {
    photo.likes = photo.likes.filter(id => id !== userId);
  } else {
    // 否则添加点赞
    photo.likes.push(userId);
  }
  
  return true;
};

// 评论照片
export const commentOnPhoto = (albumId: string, photoId: string, comment: Omit<Comment, 'id' | 'createdAt'>): Comment | null => {
  const album = albums.find(album => album.id === albumId);
  if (!album) return null;
  
  const photo = album.photos.find(photo => photo.id === photoId);
  if (!photo) return null;
  
  const newComment: Comment = {
    ...comment,
    id: `comment_${Date.now()}`,
    createdAt: new Date()
  };
  
  photo.comments.push(newComment);
  return newComment;
};

// 获取可见的照片（基于隐私设置）
export const getVisiblePhotos = (userId: string, viewerId: string): Photo[] => {
  const result: Photo[] = [];
  
  albums.forEach(album => {
    if (album.userId === userId) {
      // 如果是自己的相册，获取所有照片
      album.photos.forEach(photo => result.push(photo));
    } else {
      // 如果是他人相册，根据隐私设置过滤
      album.photos.forEach(photo => {
        if (
          photo.privacy === PrivacySetting.PUBLIC || 
          (photo.privacy === PrivacySetting.FRIENDS && isFriend(userId, viewerId))
        ) {
          result.push(photo);
        }
      });
    }
  });
  
  return result;
};

// 判断两个用户是否是朋友关系（模拟实现）
const isFriend = (userId1: string, userId2: string): boolean => {
  // 实际项目中，这里会调用API或查询数据库来判断朋友关系
  // 这里简单模拟：user1和user2是朋友关系
  return (userId1 === 'user1' && userId2 === 'user2') || 
         (userId1 === 'user2' && userId2 === 'user1');
};