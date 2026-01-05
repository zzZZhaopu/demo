import { createApp } from "vue";
import router from "./router";
// 引入 Element Plus SCSS 主题 (替代自动引入的 CSS)
import "./styles/element-theme.scss";
// 引入统一样式入口文件
import "./styles/index.css";

import App from "./App.vue";

const app = createApp(App);
app.use(router);
app.mount("#app");
