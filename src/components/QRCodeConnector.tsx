import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, Button, Paper, TextField, Switch, FormControlLabel, Divider } from '@mui/material';

// 修复 ImportMeta.env 的类型错误
declare global {
  interface ImportMeta {
    env: Record<string, any>;
  }
}

// 用于简化二维码绘制的函数
function generateQRCode(text: string, canvasRef: React.RefObject<HTMLCanvasElement>) {
  if (!canvasRef.current) return;
  
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 简单二维码绘制 - 实际应用中应使用专业库
  // 这里仅用简单方式展示
  ctx.fillStyle = '#FFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 显示提示信息，提醒需要集成专业QR库
  ctx.fillStyle = '#000';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('请扫描此二维码', canvas.width/2, 30);
  ctx.fillText('连接到AI服务', canvas.width/2, 50);
  
  // 在中间绘制URL文本
  ctx.font = '12px monospace';
  const lines = text.split('').reduce((acc, char, i) => {
    if (i % 20 === 0) acc.push(text.substring(i, i + 20));
    return acc;
  }, [] as string[]);
  
  lines.forEach((line, i) => {
    ctx.fillText(line, canvas.width/2, 80 + i * 16);
  });
  
  // 提示用户下载专业QR代码库
  ctx.font = '12px Arial';
  ctx.fillText('提示: 实际应用中请使用', canvas.width/2, 170);
  ctx.fillText('qrcode.react或其他QR库', canvas.width/2, 190);
}

interface QRCodeConnectorProps {
  title?: string;
  description?: string;
  defaultUrl?: string;
}

const QRCodeConnector: React.FC<QRCodeConnectorProps> = ({
  title = "扫码连接AI服务",
  description = "请使用手机扫描以下二维码，连接到AI对话服务",
  defaultUrl = ""
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [localURL, setLocalURL] = useState<string>('');
  const [customURL, setCustomURL] = useState<string>(defaultUrl || '');
  const [useCustomURL, setUseCustomURL] = useState<boolean>(!!defaultUrl);
  const [copied, setCopied] = useState(false);
  
  // 生成并设置URL
  useEffect(() => {
    if (useCustomURL && customURL) {
      setLocalURL(customURL);
      generateQRCode(customURL, canvasRef);
    } else {
      // 获取本地IP地址 (从Vite环境变量)
      const localIP = import.meta.env.VITE_LOCAL_IP || window.location.hostname;
      const port = window.location.port || '3000';
      const protocol = window.location.protocol;
      
      // 构建完整URL，指向远程AI页面
      const url = `${protocol}//${localIP}:${port}/remote-ai`;
      setLocalURL(url);
      
      // 生成二维码
      if (canvasRef.current) {
        generateQRCode(url, canvasRef);
      }
    }
  }, [useCustomURL, customURL]);
  
  // 处理自定义URL变更
  const handleCustomURLChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomURL(event.target.value);
  };
  
  // 更新二维码
  const updateQRCode = () => {
    if (canvasRef.current && customURL) {
      setLocalURL(customURL);
      generateQRCode(customURL, canvasRef);
    }
  };
  
  // 复制URL到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard.writeText(localURL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('复制失败:', err);
    });
  };
  
  return (
    <Card sx={{ maxWidth: 360, mx: 'auto', p: 2, borderRadius: 2 }}>
      <Typography variant="h6" component="h2" gutterBottom align="center">
        {title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph align="center">
        {description}
      </Typography>
      
      <FormControlLabel
        control={
          <Switch
            checked={useCustomURL}
            onChange={(e) => setUseCustomURL(e.target.checked)}
            color="primary"
          />
        }
        label="使用内网穿透地址"
        sx={{ mb: 2 }}
      />
      
      {useCustomURL && (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="输入内网穿透URL"
            variant="outlined"
            size="small"
            value={customURL}
            onChange={handleCustomURLChange}
            placeholder="例如: http://26.26.26.1:3000/remote-ai"
            sx={{ mb: 1 }}
          />
          <Button 
            variant="outlined" 
            color="primary"
            onClick={updateQRCode}
            fullWidth
          >
            更新二维码
          </Button>
          <Divider sx={{ my: 2 }} />
        </Box>
      )}
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          mx: 'auto', 
          mb: 2, 
          width: 210, 
          height: 210,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#f5f5f5'
        }}
      >
        <canvas 
          ref={canvasRef} 
          width="200" 
          height="200"
          style={{ width: '200px', height: '200px' }}
        />
      </Paper>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" align="center" gutterBottom sx={{ wordBreak: 'break-all' }}>
          {localURL}
        </Typography>
      </Box>
      
      <Button 
        variant="contained" 
        color="primary" 
        fullWidth
        onClick={copyToClipboard}
      >
        {copied ? '已复制' : '复制链接'}
      </Button>
    </Card>
  );
};

export default QRCodeConnector; 