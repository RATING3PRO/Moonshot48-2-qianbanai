# 牵伴 - 老年社交应用

一个专门为老年人设计的社交应用，提供简单易用的界面和丰富的功能，帮助老年人融入数字社交生活。

## 主要功能

### 社交功能
- 👥 好友系统
  - 添加和管理好友
  - 查看好友在线状态
  - 好友推荐
- 💬 即时聊天
  - 文本消息
  - 表情包支持
  - 图片分享（开发中）
  - 语音消息（开发中）
- 👥 群组功能
  - 创建兴趣群组
  - 群组聊天
  - 群组活动组织

### 智能助手
- 🤖 AI 聊天助手
  - 支持多种AI模型
  - 智能对话
  - 生活建议
- 🌤️ 天气服务
  - 实时天气信息
  - 天气预报
- 📰 新闻资讯
  - 每日新闻推送
  - 分类浏览
  - 兴趣推荐

### 社区功能
- 🏘️ 邻里社交
  - 发现附近邻居
  - 线下活动组织
- 🎯 兴趣小组
  - 基于兴趣匹配
  - 组织线下活动
- 💪 健康管理
  - 健康知识分享
  - 运动打卡

## 技术栈

### 前端
- React 18
- TypeScript
- Ant Design Mobile
- Vite
- Capacitor（移动端）

### 后端
- Node.js
- Express
- Supabase
- WebSocket

### AI 集成
- Hugging Face API
- Google AI API
- WebLLM

## 开始使用

### 环境要求
- Node.js 16+
- npm 7+
- Git

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/xieyouming-Web/Moonshot48-2-qianbanai.git
cd Moonshot48-2-qianbanai
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
```
然后编辑 .env 文件，填入必要的配置信息：
- API Keys（Hugging Face、和风天气、Google AI、News API）
- Supabase 配置
- 数据库配置
- JWT 密钥

4. 启动开发服务器
```bash
npm run dev
```

5. 构建生产版本
```bash
npm run build
```

### 移动端开发

1. 安装 Capacitor
```bash
npm install @capacitor/core @capacitor/cli
```

2. 添加平台
```bash
npx cap add android  # Android
npx cap add ios     # iOS
```

3. 同步代码
```bash
npx cap sync
```

## 项目结构
src/
├── components/ # 可复用组件
├── pages/ # 页面组件
├── services/ # 服务层
│ ├── ai/ # AI 服务
│ ├── chat/ # 聊天服务
│ └── user/ # 用户服务
├── utils/ # 工具函数
├── styles/ # 样式文件
└── App.tsx # 应用入口


## 环境变量说明

必需的环境变量：
- `HUGGINGFACE_API_TOKEN`: Hugging Face API 密钥
- `WEATHER_API_KEY`: 和风天气 API 密钥
- `GOOGLE_AI_API_KEY`: Google AI API 密钥
- `NEWS_API_KEY`: News API 密钥
- `VITE_SUPABASE_URL`: Supabase 项目 URL
- `VITE_SUPABASE_ANON_KEY`: Supabase 匿名密钥

可选的环境变量：
- `PORT`: 服务器端口（默认：5000）
- `NODE_ENV`: 运行环境（development/production）
- `JWT_SECRET`: JWT 加密密钥
- `ADMIN_PASSWORD`: 管理员密码

## 开发指南

### 代码规范
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 TypeScript 严格模式

### 提交规范
提交信息格式：
<type>(<scope>): <subject>
<body>
type 类型：
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 格式
- refactor: 重构
- test: 测试
- chore: 构建过程或辅助工具的变动

### 分支管理
- main: 主分支，用于发布
- develop: 开发分支
- feature/*: 功能分支
- hotfix/*: 紧急修复分支

## 部署

### 服务器要求
- Node.js 16+
- npm 7+
- PM2（推荐）

### 部署步骤
1. 克隆代码
2. 安装依赖
3. 配置环境变量
4. 构建项目
5. 使用 PM2 启动服务

详细部署文档请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 贡献指南

欢迎提交问题和改进建议！提交代码前请确保：
1. 代码通过所有测试
2. 遵循代码规范
3. 更新相关文档
4. 提供必要的测试用例

## 许可证

MIT

## 联系方式

如有问题或建议，请通过以下方式联系我们：
- 提交 Issue
- 发送邮件至：xiesmail2000@gmail.com
- 访问我们的网站:(https://github.com/xieyouming-Web/Moonshot48-2-qianbanai/edit/master/README.md)

## 开发团队

感谢M48-S2 Group7 全体成员提供的支持以及帮助
