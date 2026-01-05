<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

// 无需导入,自动引入 ElMessage
const count = ref(0)

const handleClick = () => {
  count.value++
  // 自动导入的函数,带类型提示
  ElMessage.success(`点击次数: ${count.value}`)
}
</script>

<template>
  <div class="test-page">
    <h1>Element Plus 按需引入测试</h1>
    
    <!-- 无需导入,自动识别组件 -->
    <el-space direction="vertical" size="large">
      <!-- 按钮 -->
      <el-button type="primary" @click="handleClick">
        点击我 ({{ count }})
      </el-button>
      
      <!-- 输入框 -->
      <el-input v-model="count" placeholder="输入数字" />
      
      <!-- 卡片 -->
      <el-card style="width: 400px">
        <template #header>
          <span>卡片标题</span>
        </template>
        <div>卡片内容</div>
      </el-card>
      
      <!-- 标签 -->
      <div>
        <el-tag>标签1</el-tag>
        <el-tag type="success">标签2</el-tag>
        <el-tag type="warning">标签3</el-tag>
        <el-tag type="danger">标签4</el-tag>
      </div>
    </el-space>
  </div>
</template>

<style scoped>
.test-page {
  padding: 40px;
}

h1 {
  margin-bottom: 20px;
  color: var(--el-color-primary);
}
</style>
