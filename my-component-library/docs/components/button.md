# Button 按钮

常用的操作按钮。

## 基础用法

基础的按钮用法。

<script setup>
import { ref } from 'vue'
const loading = ref(false)

const handleClick = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>

<div style="padding: 20px; border: 1px solid #ebeef5; border-radius: 4px; margin: 20px 0; display: flex; gap: 10px; flex-wrap: wrap;">
  <MyButton>默认按钮</MyButton>
  <MyButton type="primary">主要按钮</MyButton>
  <MyButton type="success">成功按钮</MyButton>
  <MyButton type="warning">警告按钮</MyButton>
  <MyButton type="danger">危险按钮</MyButton>
  <MyButton type="info">信息按钮</MyButton>
</div>

::: details 查看代码
```vue
<template>
  <div style="display: flex; gap: 10px; flex-wrap: wrap;">
    <MyButton>默认按钮</MyButton>
    <MyButton type="primary">主要按钮</MyButton>
    <MyButton type="success">成功按钮</MyButton>
    <MyButton type="warning">警告按钮</MyButton>
    <MyButton type="danger">危险按钮</MyButton>
    <MyButton type="info">信息按钮</MyButton>
  </div>
</template>
```
:::

## 不同尺寸

Button 组件提供了三种尺寸。

<div style="padding: 20px; border: 1px solid #ebeef5; border-radius: 4px; margin: 20px 0; display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
  <MyButton size="large">大型按钮</MyButton>
  <MyButton>默认按钮</MyButton>
  <MyButton size="small">小型按钮</MyButton>
</div>

::: details 查看代码
```vue
<template>
  <div style="display: flex; gap: 10px; align-items: center;">
    <MyButton size="large">大型按钮</MyButton>
    <MyButton>默认按钮</MyButton>
    <MyButton size="small">小型按钮</MyButton>
  </div>
</template>
```
:::

## 圆角按钮

<div style="padding: 20px; border: 1px solid #ebeef5; border-radius: 4px; margin: 20px 0; display: flex; gap: 10px; flex-wrap: wrap;">
  <MyButton round>圆角按钮</MyButton>
  <MyButton type="primary" round>主要按钮</MyButton>
  <MyButton type="success" round>成功按钮</MyButton>
</div>

::: details 查看代码
```vue
<template>
  <div style="display: flex; gap: 10px;">
    <MyButton round>圆角按钮</MyButton>
    <MyButton type="primary" round>主要按钮</MyButton>
    <MyButton type="success" round>成功按钮</MyButton>
  </div>
</template>
```
:::

## 加载状态

点击按钮后显示加载状态。

<div style="padding: 20px; border: 1px solid #ebeef5; border-radius: 4px; margin: 20px 0;">
  <MyButton :loading="loading" @click="handleClick">
    {{ loading ? '加载中...' : '点击加载' }}
  </MyButton>
</div>

::: details 查看代码
```vue
<template>
  <MyButton :loading="loading" @click="handleClick">
    {{ loading ? '加载中...' : '点击加载' }}
  </MyButton>
</template>

<script setup>
import { ref } from 'vue'
const loading = ref(false)

const handleClick = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>
```
:::

## 禁用状态

<div style="padding: 20px; border: 1px solid #ebeef5; border-radius: 4px; margin: 20px 0; display: flex; gap: 10px; flex-wrap: wrap;">
  <MyButton disabled>默认按钮</MyButton>
  <MyButton type="primary" disabled>主要按钮</MyButton>
</div>

::: details 查看代码
```vue
<template>
  <div style="display: flex; gap: 10px;">
    <MyButton disabled>默认按钮</MyButton>
    <MyButton type="primary" disabled>主要按钮</MyButton>
  </div>
</template>
```
:::

## API

### Props

| 属性名   | 说明         | 类型    | 可选值                                      | 默认值  |
| -------- | ------------ | ------- | ------------------------------------------- | ------- |
| type     | 按钮类型     | string  | primary / success / warning / danger / info | primary |
| size     | 按钮尺寸     | string  | large / default / small                     | default |
| disabled | 是否禁用     | boolean | —                                           | false   |
| loading  | 是否加载中   | boolean | —                                           | false   |
| round    | 是否圆角按钮 | boolean | —                                           | false   |
| text     | 按钮文字     | string  | —                                           | —       |

### Events

| 事件名 | 说明           | 参数                |
| ------ | -------------- | ------------------- |
| click  | 点击按钮时触发 | (event: MouseEvent) |

### Slots

| 插槽名  | 说明     |
| ------- | -------- |
| default | 按钮内容 |
