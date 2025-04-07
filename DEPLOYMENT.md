# 部署指南

本文档提供了如何部署后端服务器和管理面板UI的详细说明。

## 环境要求

- Node.js 18.x 或更高版本
- npm 8.x 或更高版本
- 一个 Supabase 账户和项目

## 本地开发环境设置

1. 安装依赖：

```bash
npm install
```

2. 设置环境变量：

创建 `.env` 文件并包含以下内容：

```env
# Supabase配置
VITE_SUPABASE_URL=你的Supabase地址
VITE_SUPABASE_ANON_KEY=你的Supabase匿名密钥

# 服务器配置
PORT=3001
NODE_ENV=development
```

3. 同时运行前端和后端开发服务器：

```bash
npm run dev:all
```

这将启动两个服务：
- 前端开发服务器在 `http://localhost:5173`
- 后端API服务器在 `http://localhost:3001`

## 构建生产版本

1. 构建前端和后端：

```bash
npm run build:all
```

这将：
- 构建前端到 `dist` 目录
- 构建后端到 `dist/server` 目录

2. 测试生产构建：

```bash
npm start
```

服务器将在 `http://localhost:3001` 上运行，并提供前端静态文件。

## 部署到生产环境

### 选项 1: 传统服务器部署

1. 将构建后的文件上传到你的服务器：

```bash
scp -r dist/* user@your-server:/path/to/app
```

2. 安装生产依赖：

```bash
npm install --production
```

3. 启动服务器：

```bash
NODE_ENV=production node dist/server/index.js
```

推荐使用进程管理器如 PM2：

```bash
npm install -g pm2
pm2 start dist/server/index.js --name="admin-panel"
```

### 选项 2: Docker 部署

1. 创建 Dockerfile：

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY dist/ ./dist/

EXPOSE 3001

CMD ["node", "dist/server/index.js"]
```

2. 构建和运行 Docker 镜像：

```bash
docker build -t admin-panel .
docker run -p 3001:3001 -e NODE_ENV=production admin-panel
```

### 选项 3: 云平台部署

本应用可轻松部署到各种云平台：

#### Heroku

1. 安装 Heroku CLI 并登录
2. 创建应用：

```bash
heroku create your-app-name
git push heroku main
```

#### Vercel / Netlify

可以分别部署前端和后端：
- 前端可以直接部署 `dist` 目录
- 后端可以使用 Serverless 函数部署

## 访问管理面板

部署完成后，可以通过以下 URL 访问管理面板：

```
http://your-domain.com/admin
```

## 疑难解答

如果遇到部署问题，请检查：

1. 环境变量是否正确设置
2. 防火墙配置是否允许 3001 端口通过
3. 日志文件中是否有错误信息
4. Node.js 版本是否兼容 