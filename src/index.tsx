import { html } from "@elysiajs/html";
import { HoltLogger } from "@tlscipher/holt";
import { Elysia } from "elysia";

type BaseHTMLProps = {
  children: JSX.Element;
};
const BaseHTML = ({ children }: BaseHTMLProps) => {
  return (
    <html lang="en">
      <head>
        <title>kindash</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css"
        />
        <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime" />
      </head>
      <body>{children}</body>
    </html>
  );
};

const app = new Elysia()
  .use(html())
  .use(new HoltLogger().getLogger())
  .get("/", () => (
    <BaseHTML>
      <h1>Hello World</h1>
    </BaseHTML>
  ))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
