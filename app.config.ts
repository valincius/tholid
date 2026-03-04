import { createApp } from "vinxi";
import solid from "vite-plugin-solid";

export default createApp({
  routers: [
    {
      name: "spa",
      type: "spa",
      handler: "./index.html",
      target: "browser",
      plugins: () => [solid()],
    },
  ],
});
