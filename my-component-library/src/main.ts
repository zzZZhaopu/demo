import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

// 导入组件库
import MyUI from '../packages/index'

const app = createApp(App)

app.use(ElementPlus)
app.use(MyUI)

app.mount('#app')
