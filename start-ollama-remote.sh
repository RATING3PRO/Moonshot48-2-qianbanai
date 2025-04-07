#!/bin/bash

# 颜色设置
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # 无颜色

# 显示标题
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}            AI牵伴 - 远程Ollama启动工具${NC}"
echo -e "${BLUE}==========================================================${NC}"
echo ""

# 检查ollama是否已经安装
if ! command -v ollama &> /dev/null; then
    echo -e "${RED}[错误] 未检测到Ollama，请先安装。${NC}"
    echo -e "请访问 https://ollama.com/download 下载并安装Ollama"
    echo ""
    read -p "按Enter键退出..."
    exit 1
fi

# 检查ngrok是否已经安装
if ! command -v ngrok &> /dev/null; then
    echo -e "${RED}[错误] 未检测到ngrok，请先安装。${NC}"
    echo -e "请访问 https://ngrok.com/download 下载并安装ngrok"
    echo ""
    read -p "按Enter键退出..."
    exit 1
fi

# 检查是否存在gemma3:12b模型
echo -e "${YELLOW}正在检查gemma3:12b模型...${NC}"
if ! ollama list | grep -q "gemma3:12b"; then
    echo -e "${YELLOW}[提示] 未找到gemma3:12b模型，是否下载？(Y/N)${NC}"
    read download_choice
    if [[ $download_choice == "Y" || $download_choice == "y" ]]; then
        echo -e "${GREEN}开始下载gemma3:12b模型（文件较大，请耐心等待）...${NC}"
        ollama pull gemma3:12b &
        echo -e "${GREEN}下载已在后台启动，将继续设置ngrok...${NC}"
    else
        echo -e "${YELLOW}跳过下载，将使用其他可用模型。${NC}"
    fi
fi

echo ""
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}步骤1: 启动ngrok (转发Ollama API端口11434)${NC}"
echo -e "${BLUE}==========================================================${NC}"
echo ""
echo -e "${GREEN}准备启动ngrok...${NC}"
echo -e "${YELLOW}请注意：ngrok窗口启动后，请复制"Forwarding"后面的URL链接(https://xxxx.ngrok-free.app)${NC}"
echo -e "${YELLOW}稍后您需要将该URL输入到AI牵伴应用的远程AI聊天设置中${NC}"
echo ""
echo -e "${GREEN}按Enter键启动ngrok...${NC}"
read

# 后台启动ngrok
gnome-terminal -- bash -c "ngrok http 11434 --log=stdout; read" 2>/dev/null || \
xterm -e "ngrok http 11434 --log=stdout; read" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "ngrok http 11434 --log=stdout"' 2>/dev/null || \
(ngrok http 11434 --log=stdout &)

echo ""
echo -e "${BLUE}==========================================================${NC}"
echo -e "${BLUE}步骤2: 确保Ollama服务正在运行${NC}"
echo -e "${BLUE}==========================================================${NC}"
echo ""

# 检查Ollama服务是否已经运行
if ! curl -s http://localhost:11434/api/tags &> /dev/null; then
    echo -e "${YELLOW}Ollama服务未运行，正在启动...${NC}"
    
    # 尝试在新终端窗口中启动ollama服务
    gnome-terminal -- bash -c "ollama serve; read" 2>/dev/null || \
    xterm -e "ollama serve; read" 2>/dev/null || \
    osascript -e 'tell app "Terminal" to do script "ollama serve"' 2>/dev/null || \
    (ollama serve &)
    
    echo -e "${YELLOW}等待Ollama服务启动...${NC}"
    sleep 5
else
    echo -e "${GREEN}Ollama服务已经在运行。${NC}"
fi

echo ""
echo -e "${BLUE}==========================================================${NC}"
echo -e "${GREEN}设置完成！请按照以下步骤操作：${NC}"
echo -e "${BLUE}==========================================================${NC}"
echo ""
echo -e "${YELLOW}1. 在ngrok窗口中找到\"Forwarding\"行，复制URL (https://xxxx.ngrok-free.app)${NC}"
echo -e "${YELLOW}2. 打开AI牵伴应用，进入"远程AI聊天"页面${NC}"
echo -e "${YELLOW}3. 点击设置，输入您复制的ngrok URL并连接${NC}"
echo -e "${YELLOW}4. 连接成功后，您可以在任何设备上通过该URL访问本地Ollama模型${NC}"
echo ""
echo -e "${RED}注意：${NC}"
echo -e "${RED}- 免费版ngrok连接有效期约为2小时${NC}"
echo -e "${RED}- 请勿将您的ngrok URL分享给不信任的人${NC}"
echo -e "${RED}- 关闭ngrok窗口将停止远程访问${NC}"
echo ""
echo -e "${GREEN}准备就绪！您现在可以使用AI牵伴应用的远程AI聊天功能了。${NC}"
echo ""
read -p "按Enter键退出此窗口..." 