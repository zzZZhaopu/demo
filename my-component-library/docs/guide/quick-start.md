# 快速开始

## 安装

使用 npm 安装：

```bash
npm install @demo/my-ui
```

使用 yarn 安装：

```bash
yarn add @demo/my-ui
```

使用 pnpm 安装：

```bash
pnpm add @demo/my-ui
```

## 完整引入

在 main.ts 中引入：

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import MyUI from '@demo/my-ui'
import '@demo/my-ui/dist/style.css'

const app = createApp(App)
app.use(MyUI)
app.mount('#app')
```

## 按需引入

```vue
<script setup lang="ts">
import { MyButton, MyInput } from '@demo/my-ui'
import '@demo/my-ui/dist/style.css'
</script>

<template>
  <MyButton>点击我</MyButton>
  <MyInput v-model="value" />
</template>
```

## 开始使用

现在你可以在项目中使用组件了！

```vue
<template>
  <div>
    <MyButton type="primary" @click="handleClick">
      主要按钮
    </MyButton>
  </div>
</template>

<script setup lang="ts">
const handleClick = () => {
  console.log('按钮被点击了！')
}
</script>
```
