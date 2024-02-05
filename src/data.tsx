import nodePath from "node:path";
import * as cheerio from "cheerio";

const getTimestamp = () => {
  const timestamp = new Date();
  const year = timestamp.getFullYear();
  const month = (timestamp.getMonth() + 1).toString().padStart(2, "0");
  const date = timestamp.getDate().toString().padStart(2, "0");
  const hour = timestamp.getHours().toString().padStart(2, "0");
  const minute = timestamp.getMinutes().toString().padStart(2, "0");
  const second = timestamp.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
};

type IndoorData = {
  StatusSNS: {
    Time: string;
    SCD40: {
      CarbonDioxide: number;
      eCO2: number;
      Temperature: number;
      Humidity: number;
      DewPoint: number;
    };
    TempUnit: "C";
  };
};
const getIndoorData = async () => {
  let json: IndoorData;
  try {
    console.log("Fetching indoor data");
    const res = await fetch("http://192.168.5.5/cm?cmnd=status%2010");
    json = await res.json();
    console.log("Indoor data fetched");
  } catch (e) {
    console.log("Failed to fetch indoor data; reverting to default values");
    json = JSON.parse(
      `{"StatusSNS":{"Time":"1972-01-14T16:08:33","SCD40":{"CarbonDioxide":888,"eCO2":888,"Temperature":88.8,"Humidity":88.8,"DewPoint":8.8},"TempUnit":"C"}}`,
    );
  }

  return {
    temp: json.StatusSNS.SCD40.Temperature,
    humidity: json.StatusSNS.SCD40.Humidity,
    co2: json.StatusSNS.SCD40.CarbonDioxide,
    dewPoint: json.StatusSNS.SCD40.DewPoint,
  };
};

const getOutdoorData = async () => {
  const res = await fetch(
    "https://weather.yahoo.co.jp/weather/jp/13/4410/13120.html",
  );
  const html = await res.text();
  const $ = cheerio.load(html);

  const $today = $("#yjw_pinpoint_today");
  const $tomorrow = $("#yjw_pinpoint_tomorrow");

  const $headers = $today.find("td[bgcolor]");
  const currentIndex =
    $headers.toArray().findIndex((el) => el.attribs.bgcolor === "#e9eefd") - 1;

  const colLength = $today.find("tr").first().children().length;

  const getColData = (
    $target: cheerio.Cheerio<cheerio.Element>,
    colIndex: number,
  ) => {
    const rowIndices = {
      time: 0,
      icon: 1,
      temp: 2,
      humidity: 3,
      windSpeed: 5,
    };

    const time = `${$target
      .find(
        `tr:nth-child(${rowIndices.time + 1}) td:nth-child(${colIndex + 1})`,
      )
      .text()
      .trim()
      .replace(/[^\d]/g, "")}:00`;
    const icon = $target
      .find(
        `tr:nth-child(${rowIndices.icon + 1}) td:nth-child(${
          colIndex + 1
        }) img`,
      )
      .attr("src");
    const temp = +$target
      .find(
        `tr:nth-child(${rowIndices.temp + 1}) td:nth-child(${colIndex + 1})`,
      )
      .text()
      .trim();
    const humidity = +$target
      .find(
        `tr:nth-child(${rowIndices.humidity + 1}) td:nth-child(${
          colIndex + 1
        })`,
      )
      .text()
      .trim();
    const windSpeed = +$target
      .find(
        `tr:nth-child(${rowIndices.windSpeed + 1}) td:nth-child(${
          colIndex + 1
        })`,
      )
      .text()
      .trim()
      .replace(/[^\d]/g, "");

    return { time, icon, temp, humidity, windSpeed };
  };

  const forecastsToday: ReturnType<typeof getColData>[] = [];
  const forecastsTomorrow: ReturnType<typeof getColData>[] = [];

  for (let i = 1; i < colLength; i++) {
    forecastsToday.push(getColData($today, i));
  }
  for (let i = 1; i < colLength; i++) {
    forecastsTomorrow.push(getColData($tomorrow, i));
  }

  const minTemp = Math.min(...forecastsToday.map((f) => f.temp));
  const maxTemp = Math.max(...forecastsToday.map((f) => f.temp));

  const $umbrella = $("#index-01 > dl.indexList_item-umbrella > dd > p > span");
  const $clothing = $("#index-01 > dl.indexList_item-clothing > dd > p > span");

  const umbrellaMeter = +$umbrella.text().trim().replace(/[^\d]/g, "");
  const clothingMeter = +$clothing.text().trim().replace(/[^\d]/g, "");

  return {
    icon: forecastsToday[currentIndex].icon,
    currentTemp: forecastsToday[currentIndex].temp,
    minTemp,
    maxTemp,
    humidity: forecastsToday[currentIndex].humidity,
    windSpeed: forecastsToday[currentIndex].windSpeed,
    umbrellaMeter,
    clothingMeter,
    forecasts: forecastsToday
      .concat(forecastsTomorrow)
      .slice(currentIndex + 1, currentIndex + 1 + 4),
  };
};

export const updateData = async () => {
  const data = {
    timestamp: getTimestamp(),
    indoor: await getIndoorData(),
    outdoor: await getOutdoorData(),
  };

  const path = nodePath.join(import.meta.dir, "data.json");
  await Bun.write(path, JSON.stringify(data, null, 2));
};
