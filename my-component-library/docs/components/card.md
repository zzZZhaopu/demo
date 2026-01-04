# Card 卡片

将信息聚合在卡片容器中展示。

## 基础用法

卡片包含标题、内容。

<div style="padding: 20px; border: 1px solid #ebeef5; border-radius: 4px; margin: 20px 0;">
  <MyCard header="卡片标题" style="width: 400px;">
    <p>这是卡片内容</p>
    <p>可以包含任意内容</p>
  </MyCard>
</div>

::: details 查看代码
```vue
<template>
  <MyCard header="卡片标题" style="width: 400px;">
    <p>这是卡片内容</p>
    <p>可以包含任意内容</p>
  </MyCard>
</template>
```
:::

## 简单卡片

不带标题的卡片。

<div style="padding: 20px; border: 1px solid #ebeef5; border-radius: 4px; margin: 20px 0;">
  <MyCard style="width: 400px;">
    <p>没有标题的卡片</p>
    <p>直接显示内容</p>
  </MyCard>
</div>

::: details 查看代码
```vue
<template>
  <MyCard style="width: 400px;">
    <p>没有标题的卡片</p>
    <p>直接显示内容</p>
  </MyCard>
</template>
```
:::

## 自定义标题

通过 slot 自定义标题内容。

<div style="padding: 20px; border: 1px solid #ebeef5; border-radius: 4px; margin: 20px 0;">
  <MyCard style="width: 400px;">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: bold;">自定义标题</span>
        <el-button type="text">操作按钮</el-button>
      </div>
    </template>
    <p>使用 slot 自定义标题</p>
  </MyCard>
</div>

::: details 查看代码
```vue
<template>
  <MyCard style="width: 400px;">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: bold;">自定义标题</span>
        <el-button type="text">操作按钮</el-button>
      </div>
    </template>
    <p>使用 slot 自定义标题</p>
  </MyCard>
</template>
```
:::

## 阴影效果

可设置卡片阴影出现的时机。

<div style="padding: 20px; border: 1px solid #ebeef5; border-radius: 4px; margin: 20px 0; display: flex; gap: 20px; flex-wrap: wrap;">
  <MyCard shadow="always" style="width: 200px;">
    <p>always</p>
    <p>总是显示</p>
  </MyCard>
  
  <MyCard shadow="hover" style="width: 200px;">
    <p>hover</p>
    <p>悬停显示</p>
  </MyCard>
  
  <MyCard shadow="never" style="width: 200px;">
    <p>never</p>
    <p>从不显示</p>
  </MyCard>
</div>

::: details 查看代码
```vue
<template>
  <div style="display: flex; gap: 20px; flex-wrap: wrap;">
    <MyCard shadow="always" style="width: 200px;">
      <p>always</p>
      <p>总是显示</p>
    </MyCard>
    
    <MyCard shadow="hover" style="width: 200px;">
      <p>hover</p>
      <p>悬停显示</p>
    </MyCard>
    
    <MyCard shadow="never" style="width: 200px;">
      <p>never</p>
      <p>从不显示</p>
    </MyCard>
  </div>
</template>
```
:::

## API

### Props

| 属性名    | 说明             | 类型   | 可选值                 | 默认值 |
| --------- | ---------------- | ------ | ---------------------- | ------ |
| header    | 卡片标题         | string | —                      | —      |
| shadow    | 阴影显示时机     | string | always / hover / never | always |
| bodyStyle | 卡片内容区域样式 | object | —                      | —      |

### Slots

| 插槽名  | 说明               |
| ------- | ------------------ |
| default | 卡片内容           |
| header  | 卡片标题（自定义） |
