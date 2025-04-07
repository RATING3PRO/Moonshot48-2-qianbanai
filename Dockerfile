FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装所有依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建前端和后端
RUN npm run build:all

# 清理开发依赖
RUN npm prune --production

# 暴露端口
EXPOSE 3001

# 设置环境变量
ENV NODE_ENV=production

# 运行应用
CMD ["node", "dist/server/index.js"] 