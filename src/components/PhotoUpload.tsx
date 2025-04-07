import React, { useState } from 'react';
import { ImageUploader, Dialog, Button, Toast } from 'antd-mobile';
import { ImageUploadItem } from 'antd-mobile/es/components/image-uploader';
import { PrivacySetting } from '../services/albumService';

const mockUpload = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    // 模拟上传耗时
    setTimeout(() => {
      const url = URL.createObjectURL(file);
      resolve(url);
    }, 1000);
  });
};

interface PhotoUploadProps {
  onUploadSuccess: (photos: { url: string; privacy: PrivacySetting }[]) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onUploadSuccess }) => {
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
  const [privacy, setPrivacy] = useState<PrivacySetting>(PrivacySetting.PRIVATE);
  const [uploading, setUploading] = useState(false);

  // 处理图片上传
  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await mockUpload(file);
      setUploading(false);
      return {
        url,
      };
    } catch (error) {
      Toast.show('上传失败');
      setUploading(false);
      return {
        url: '',
      };
    }
  };

  // 选择隐私设置
  const handleSelectPrivacy = () => {
    Dialog.show({
      title: '设置照片隐私权限',
      content: (
        <div>
          <Button
            color={privacy === PrivacySetting.PRIVATE ? 'primary' : 'default'}
            onClick={() => {
              setPrivacy(PrivacySetting.PRIVATE);
              Dialog.clear();
            }}
            block
            style={{ marginBottom: '8px' }}
          >
            仅自己可见
          </Button>
          <Button
            color={privacy === PrivacySetting.FRIENDS ? 'primary' : 'default'}
            onClick={() => {
              setPrivacy(PrivacySetting.FRIENDS);
              Dialog.clear();
            }}
            block
            style={{ marginBottom: '8px' }}
          >
            朋友可见
          </Button>
          <Button
            color={privacy === PrivacySetting.PUBLIC ? 'primary' : 'default'}
            onClick={() => {
              setPrivacy(PrivacySetting.PUBLIC);
              Dialog.clear();
            }}
            block
          >
            所有人可见
          </Button>
        </div>
      ),
      closeOnAction: true,
      closeOnMaskClick: true,
    });
  };

  // 提交上传
  const handleSubmit = () => {
    if (fileList.length === 0) {
      Toast.show('请先选择照片');
      return;
    }

    const photos = fileList.map(item => ({
      url: item.url,
      privacy,
    }));

    onUploadSuccess(photos);
    setFileList([]);
  };

  return (
    <div className="photo-upload-container">
      <div className="privacy-setting">
        <div className="privacy-label">隐私设置：</div>
        <Button 
          color="primary" 
          size="small" 
          onClick={handleSelectPrivacy}
        >
          {privacy === PrivacySetting.PRIVATE && '仅自己可见'}
          {privacy === PrivacySetting.FRIENDS && '朋友可见'}
          {privacy === PrivacySetting.PUBLIC && '所有人可见'}
        </Button>
      </div>
      
      <ImageUploader
        value={fileList}
        onChange={setFileList}
        upload={handleUpload}
        multiple
        maxCount={9}
        showUpload={fileList.length < 9}
        preview
      />
      
      {fileList.length > 0 && (
        <Button 
          block 
          color="primary" 
          onClick={handleSubmit} 
          loading={uploading}
          disabled={uploading}
          style={{ marginTop: '16px' }}
        >
          上传 ({fileList.length}张)
        </Button>
      )}
      
      <div className="upload-tips">
        提示：同一隐私级别的照片将一起上传，如需设置不同的隐私级别，请分批上传
      </div>
      
      <style>
        {`
          .photo-upload-container {
            padding: 16px;
            background-color: white;
            border-radius: 8px;
            margin-bottom: 16px;
          }
          
          .privacy-setting {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
          }
          
          .privacy-label {
            margin-right: 8px;
            color: #666;
          }
          
          .upload-tips {
            margin-top: 12px;
            font-size: 12px;
            color: #999;
            line-height: 1.5;
          }
        `}
      </style>
    </div>
  );
};

export default PhotoUpload; 