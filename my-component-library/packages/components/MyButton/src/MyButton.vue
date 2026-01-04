<template>
  <el-button
    :class="['my-button', `my-button--${type}`]"
    :type="type"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :round="round"
    :circle="circle"
    @click="handleClick"
  >
    <slot>{{ text }}</slot>
  </el-button>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import type { MyButtonProps, MyButtonEmits } from './types'

defineOptions({
  name: 'MyButton'
})

const props = withDefaults(defineProps<MyButtonProps>(), {
  type: 'primary',
  size: 'default',
  disabled: false,
  loading: false,
  text: '',
  round: false,
  circle: false
})

const emit = defineEmits<MyButtonEmits>()

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  emit('click', event)
}
</script>

<style scoped lang="scss">
@import '../style/index.scss';
</style>
