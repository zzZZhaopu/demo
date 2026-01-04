<script setup lang="ts">
// import DemoButton from './components/DemoButton.vue'
import { MyButton } from "@zzzzzzhaopu/my-ui";
import DemoCard from "./components/DemoCard.vue";
</script>

<template>
  <main style="padding: 24px">
    <h1>UI 规范示例运行区</h1>
    <p style="margin-bottom: 16px">
      这里用于快速预览 Element Plus 组件的实际效果。
    </p>
    <section style="margin-bottom: 24px">
      <h2>按钮示例</h2>
      <!-- <DemoButton /> -->
      <MyButton text="test" type="warning" size="large" />
    </section>
    <section>
      <h2>卡片示例</h2>
      <DemoCard />
    </section>
  </main>
</template>

<style scoped>
h1 {
  margin-bottom: 8px;
}
h2 {
  margin: 16px 0 8px;
}
</style>
