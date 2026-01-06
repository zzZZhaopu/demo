<template>
  <div>
    <h1>about</h1>
    <router-link to="/">home</router-link>
    <el-button @click="test">test</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const test = () => {
  (route as any).test();
};

console.log(route);
console.log(router);
</script>
