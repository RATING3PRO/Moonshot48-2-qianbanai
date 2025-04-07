import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Button, Divider, List, ListItem, ListItemIcon, ListItemText, Tabs, Tab } from '@mui/material';
import { Link } from 'react-router-dom';
import QRCodeConnector from '../components/QRCodeConnector';
import WifiIcon from '@mui/icons-material/Wifi';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PublicIcon from '@mui/icons-material/Public';

// 标签页接口
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// 标签页内容组件
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`connection-tabpanel-${index}`}
      aria-labelledby={`connection-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const NetworkAccess: React.FC = () => {
  // 标签页状态
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button 
          component={Link} 
          to="/" 
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2 }}
        >
          返回首页
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          AI远程访问
        </Typography>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        通过局域网或内网穿透连接，让您的手机或平板电脑也能使用AI牵伴的智能对话功能，无需安装任何App！
      </Typography>
      
      {/* 切换标签 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="连接方式选择">
          <Tab label="局域网连接" />
          <Tab label="内网穿透连接" />
        </Tabs>
      </Box>
      
      {/* 局域网连接 */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
          <Box sx={{ flex: 1 }}>
            <QRCodeConnector 
              title="扫码连接AI服务"
              description="使用手机扫描二维码，通过局域网访问AI对话功能"
            />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                局域网连接指南
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <WifiIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="确保在同一网络" 
                    secondary="您的手机或平板电脑必须连接到与电脑相同的WiFi网络"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <SmartphoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="扫描二维码" 
                    secondary="使用相机应用扫描左侧二维码，或手动输入网址"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <HelpOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="遇到问题？" 
                    secondary="确保您的电脑防火墙允许局域网连接，或尝试重启路由器"
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary">
                注意：远程访问功能使用的是您电脑上的AI模型和资源，请确保电脑保持开启状态。
              </Typography>
            </Paper>
          </Box>
        </Box>
      </TabPanel>
      
      {/* 内网穿透连接 */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
          <Box sx={{ flex: 1 }}>
            <QRCodeConnector 
              title="内网穿透访问"
              description="通过公网地址访问您的AI服务"
              defaultUrl="http://26.26.26.1:3000/remote-ai"
            />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                内网穿透连接指南
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PublicIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="通过公网访问" 
                    secondary="使用内网穿透可以让您在任何地方访问家中的AI服务"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <SmartphoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="扫描二维码" 
                    secondary="确保预设的URL正确，扫描二维码连接到您的AI服务"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <HelpOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="需要配置内网穿透" 
                    secondary="建议使用Frp、Ngrok或花生壳等工具配置内网穿透服务"
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                注意：使用内网穿透功能时，请确保您的AI服务已正确穿透到公网，且URL地址正确配置。
              </Typography>
              
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                component="a"
                href="/docs/内网穿透配置指南.md"
                download="AI牵伴内网穿透配置指南.md"
                target="_blank"
              >
                下载内网穿透配置指南
              </Button>
            </Paper>
          </Box>
        </Box>
      </TabPanel>
      
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: '#f5f9ff', borderLeft: '4px solid #4f86f7' }}>
        <Typography variant="h6" gutterBottom>
          远程访问的优势
        </Typography>
        
        <Typography variant="body1" paragraph>
          远程访问AI服务允许多设备共享一台电脑上的AI大语言模型，不需要每台设备都下载庞大的模型文件，特别适合老年人使用：
        </Typography>
        
        <Box component="ul" sx={{ pl: 2 }}>
          <li>无需在手机上安装任何App</li>
          <li>直接通过手机浏览器访问</li>
          <li>共享电脑上的AI资源，节省手机存储空间</li>
          <li>保持家庭成员之间的数据与隐私安全</li>
          <li>通过内网穿透，可以在外出时也能随时访问家中的AI服务</li>
        </Box>
      </Paper>
    </Container>
  );
};

export default NetworkAccess; 