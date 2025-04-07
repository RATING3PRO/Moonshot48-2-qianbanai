import React, { useEffect, useState } from 'react';
import { WeatherService } from '../services/weatherService';
import '../styles/WeatherWidget.css';

interface WeatherWidgetProps {
  cityName?: string;
  refreshInterval?: number; // 刷新间隔，单位为毫秒
}

interface WeatherState {
  temperature: string;
  weather: string;
  city: string;
  windDirection: string;
  windScale: string;
  humidity: string;
  tips?: string;
  forecast?: Array<{
    date: string;
    dayWeather: string;
    nightWeather: string;
    dayTemp: string;
    nightTemp: string;
    dayWind: string;
    nightWind: string;
    dayWindScale: string;
    nightWindScale: string;
  }>;
  warning?: Array<{
    title: string;
    type: string;
    level: string;
    content: string;
    pubTime: string;
  }>;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  cityName = '北京',
  refreshInterval = 1800000 // 默认30分钟刷新一次
}) => {
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const weatherInfo = await WeatherService.getWeatherInfo(cityName);
      if (weatherInfo) {
        setWeather(weatherInfo);
        setError(null);
      } else {
        setError('无法获取天气信息');
      }
    } catch (err) {
      setError('获取天气信息失败');
      console.error('天气获取错误:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 初始加载天气
    fetchWeather();

    // 设置定时刷新
    const intervalId = setInterval(fetchWeather, refreshInterval);

    // 清理函数
    return () => clearInterval(intervalId);
  }, [cityName, refreshInterval]);

  if (loading && !weather) {
    return <div className="weather-widget">加载天气中...</div>;
  }

  if (error && !weather) {
    return <div className="weather-widget weather-error">天气加载失败</div>;
  }

  return (
    <div className="weather-widget">
      {weather && (
        <>
          <div className="weather-current">
            <div className="weather-header">
              <span className="weather-city">{weather.city}</span>
              <span className="weather-temp">{weather.temperature}</span>
            </div>
            <div className="weather-details">
              <span className="weather-info">{weather.weather}</span>
              <span className="weather-wind">{weather.windDirection} {weather.windScale}</span>
              <span className="weather-humidity">湿度: {weather.humidity}</span>
            </div>
            {weather.tips && (
              <div className="weather-tips">{weather.tips}</div>
            )}
          </div>

          {weather.warning && weather.warning.length > 0 && (
            <div className="weather-warnings">
              {weather.warning.map((warn, index) => (
                <div key={index} className={`warning-item warning-${warn.level.toLowerCase()}`}>
                  <div className="warning-title">{warn.title}</div>
                  <div className="warning-content">{warn.content}</div>
                </div>
              ))}
            </div>
          )}

          {weather.forecast && (
            <div className="weather-forecast">
              {weather.forecast.map((day, index) => (
                <div key={index} className="forecast-item">
                  <div className="forecast-date">
                    {index === 0 ? '今天' : index === 1 ? '明天' : '后天'}
                    <div className="forecast-date-detail">{day.date.split('-').slice(1).join('/')}</div>
                  </div>
                  <div className="forecast-weather">
                    <div>白天: {day.dayWeather}</div>
                    <div>夜间: {day.nightWeather}</div>
                  </div>
                  <div className="forecast-temp">
                    <span className="high-temp">{day.dayTemp}°</span>
                    <span className="low-temp">{day.nightTemp}°</span>
                  </div>
                  <div className="forecast-wind">
                    <div>{day.dayWind} {day.dayWindScale}级</div>
                    <div>{day.nightWind} {day.nightWindScale}级</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WeatherWidget;