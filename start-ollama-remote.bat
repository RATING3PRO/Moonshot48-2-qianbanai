@echo off
echo ==========================================================
echo        AI牵伴 - 远程Ollama启动工具
echo ==========================================================
echo.

REM 检查ollama是否已经安装
where ollama >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到Ollama，请先安装。
    echo 请访问 https://ollama.com/download 下载并安装Ollama
    echo.
    pause
    exit /b 1
)

REM 检查ngrok是否已经安装
where ngrok >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到ngrok，请先安装。
    echo 请访问 https://ngrok.com/download 下载并安装ngrok
    echo.
    pause
    exit /b 1
)

REM 检查是否存在gemma3:12b模型
echo 正在检查gemma3:12b模型...
ollama list | findstr "gemma3:12b" >nul
if %errorlevel% neq 0 (
    echo [提示] 未找到gemma3:12b模型，是否下载？(Y/N)
    set /p download_choice=
    if /i "%download_choice%"=="Y" (
        echo 开始下载gemma3:12b模型（文件较大，请耐心等待）...
        start /B ollama pull gemma3:12b
        echo 下载已在后台启动，将继续设置ngrok...
    ) else (
        echo 跳过下载，将使用其他可用模型。
    )
)

echo.
echo ==========================================================
echo 步骤1: 启动ngrok (转发Ollama API端口11434)
echo ==========================================================
echo.
echo 准备启动ngrok...
echo 请注意：ngrok窗口启动后，请复制"Forwarding"后面的URL链接(https://xxxx.ngrok-free.app)
echo 稍后您需要将该URL输入到AI牵伴应用的远程AI聊天设置中
echo.
echo 按任意键启动ngrok...
pause >nul

start "ngrok - AI牵伴远程转发" ngrok http 11434 --log=stdout

echo.
echo ==========================================================
echo 步骤2: 确保Ollama服务正在运行
echo ==========================================================
echo.

REM 检查Ollama服务是否已经运行
curl -s http://localhost:11434/api/tags >nul
if %errorlevel% neq 0 (
    echo Ollama服务未运行，正在启动...
    start "Ollama服务" ollama serve
    echo 等待Ollama服务启动...
    timeout /t 5 /nobreak >nul
) else (
    echo Ollama服务已经在运行。
)

echo.
echo ==========================================================
echo 设置完成！请按照以下步骤操作：
echo ==========================================================
echo.
echo 1. 在ngrok窗口中找到"Forwarding"行，复制URL (https://xxxx.ngrok-free.app)
echo 2. 打开AI牵伴应用，进入"远程AI聊天"页面
echo 3. 点击设置，输入您复制的ngrok URL并连接
echo 4. 连接成功后，您可以在任何设备上通过该URL访问本地Ollama模型
echo.
echo 注意：
echo - 免费版ngrok连接有效期约为2小时
echo - 请勿将您的ngrok URL分享给不信任的人
echo - 关闭ngrok窗口将停止远程访问
echo.
echo 准备就绪！您现在可以使用AI牵伴应用的远程AI聊天功能了。
echo.
echo 按任意键退出此窗口...
pause >nul 