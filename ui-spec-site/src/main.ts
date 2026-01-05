import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@zzzzzzhaopu/my-ui/dist/es/styles/index.css";
import "@zzzzzzhaopu/vue/styles";
import "./style.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.mount("#app");
