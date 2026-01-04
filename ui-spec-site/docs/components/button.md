---
title: 按钮组件示例
---

# 按钮组件示例

这里展示基于 Element Plus 的一些常用按钮样式，方便在规范中说明尺寸、颜色、状态等设计细节。

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap">
    <el-button type="primary">主要按钮</el-button>
    <el-button>默认按钮</el-button>
    <el-button type="success">成功按钮</el-button>
    <el-button type="danger">危险按钮</el-button>
    <el-button type="text">文字按钮</el-button>
  </div>
</template>

<script setup lang="ts"></script>
```

:::

---

# 卡片

这里展示基于 Element Plus 的一些常用卡片。

:::demo

```vue
<template>
  <el-card shadow="never" style="max-width: 480px">
    <template #header>
      <span>基础信息卡片</span>
    </template>
    <div>
      这里可以放一些表单、文本或者统计信息，用于展示后台系统的常见卡片布局。
    </div>
  </el-card>
</template>

<script setup lang="ts"></script>
```

:::
