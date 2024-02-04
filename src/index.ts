import { HoltLogger } from "@tlscipher/holt";
import { Elysia } from "elysia";

const app = new Elysia()
  .use(new HoltLogger().getLogger())
  .get("/", () => "Hello Elysia").listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
