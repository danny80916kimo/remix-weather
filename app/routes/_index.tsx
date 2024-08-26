import React, { useState } from "react";
import type { MetaFunction } from "@remix-run/node";
// import "./styles.css"; // 引入 CSS 檔案

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // 新增 loading 狀態

  const fetchWeather = () => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 設定 10 秒的 timeout

    const apiKey = "2b64ad3ae744a7dd04c28224f3e5d41f";
    const query = "Taipei";
    const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${query}&units=m`;

    fetch(url, { signal: controller.signal })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: WeatherResponse) => setData(data))
      .catch(error => {
        if (error.name === "AbortError") {
          setError("Request timed out");
        } else if (error.message === "Failed to fetch") {
          setError("Network error, please try again later.");
        } else {
          setError(error.message);
        }
      })
      .finally(() => {
        setLoading(false); // 請求完成後將 loading 設為 false
        clearTimeout(timeoutId);
      });
  };

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Welcome to Remix</h1>
      <button onClick={fetchWeather}>Fetch Weather</button>
      {loading ? (
        <div className="spinner">Loading...</div> // 顯示 loading 轉圈圈
      ) : error ? (
        <p>Error: {error}</p>
      ) : data ? (
        <div>
          <h2>Weather Data:</h2>
          <p>Location: {data.location.name}, {data.location.country}</p>
          <p>Temperature: {data.current.temperature}°C</p>
          <p>Weather: {data.current.weather_descriptions.join(", ")}</p>
          <img src={data.current.weather_icons[0]} alt="Weather icon" />
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}


type WeatherResponse = {
  request: {
    type: string;
    query: string;
    language: string;
    unit: string;
  };
  location: {
    name: string;
    country: string;
    region: string;
    lat: string;
    lon: string;
    timezone_id: string;
    localtime: string;
    localtime_epoch: number;
    utc_offset: string;
  };
  current: {
    observation_time: string;
    temperature: number;
    weather_code: number;
    weather_icons: string[];
    weather_descriptions: string[];
    wind_speed: number;
    wind_degree: number;
    wind_dir: string;
    pressure: number;
    precip: number;
    humidity: number;
    cloudcover: number;
    feelslike: number;
    uv_index: number;
    visibility: number;
    is_day: string;
  };
};