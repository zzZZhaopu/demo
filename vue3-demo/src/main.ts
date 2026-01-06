import { createApp } from "vue";
import router from "./router";
import * as Sentry from "@sentry/vue";
// 引入 Element Plus SCSS 主题 (替代自动引入的 CSS)
import "./styles/element-theme.scss";
// 引入统一样式入口文件
import "./styles/index.css";


import App from "./App.vue";

const app = createApp(App);

Sentry.init({
  app,
  dsn: "https://2771ffbe9ae699a4578a35e3dc74fc58@o4510660955537408.ingest.us.sentry.io/4510660958617600",
  sendDefaultPii: true
});

app.use(router);
app.mount("#app");
