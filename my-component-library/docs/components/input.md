# Input 输入框

通过鼠标或键盘输入字符。

## 基础用法

<script setup>
import { ref } from 'vue'
const inputValue = ref('')
const clearableValue = ref('')
const password = ref('')
const value1 = ref('')
const value2 = ref('')
const value3 = ref('')
</script>

<div style="padding: 20px; border: 1px solid #ebeef5; border-radius: 4px; margin: 20px 0;">
  <MyInput v-model="inputValue" placeholder="请输入内容" />
  <p style="margin-top: 10px;">输入值: {{ inputValue }}</p>
</div>

::: details 查看代码
```vue
<template>
  <div>
    <MyInput v-model="inputValue" placeholder="请输入内容" />
    <p style="margin-top: 10px;">输入值: {{ inputValue }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const inputValue = ref('')
</script>
```
:::

## 可清空

<div style="padding: 20px; border: 1px solid #ebeef5; border-radius: 4px; margin: 20px 0;">
  <MyInput v-model="clearableValue" placeholder="可清空" clearable />
</div>

::: details 查看代码
```vue
<template>
  <MyInput v-model="clearableValue" placeholder="可清空" clearable />
</template>

<script setup>
import { ref } from 'vue'
const clearableValue = ref('')
</script>
```
:::

## 密码框

<div style="padding: 20px; border: 1px solid #ebeef5; border-radius: 4px; margin: 20px 0;">
  <MyInput v-model="password" type="password" placeholder="请输入密码" />
</div>

::: details 查看代码
```vue
<template>
  <MyInput v-model="password" type="password" placeholder="请输入密码" />
</template>

<script setup>
import { ref } from 'vue'
const password = ref('')
</script>
```
:::

## 不同尺寸

<div style="padding: 20px; border: 1px solid #ebeef5; border-radius: 4px; margin: 20px 0; display: flex; flex-direction: column; gap: 10px;">
  <MyInput v-model="value1" size="large" placeholder="大型输入框" />
  <MyInput v-model="value2" placeholder="默认输入框" />
  <MyInput v-model="value3" size="small" placeholder="小型输入框" />
</div>

::: details 查看代码
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 10px;">
    <MyInput v-model="value1" size="large" placeholder="大型输入框" />
    <MyInput v-model="value2" placeholder="默认输入框" />
    <MyInput v-model="value3" size="small" placeholder="小型输入框" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const value1 = ref('')
const value2 = ref('')
const value3 = ref('')
</script>
```
:::

## 禁用状态

<div style="padding: 20px; border: 1px solid #ebeef5; border-radius: 4px; margin: 20px 0;">
  <MyInput disabled placeholder="禁用状态" />
</div>

::: details 查看代码
```vue
<template>
  <MyInput disabled placeholder="禁用状态" />
</template>
```
:::

## API

### Props

| 属性名               | 说明         | 类型            | 可选值                           | 默认值  |
| -------------------- | ------------ | --------------- | -------------------------------- | ------- |
| modelValue / v-model | 绑定值       | string / number | —                                | —       |
| type                 | 输入框类型   | string          | text / password / number / email | text    |
| placeholder          | 占位文本     | string          | —                                | 请输入  |
| disabled             | 是否禁用     | boolean         | —                                | false   |
| clearable            | 是否可清空   | boolean         | —                                | false   |
| size                 | 输入框尺寸   | string          | large / default / small          | default |
| maxlength            | 最大输入长度 | number          | —                                | —       |

### Events

| 事件名            | 说明           | 参数                      |
| ----------------- | -------------- | ------------------------- |
| update:modelValue | 值改变时触发   | (value: string \| number) |
| change            | 值改变时触发   | (value: string \| number) |
| blur              | 失去焦点时触发 | (event: FocusEvent)       |
| focus             | 获得焦点时触发 | (event: FocusEvent)       |

### Slots

| 插槽名 | 说明           |
| ------ | -------------- |
| prefix | 输入框头部内容 |
| suffix | 输入框尾部内容 |
