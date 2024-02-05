import nodePath from "node:path";
import puppeteer from "puppeteer-core";
import { DashboardPage } from "./dashboard";

export const generateImage = async () => {
  const html = await DashboardPage();
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    executablePath: process.env.CHROME_BIN,
  });
  console.log("Browser launched");

  const page = await browser.newPage();
  await page.setViewport({ width: 758, height: 1024 });
  await page.setContent(html, { timeout: 30000, waitUntil: "networkidle0" });
  await page.evaluateHandle("document.fonts.ready");
  console.log("Page loaded");

  const imagePath = nodePath.join(import.meta.dir, "dash.png");
  await page.screenshot({ path: imagePath, type: "png" });
  console.log("Image generated");

  await browser.close();
};
