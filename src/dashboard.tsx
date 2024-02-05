import nodePath from "node:path";
import "@elysiajs/html";

type BaseHTMLProps = {
  children: JSX.Element;
};
const BaseHTML = ({ children }: BaseHTMLProps) => {
  return (
    <html lang="en">
      <head>
        <title>kindash</title>

        <style>
          {`
            [un-cloak] {
              display: none;
            }
          `}
        </style>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css"
        />
        <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime/preset-uno.global.js" />
        <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime/preset-web-fonts.global.js" />
        <script>
          {`
            window.__unocss = {
              rules: [
                // custom rules...
              ],
              presets: [
                () => window.__unocss_runtime.presets.presetUno(),
                () => window.__unocss_runtime.presets.presetWebFonts({
                  inlineImports: false,
                  provider: 'bunny',
                  fonts: {
                    serif: ['Noto Serif:400,700'],
                  }
                }),
              ],
            }
          `}
        </script>
        <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime/core.global.js" />
      </head>
      <body un-cloak>{children}</body>
    </html>
  );
};

export type DashboardData = {
  timestamp: string;
  indoor: {
    temp: number;
    humidity: number;
    co2: number;
    dewPoint: number;
  };
  outdoor: {
    icon: string;
    currentTemp: number;
    minTemp: number;
    maxTemp: number;
    humidity: number;
    windSpeed: number;
    umbrellaMeter: number;
    clothingMeter: number;
    forecasts: {
      time: string;
      icon: string;
      temp: number;
      humidity: number;
      windSpeed: number;
    }[];
  };
};
type DashboardProps = {
  data: DashboardData;
};
const Dashboard = ({ data }: DashboardProps) => {
  const yyyymmdd = data.timestamp.replace(/ .*$/, "").replace(/-/g, "/");

  const date = new Date();
  const time = +`${date.getHours()}${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  const greeting = (() => {
    if (time >= 0 && time < 1200) return "Good Morning";
    if (time >= 1200 && time < 1700) return "Good Afternoon";
    if (time >= 1700 && time < 2100) return "Good Evening";
    if (time >= 2100) return "Good Night";
  })();

  return (
    <div class="mx-auto px-8 py-12 max-w-xl sm:aspect-[758/1024] text-black shadow font-serif relative scale-[calc(758/576)] origin-top">
      <h2 class="text-xl">{yyyymmdd}</h2>

      <h1 class="text-3xl font-bold">{greeting}</h1>

      <div class="flex items-center gap-3 mt-8">
        <div class="w-16 aspect-square">
          <img
            class="w-full h-full object-contain object-center"
            src={data.outdoor.icon}
            alt="weather icon"
          />
        </div>
        <div>
          <h2 class="text-5xl font-bold">{data.outdoor.currentTemp}&deg;C</h2>
          <p class="text-2xl">
            {data.outdoor.minTemp}&deg;C / {data.outdoor.maxTemp}&deg;C
          </p>
        </div>
      </div>

      <div class="flex gap-8 justify-end mt-10 pr-6 text-xl">
        <div class="grid grid-cols-[min-content_1fr] gap-x-3 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            class="w-6 ml-auto"
          >
            <title>home-thermometer-outline</title>
            <path d="M19 8C20.11 8 21 8.9 21 10V16.76C21.61 17.31 22 18.11 22 19C22 20.66 20.66 22 19 22C17.34 22 16 20.66 16 19C16 18.11 16.39 17.31 17 16.76V10C17 8.9 17.9 8 19 8M19 9C18.45 9 18 9.45 18 10V11H20V10C20 9.45 19.55 9 19 9M12 5.69L7 10.19V18H14.1L14 19L14.1 20H5V12H2L12 3L16.4 6.96C15.89 7.4 15.5 7.97 15.25 8.61L12 5.69Z" />
          </svg>
          <span>{data.indoor.temp}&deg;C</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-6 ml-auto"
          >
            <title>water-percent</title>
            <path d="M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z" />
          </svg>
          <span>{data.indoor.humidity}%</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-6 ml-auto"
          >
            <title>molecule-co2</title>
            <path d="M5,7A2,2 0 0,0 3,9V15A2,2 0 0,0 5,17H8V15H5V9H8V7H5M11,7A2,2 0 0,0 9,9V15A2,2 0 0,0 11,17H13A2,2 0 0,0 15,15V9A2,2 0 0,0 13,7H11M11,9H13V15H11V9M16,10.5V12H19V13.5H17.5A1.5,1.5 0 0,0 16,15V18H20.5V16.5H17.5V15H19A1.5,1.5 0 0,0 20.5,13.5V12A1.5,1.5 0 0,0 19,10.5H16Z" />
          </svg>
          <span>{data.indoor.co2.toLocaleString()}ppm</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-6 ml-auto"
          >
            <title>thermometer-water</title>
            <path d="M10 13V5C10 3.34 8.66 2 7 2S4 3.34 4 5V13C1.79 14.66 1.34 17.79 3 20S7.79 22.66 10 21 12.66 16.21 11 14C10.72 13.62 10.38 13.28 10 13M7 4C7.55 4 8 4.45 8 5V8H6V5C6 4.45 6.45 4 7 4M18 7C18 7 14 11.34 14 14.07C14 19.31 22 19.31 22 14.07C22 11.34 18 7 18 7Z" />
          </svg>
          <span>{data.indoor.dewPoint}&deg;C</span>
        </div>
        <div class="grid grid-cols-[min-content_1fr] gap-x-3 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-6 ml-auto"
          >
            <title>cloud-percent</title>
            <path d="M21.86 12.5C21.1 11.63 20.15 11.13 19 11C19 9.05 18.32 7.4 16.96 6.04C15.6 4.68 13.95 4 12 4C10.42 4 9 4.47 7.75 5.43S5.67 7.62 5.25 9.15C4 9.43 2.96 10.08 2.17 11.1S1 13.28 1 14.58C1 16.09 1.54 17.38 2.61 18.43C3.69 19.5 5 20 6.5 20H18.5C19.75 20 20.81 19.56 21.69 18.69C22.56 17.81 23 16.75 23 15.5C23 14.35 22.62 13.35 21.86 12.5M9.45 9.03C10.23 9.03 10.87 9.67 10.87 10.45C10.87 11.23 10.23 11.87 9.45 11.87C8.67 11.87 8.03 11.23 8.03 10.45C8.03 9.67 8.67 9.03 9.45 9.03M14.55 16.97C13.77 16.97 13.13 16.33 13.13 15.55C13.13 14.77 13.77 14.13 14.55 14.13C15.33 14.13 15.97 14.77 15.97 15.55C15.97 16.33 15.33 16.97 14.55 16.97M9.2 17L8 15.8L14.8 9L16 10.2L9.2 17Z" />
          </svg>
          <span>{data.outdoor.humidity}%</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-6 ml-auto"
          >
            <title>weather-windy</title>
            <path d="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z" />
          </svg>
          <span>{data.outdoor.windSpeed}m/s</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-6 ml-auto"
          >
            <title>umbrella</title>
            <path d="M12,2A9,9 0 0,1 21,11H13V19A3,3 0 0,1 10,22A3,3 0 0,1 7,19V18H9V19A1,1 0 0,0 10,20A1,1 0 0,0 11,19V11H3A9,9 0 0,1 12,2Z" />
          </svg>
          <span>{data.outdoor.umbrellaMeter}%</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-6 ml-auto"
          >
            <title>tshirt-crew</title>
            <path d="M16,21H8A1,1 0 0,1 7,20V12.07L5.7,13.07C5.31,13.46 4.68,13.46 4.29,13.07L1.46,10.29C1.07,9.9 1.07,9.27 1.46,8.88L7.34,3H9C9,4.1 10.34,5 12,5C13.66,5 15,4.1 15,3H16.66L22.54,8.88C22.93,9.27 22.93,9.9 22.54,10.29L19.71,13.12C19.32,13.5 18.69,13.5 18.3,13.12L17,12.12V20A1,1 0 0,1 16,21" />
          </svg>
          <span>{data.outdoor.clothingMeter}%</span>
        </div>
      </div>

      <div class="mt-16 flex divide-x-2 divide-slate-700">
        {data.outdoor.forecasts.map((forecast) => (
          <div class="p-3 w-1/4 flex flex-col gap-3 items-center">
            <div class="text-2xl font-bold">{forecast.time}</div>
            <div class="w-12 aspect-square">
              <img
                class="w-full h-full object-contain object-center"
                src={forecast.icon}
                alt="weather icon"
              />
            </div>
            <div class="grid grid-cols-[min-content_1fr] gap-x-3 items-center text-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="w-5 ml-auto"
              >
                <title>thermometer-lines</title>
                <path d="M17 3H21V5H17V3M17 7H21V9H17V7M17 11H21V13H17.75L17 12.1V11M21 15V17H19C19 16.31 18.9 15.63 18.71 15H21M7 3V5H3V3H7M7 7V9H3V7H7M7 11V12.1L6.25 13H3V11H7M3 15H5.29C5.1 15.63 5 16.31 5 17H3V15M15 13V5C15 3.34 13.66 2 12 2S9 3.34 9 5V13C6.79 14.66 6.34 17.79 8 20S12.79 22.66 15 21 17.66 16.21 16 14C15.72 13.62 15.38 13.28 15 13M12 4C12.55 4 13 4.45 13 5V8H11V5C11 4.45 11.45 4 12 4Z" />
              </svg>
              <span>{forecast.temp}&deg;C</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="w-5 ml-auto"
              >
                <title>cloud-percent</title>
                <path d="M21.86 12.5C21.1 11.63 20.15 11.13 19 11C19 9.05 18.32 7.4 16.96 6.04C15.6 4.68 13.95 4 12 4C10.42 4 9 4.47 7.75 5.43S5.67 7.62 5.25 9.15C4 9.43 2.96 10.08 2.17 11.1S1 13.28 1 14.58C1 16.09 1.54 17.38 2.61 18.43C3.69 19.5 5 20 6.5 20H18.5C19.75 20 20.81 19.56 21.69 18.69C22.56 17.81 23 16.75 23 15.5C23 14.35 22.62 13.35 21.86 12.5M9.45 9.03C10.23 9.03 10.87 9.67 10.87 10.45C10.87 11.23 10.23 11.87 9.45 11.87C8.67 11.87 8.03 11.23 8.03 10.45C8.03 9.67 8.67 9.03 9.45 9.03M14.55 16.97C13.77 16.97 13.13 16.33 13.13 15.55C13.13 14.77 13.77 14.13 14.55 14.13C15.33 14.13 15.97 14.77 15.97 15.55C15.97 16.33 15.33 16.97 14.55 16.97M9.2 17L8 15.8L14.8 9L16 10.2L9.2 17Z" />
              </svg>
              <span>{forecast.humidity}%</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="w-5 ml-auto"
              >
                <title>weather-windy</title>
                <path d="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z" />
              </svg>
              <span>{forecast.windSpeed}m/s</span>
            </div>
          </div>
        ))}
      </div>

      <p class="absolute right-12 bottom-4 block h-12 mt-auto text-right">
        Data retrieved at {data.timestamp.replace(/-/g, "/")}
      </p>
    </div>
  );
};

export const DashboardPage = async () => {
  const path = nodePath.join(import.meta.dir, "data.json");
  const file = Bun.file(path);
  const data = (await file.json()) as DashboardData;

  return (
    <BaseHTML>
      <Dashboard data={data} />
    </BaseHTML>
  );
};
