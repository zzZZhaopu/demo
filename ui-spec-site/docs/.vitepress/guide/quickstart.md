## 快速开始
#### 本节将介绍如何在项目中使用 @hina/lego

## 用法
#### 考虑到这是我们海纳云业务组件库，里面所有的组件都会使用到，所以在项目中使用全量引入会更方便
```ts
// main.ts
import { createApp } from 'vue'
import HnLego from '@hina/lego'
import '@hina/lego/theme-chalk/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(HnLego)
app.mount('#app')
```
## Volar 支持
#### 如果您使用使用vscode编译器的，那么肯定会安装Volar，要想组件提供类型提示，请在 tsconfig.json 中通过 compilerOptions.type 指定全局组件类型。(webstorm编辑器可以忽略)
```json
{
  "compilerOptions": {
    "types": ["@hina/lego/global"]
  }
}
```
