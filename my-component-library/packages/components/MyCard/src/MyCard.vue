<template>
  <el-card
    :header="header"
    :shadow="shadow"
    :body-style="bodyStyle"
    class="my-card"
  >
    <template v-if="$slots.header" #header>
      <slot name="header"></slot>
    </template>
    <slot></slot>
  </el-card>
</template>

<script setup lang="ts">
import { ElCard } from 'element-plus'
import type { MyCardProps } from './types'

defineOptions({
  name: 'MyCard'
})

withDefaults(defineProps<MyCardProps>(), {
  shadow: 'always'
})
</script>

<style scoped lang="scss">
@import '../style/index.scss';
</style>
