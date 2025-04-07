// ngrok服务管理组件

// 设置指南接口
interface SetupGuide {
  title: string;
  steps: string[];
}

export class NgrokService {
  private static ngrokURL: string | null = localStorage.getItem('ngrok_url');

  // 获取ngrok URL
  public static getNgrokURL(): string | null {
    return this.ngrokURL;
  }

  // 设置ngrok URL
  public static setNgrokURL(url: string | null): void {
    this.ngrokURL = url;
    if (url) {
      localStorage.setItem('ngrok_url', url);
    } else {
      localStorage.removeItem('ngrok_url');
    }
  }

  // 检查URL是否有效
  public static isValidNgrokURL(url: string): boolean {
    // 基本验证ngrok.io URL格式
    const ngrokPattern = /^https?:\/\/[\w-]+\.ngrok(-free)?\.app\/?$/i;
    return ngrokPattern.test(url.trim());
  }

  // 获取ngrok设置指南
  public static getSetupGuide(): SetupGuide {
    return {
      title: '如何设置ngrok实现远程访问',
      steps: [
        '1. 注册并安装ngrok (https://ngrok.com/download)',
        '2. 在终端中使用Ollama API端口运行: ngrok http 11434',
        '3. 复制ngrok提供的转发URL (如 https://xxxx-xx-xx-xx-xx.ngrok-free.app)',
        '4. 将该URL粘贴到上方的输入框中并点击"连接"',
        '5. 成功连接后，您可以从任何设备通过该URL访问本地Ollama模型'
      ]
    };
  }

  // 获取常见问题解答
  public static getFAQs(): {question: string, answer: string}[] {
    return [
      {
        question: '使用ngrok有什么限制？',
        answer: '免费版ngrok有会话时长限制(通常为2小时)，带宽限制，以及每分钟40个请求的限制。需要长期使用请考虑付费版或其他替代方案。'
      },
      {
        question: '为什么我的ngrok连接不稳定？',
        answer: '可能原因：1) 网络问题；2) 免费版ngrok限制；3) 本地Ollama服务未运行；4) 防火墙阻止；5) ngrok会话已过期(需要重启ngrok并更新URL)。'
      },
      {
        question: '我可以使用其他工具代替ngrok吗？',
        answer: '是的，您可以使用其他类似的内网穿透工具，如Cloudflare Tunnel、Localtunnel或frp等。只要能提供公网URL访问本地Ollama API即可。'
      },
      {
        question: '我的API密钥和数据安全吗？',
        answer: '使用ngrok时，所有通过隧道的流量都是加密的。但请注意，任何拥有您ngrok URL的人都可以访问您的Ollama API。请不要公开分享您的URL，并考虑为Ollama API添加认证层。'
      },
      {
        question: '如何停止远程访问？',
        answer: '要停止远程访问，您可以: 1) 在本应用中点击"断开连接"按钮；2) 关闭ngrok终端；3) 如果您使用了付费版，也可以在ngrok控制面板中停止隧道。'
      }
    ];
  }

  // 构建完整的帮助信息
  public static getFullHelp(): string {
    const guide = this.getSetupGuide();
    const faqs = this.getFAQs();
    
    let helpText = `## ${guide.title}\n\n`;
    helpText += guide.steps.join('\n') + '\n\n';
    
    helpText += '## 常见问题\n\n';
    faqs.forEach(faq => {
      helpText += `**${faq.question}**\n${faq.answer}\n\n`;
    });
    
    return helpText;
  }
} 