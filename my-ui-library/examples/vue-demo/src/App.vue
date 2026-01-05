<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-8 text-gray-900">
        Vue UI Library Demo
      </h1>

      <!-- Button 演示 -->
      <section class="mb-12 bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-semibold mb-4">Button 组件</h2>
        
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-medium mb-2">不同变体</h3>
            <div class="flex gap-4">
              <Button variant="primary" @click="handleClick('Primary')">
                Primary
              </Button>
              <Button variant="secondary" @click="handleClick('Secondary')">
                Secondary
              </Button>
              <Button variant="danger" @click="handleClick('Danger')">
                Danger
              </Button>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium mb-2">不同尺寸</h3>
            <div class="flex gap-4 items-center">
              <Button size="small">Small</Button>
              <Button size="medium">Medium</Button>
              <Button size="large">Large</Button>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium mb-2">禁用状态</h3>
            <div class="flex gap-4">
              <Button disabled>Disabled</Button>
              <Button variant="primary" disabled>Primary Disabled</Button>
            </div>
          </div>
        </div>
      </section>

      <!-- Input 演示 -->
      <section class="mb-12 bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-semibold mb-4">Input 组件</h2>
        
        <div class="space-y-4 max-w-md">
          <Input
            v-model="username"
            label="用户名"
            placeholder="请输入用户名"
          />

          <Input
            v-model="email"
            label="邮箱"
            type="email"
            placeholder="请输入邮箱"
            :full-width="true"
          />

          <Input
            v-model="password"
            label="密码"
            type="password"
            placeholder="请输入密码"
            error="密码不能少于6位"
          />

          <div class="pt-4">
            <p class="text-sm text-gray-600">
              当前输入值: <strong>{{ username || '(空)' }}</strong>
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button, Input } from '@zzzzzzhaopu/vue';

const username = ref('');
const email = ref('');
const password = ref('');

const handleClick = (type: string) => {
  alert(`${type} clicked!`);
};
</script>
