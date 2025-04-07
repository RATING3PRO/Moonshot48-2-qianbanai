# 后端服务器与管理面板

本项目提供了一个完整的后端服务器和管理面板UI，用于管理和监控应用系统。

## 功能特点

### 后端服务器
- Express框架构建的RESTful API
- Supabase数据库集成
- 用户认证和权限控制
- 系统状态监控
- 日志记录和查询
- 系统配置管理

### 管理面板UI
- 响应式设计，适配移动设备和桌面
- 用户统计和管理
- 系统状态监控
- 日志查看和分析
- 系统设置配置
- 安全登录和权限控制

## 项目结构

```
├── src/
│   ├── server/                # 后端服务器代码
│   │   ├── index.ts           # 服务器入口
│   │   ├── routes/            # API路由
│   │   │   ├── index.ts       # 主路由
│   │   │   └── admin.ts       # 管理员路由
│   │   └── middleware/        # 中间件
│   │       └── auth.ts        # 认证中间件
│   ├── pages/                 # 前端页面
│   │   ├── AdminPanel.tsx     # 简单管理面板
│   │   └── AdminDashboard.tsx # 详细管理仪表盘
│   └── ...
├── server.config.js           # 服务器配置
├── tsconfig.server.json       # 服务器TS配置
├── Dockerfile                 # Docker部署文件
└── DEPLOYMENT.md              # 部署指南
```

## 环境要求

- Node.js 18.x 或更高版本
- npm 8.x 或更高版本
- 一个 Supabase 账户和项目

## 安装和启动

1. 安装依赖：
```bash
npm install
```

2. 同时运行前端和后端开发服务器：
```bash
npm run dev:all
```

## 访问管理面板

开发环境：
- 简单管理面板: http://localhost:5173/admin
- 详细仪表盘: http://localhost:5173/admin/dashboard

生产环境：
- 简单管理面板: http://your-domain.com/admin
- 详细仪表盘: http://your-domain.com/admin/dashboard

## 管理员API接口

| 接口路径 | 方法 | 描述 | 权限 |
|---------|------|------|------|
| /api/status | GET | 获取系统状态 | 无 |
| /api/users | GET | 获取用户列表 | 无 |
| /api/admin/dashboard | GET | 获取管理仪表盘数据 | 管理员 |
| /api/admin/logs | GET | 获取系统日志 | 管理员 |
| /api/admin/settings | GET | 获取系统设置 | 管理员 |
| /api/admin/settings | POST | 更新系统设置 | 管理员 |

## 部署

详细的部署指南请参考 [DEPLOYMENT.md](DEPLOYMENT.md) 文件。

## 安全注意事项

- 确保在生产环境中使用HTTPS
- 定期更新依赖包以修复安全漏洞
- 使用环境变量存储敏感信息，而不是硬编码
- 为API添加速率限制，防止暴力攻击
- 实施适当的CORS策略

## 扩展和自定义

该项目设计为易于扩展和自定义：

1. 添加新的API路由：在 `src/server/routes/` 目录中创建新文件
2. 添加新的UI页面：在 `src/pages/` 目录中创建新组件
3. 修改配置：更新 `server.config.js` 文件

## 技术栈

- **后端**: Node.js, Express, TypeScript
- **数据库**: Supabase (PostgreSQL)
- **前端**: React, Ant Design Mobile
- **部署**: Docker, PM2