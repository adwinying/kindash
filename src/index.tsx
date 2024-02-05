import { cron } from "@elysiajs/cron";
import { html } from "@elysiajs/html";
import { HoltLogger } from "@tlscipher/holt";
import { Elysia } from "elysia";
import { DashboardPage } from "./dashboard";
import { updateData } from "./data";
import { generateImage } from "./image";

const app = new Elysia()
  .use(html())
  .use(
    cron({
      name: "updateDataJson",
      pattern: "9,19,29,39,49,59 * * * *",
      run: async () => {
        console.log(`${new Date().toISOString()} | CRON updateDataJson`);
        await updateData();
        await generateImage();
      },
    }),
  )
  .use(new HoltLogger().getLogger())
  .get("/", async () => <DashboardPage />)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
