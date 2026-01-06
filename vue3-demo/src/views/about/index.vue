<template>
  <div>
    <h1>about</h1>
    <router-link to="/">home</router-link>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

console.log(route);
console.log(router);
</script>
