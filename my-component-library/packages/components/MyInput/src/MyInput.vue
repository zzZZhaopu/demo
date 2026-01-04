<template>
  <el-input
    :model-value="modelValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :clearable="clearable"
    :size="size"
    :maxlength="maxlength"
    class="my-input"
    @update:model-value="handleInput"
    @change="handleChange"
    @blur="handleBlur"
    @focus="handleFocus"
  >
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix"></slot>
    </template>
    <template v-if="$slots.suffix" #suffix>
      <slot name="suffix"></slot>
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { ElInput } from 'element-plus'
import type { MyInputProps, MyInputEmits } from './types'

defineOptions({
  name: 'MyInput'
})

withDefaults(defineProps<MyInputProps>(), {
  type: 'text',
  placeholder: '请输入',
  disabled: false,
  clearable: false,
  size: 'default'
})

const emit = defineEmits<MyInputEmits>()

const handleInput = (value: string | number) => {
  emit('update:modelValue', value)
}

const handleChange = (value: string | number) => {
  emit('change', value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>

<style scoped lang="scss">
@import '../style/index.scss';
</style>
