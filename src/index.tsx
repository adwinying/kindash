import nodePath from "node:path";
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
  .get("/dash.png", () => Bun.file(nodePath.join(import.meta.dir, "dash.png")))
  .listen(process.env.PORT ?? 3000);

await updateData();
await generateImage();
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
