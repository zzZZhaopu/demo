<template>
  <div :class="['flex flex-col gap-1', fullWidth && 'w-full']">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <input
      :value="modelValue"
      :class="inputClasses"
      @input="handleInput"
      v-bind="$attrs"
    />
    <span v-if="error" class="text-sm text-red-500">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { InputProps } from './types';

const props = withDefaults(defineProps<InputProps>(), {
  fullWidth: false
});

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>();

const inputClasses = computed(() => [
  'px-3 py-2 border rounded-md',
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  props.error ? 'border-red-500' : 'border-gray-300',
  props.fullWidth && 'w-full'
]);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>
