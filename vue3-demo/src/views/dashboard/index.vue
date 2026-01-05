<template>
  <div class="home">
    <h1>Home</h1>
    <el-button type="primary" @click="test">Primary</el-button>
    <router-link to="/about">Go to About</router-link>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";

const test = () => {
  ElMessage.success("success");
};
</script>
