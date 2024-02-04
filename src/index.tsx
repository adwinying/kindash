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
                  provider: 'bunny',
                  fonts: {
                    serif: ['Noto Serif: 400,700'],
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

const app = new Elysia()
  .use(html())
  .use(new HoltLogger().getLogger())
  .get("/", () => (
    <BaseHTML>
      <h1 class="font-serif">Hello World</h1>
    </BaseHTML>
  ))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
