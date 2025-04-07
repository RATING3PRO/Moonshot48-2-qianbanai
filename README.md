# AI牵伴

AI牵伴是一款专为老年人设计的智能社交应用。它通过简洁易用的界面、智能的AI辅助功能以及丰富的社交互动，帮助老年人融入数字世界，消除孤独感，维持社交联系，促进身心健康。

## 功能特点

- 基于现代Web技术构建的响应式用户界面
- 集成本地AI助手，基于WebLLM技术
- 支持连接远程Ollama API，体验更大的语言模型
- 集成Hugging Face API，免费使用云端大语言模型
- 社交功能：好友、群组、邻居
- 贴心为老年人设计的界面和功能
- 支持语音输入和朗读（开发中）
- 大字体模式
- 语音控制功能

## 技术栈

- **前端**：React, TypeScript, Vite, Antd Mobile
- **后端**：Node.js, Express
- **人工智能**：WebLLM, Ollama API, Hugging Face API
- **数据库**：SQLite (开发), MySQL (生产)
- **部署**：Docker, Nginx

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 使用说明

### 使用本地AI助手

本应用内置了轻量级AI模型，可以直接在浏览器中运行，无需连接互联网。

1. 打开应用后，点击底部导航栏中的"AI助手"按钮
2. 等待模型加载完成
3. 输入您的问题开始对话

### 使用远程Ollama AI（需本地安装Ollama）

如果您想体验更强大的AI模型，可以连接本地运行的Ollama服务。

1. 在本地安装并运行Ollama服务
2. 点击"远程AI"进入远程AI对话页面
3. 在设置中输入Ollama服务地址（默认为http://localhost:11434）
4. 选择已安装的模型，开始对话

### 使用Hugging Face云端大语言模型

无需安装任何软件，直接使用云端AI模型体验更强大的对话能力。

1. 点击首页的"云端AI"图标或导航至"/huggingface-chat"
2. 系统会自动连接Hugging Face API并加载可用模型
3. 可以选择不同的模型：
   - ChatGLM3-6B（中文为主）
   - Mistral-7B（英文为主）
   - BLOOM（多语言支持）
4. 等待连接成功后，输入问题开始对话

注意：Hugging Face API在首次使用某个模型时可能需要几分钟的加载时间，请耐心等待。为获得最佳体验，您可以注册自己的Hugging Face账号并获取API令牌，替换config/api.ts文件中的默认令牌。

## 推荐模型

### 本地WebLLM模型
- Gemma-2B（推荐用于低配置设备）

### Ollama模型
- Llama3:8B（平衡性能与质量）
- Gemma:7B（响应速度快）
- Mistral:7B（指令遵循能力强）

### Hugging Face模型
- THUDM/chatglm3-6b（中文对话优秀）
- mistralai/Mistral-7B-Instruct-v0.2（英文回答出色）
- bigscience/bloom（支持多种语言）

## 配置远程Ollama服务（高级）

如果您希望在其他设备上访问您的Ollama服务，可以使用ngrok进行配置：

1. 下载并安装ngrok
2. 启动ngrok隧道：`ngrok http 11434`
3. 复制生成的URL (格式如: `https://xxxx.ngrok.io`)
4. 在应用中连接此URL即可

## 开发者注意事项

1. 确保项目根目录中存在`.env`文件，包含必要的环境变量
2. 在生产环境中，设置适当的`NODE_ENV`环境变量
3. 考虑设置数据库备份
4. 进行生产环境部署前，彻底测试权限与安全策略

## 贡献指南

欢迎所有形式的贡献，包括但不限于：

- 功能请求和建议
- 代码贡献和修复
- 文档完善
- 测试用例

请通过提交Issue或Pull Request参与项目。

## 许可证

MIT