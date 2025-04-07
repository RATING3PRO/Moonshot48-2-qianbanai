import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import apiRoutes from './routes.js';

// 获取当前文件目录（ESM中没有__dirname）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量
dotenv.config();

// 创建 Express 应用
const app = express();
const PORT = process.env.PORT || 3001;

// 配置 Supabase 客户端
const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY as string;
export const supabase = createClient(supabaseUrl, supabaseKey);

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API 路由
app.use('/api', apiRoutes);

// 前端静态文件（构建后的文件）
app.use(express.static(path.join(__dirname, '../../dist')));

// 所有未匹配的路由返回前端应用
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

export default app; 