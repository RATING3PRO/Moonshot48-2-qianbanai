import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aiqianban.app',
  appName: 'AI牵伴',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // 允许清除网络缓存
    cleartext: true,
    // 添加额外服务器配置
    hostname: 'localhost',
    iosScheme: 'ionic'
  },
  android: {
    buildOptions: {
      keystorePath: 'android.keystore',
      keystorePassword: 'android',
      keystoreAlias: 'androidalias',
      keystoreAliasPassword: 'android',
    },
    // 添加Android特有配置
    allowMixedContent: true,
    // 确保WebView正确加载资源
    webContentsDebuggingEnabled: true,
    // 初始焦点配置
    initialFocus: true
  },
  // 全局配置
  plugins: {
    // 确保SplashScreen配置正确
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#FFFFFF",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP"
    }
  }
};

export default config;