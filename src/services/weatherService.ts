import { WEATHER_API } from '../config/api';

// 天气信息接口
interface WeatherInfo {
  city: string;
  temperature: string;
  weather: string;
  windDirection: string;
  windScale: string;
  humidity: string;
  tips?: string;
  forecast?: ForecastInfo[];
  warning?: WarningInfo[];
}

// 天气预报信息接口
interface ForecastInfo {
  date: string;
  dayWeather: string;
  nightWeather: string;
  dayTemp: string;
  nightTemp: string;
  dayWind: string;
  nightWind: string;
  dayWindScale: string;
  nightWindScale: string;
}

// 天气预警信息接口
interface WarningInfo {
  title: string;
  type: string;
  level: string;
  content: string;
  pubTime: string;
}

// 天气数据缓存接口
interface WeatherCache {
  data: WeatherInfo;
  timestamp: number;
  expiry: number;
}

// 和风天气服务类
export class WeatherService {
  private static cache: Map<string, WeatherCache> = new Map();
  private static readonly CACHE_DURATION = 1800000; // 30分钟缓存

  // 检查缓存
  private static checkCache(cityName: string): WeatherInfo | null {
    const cached = this.cache.get(cityName);
    if (cached && Date.now() - cached.timestamp < cached.expiry) {
      return cached.data;
    }
    return null;
  }

  // 设置缓存
  private static setCache(cityName: string, data: WeatherInfo, duration: number = this.CACHE_DURATION): void {
    this.cache.set(cityName, {
      data,
      timestamp: Date.now(),
      expiry: duration
    });
  }

  // 获取城市ID
  private static async getCityId(cityName: string): Promise<string | null> {
    try {
      const response = await fetch(`${WEATHER_API.CITY_LOOKUP_URL}?location=${encodeURIComponent(cityName)}&key=${WEATHER_API.KEY}`);
      const data = await response.json();
      
      if (data.code === '200' && data.location && data.location.length > 0) {
        return data.location[0].id;
      }
      return null;
    } catch (error) {
      console.error('获取城市ID失败:', error);
      return null;
    }
  }

  // 获取天气预警信息
  private static async getWarningInfo(cityId: string): Promise<WarningInfo[]> {
    try {
      const response = await fetch(`${WEATHER_API.BASE_URL}/warning/now?location=${cityId}&key=${WEATHER_API.KEY}`);
      const data = await response.json();
      
      if (data.code === '200' && data.warning) {
        return data.warning.map((warn: any) => ({
          title: warn.title,
          type: warn.typeName,
          level: warn.level,
          content: warn.text,
          pubTime: warn.pubTime
        }));
      }
      return [];
    } catch (error) {
      console.error('获取天气预警失败:', error);
      return [];
    }
  }

  // 获取天气预报信息
  private static async getForecastInfo(cityId: string): Promise<ForecastInfo[]> {
    try {
      const response = await fetch(`${WEATHER_API.BASE_URL}/weather/3d?location=${cityId}&key=${WEATHER_API.KEY}`);
      const data = await response.json();
      
      if (data.code === '200' && data.daily) {
        return data.daily.map((day: any) => ({
          date: day.fxDate,
          dayWeather: day.textDay,
          nightWeather: day.textNight,
          dayTemp: day.tempMax,
          nightTemp: day.tempMin,
          dayWind: day.windDirDay,
          nightWind: day.windDirNight,
          dayWindScale: day.windScaleDay,
          nightWindScale: day.windScaleNight
        }));
      }
      return [];
    } catch (error) {
      console.error('获取天气预报失败:', error);
      return [];
    }
  }

  // 获取天气信息
  public static async getWeatherInfo(cityName: string = '北京'): Promise<WeatherInfo | null> {
    // 检查缓存
    const cached = this.checkCache(cityName);
    if (cached) {
      return cached;
    }
    try {
      // 获取城市ID
      const cityId = await this.getCityId(cityName);
      if (!cityId) {
        throw new Error(`未找到城市: ${cityName}`);
      }

      // 获取实时天气
      const weatherResponse = await fetch(`${WEATHER_API.BASE_URL}/weather/now?location=${cityId}&key=${WEATHER_API.KEY}`);
      const weatherData = await weatherResponse.json();

      if (weatherData.code !== '200') {
        throw new Error(`获取天气信息失败: ${weatherData.code}`);
      }

      // 获取天气生活指数
      const indicesResponse = await fetch(`${WEATHER_API.BASE_URL}/indices/1d?type=3,9&location=${cityId}&key=${WEATHER_API.KEY}`);
      const indicesData = await indicesResponse.json();

      let tips = '';
      if (indicesData.code === '200' && indicesData.daily && indicesData.daily.length > 0) {
        // 获取穿衣指数的生活建议
        tips = indicesData.daily[0].text || '';
      }

      // 获取天气预报和预警信息
      const [forecast, warning] = await Promise.all([
        this.getForecastInfo(cityId),
        this.getWarningInfo(cityId)
      ]);

      // 构建天气信息对象
      const weatherInfo = {
        city: cityName,
        temperature: `${weatherData.now.temp}°C`,
        weather: weatherData.now.text,
        windDirection: weatherData.now.windDir,
        windScale: `${weatherData.now.windScale}级`,
        humidity: `${weatherData.now.humidity}%`,
        tips,
        forecast,
        warning
      };

      // 设置缓存
      this.setCache(cityName, weatherInfo);

      return weatherInfo;
    } catch (error) {
      console.error('获取天气信息失败:', error);
      return null;
    }
  }

  // 生成天气回复文本
  public static generateWeatherReply(weatherInfo: WeatherInfo | null, cityName: string = '当前城市'): string {
    if (!weatherInfo) {
      return `抱歉，我无法获取${cityName}的天气信息，请稍后再试。`;
    }

    let reply = `${weatherInfo.city}今天天气${weatherInfo.weather}，温度${weatherInfo.temperature}，`;
    reply += `${weatherInfo.windDirection}${weatherInfo.windScale}，湿度${weatherInfo.humidity}。`;
    
    if (weatherInfo.tips) {
      reply += `\n${weatherInfo.tips}`;
    }

    return reply;
  }
}