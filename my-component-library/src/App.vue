<template>
  <div class="app-container">
    <h1>My UI Library - 组件开发预览</h1>
    
    <section class="demo-section">
      <h2>按钮组件 MyButton</h2>
      <div class="demo-row">
        <MyButton @click="handleClick">默认按钮</MyButton>
        <MyButton type="success">成功按钮</MyButton>
        <MyButton type="warning">警告按钮</MyButton>
        <MyButton type="danger">危险按钮</MyButton>
        <MyButton type="info">信息按钮</MyButton>
      </div>
      
      <div class="demo-row">
        <MyButton size="large">大型按钮</MyButton>
        <MyButton>默认按钮</MyButton>
        <MyButton size="small">小型按钮</MyButton>
      </div>
      
      <div class="demo-row">
        <MyButton round>圆角按钮</MyButton>
        <MyButton :loading="loading">加载按钮</MyButton>
        <MyButton disabled>禁用按钮</MyButton>
      </div>
    </section>

    <section class="demo-section">
      <h2>输入框组件 MyInput</h2>
      <div class="demo-col">
        <MyInput v-model="inputValue" placeholder="请输入内容" />
        <p>输入值: {{ inputValue }}</p>
        
        <MyInput v-model="inputValue2" placeholder="可清空" clearable />
        
        <MyInput v-model="inputValue3" type="password" placeholder="请输入密码" />
      </div>
    </section>

    <section class="demo-section">
      <h2>卡片组件 MyCard</h2>
      <div class="demo-row">
        <MyCard header="默认卡片" style="width: 300px;">
          <p>这是卡片内容</p>
          <p>支持自定义内容</p>
        </MyCard>
        
        <MyCard shadow="hover" style="width: 300px;">
          <template #header>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>自定义标题</span>
              <el-button type="text">操作按钮</el-button>
            </div>
          </template>
          <p>悬停显示阴影</p>
        </MyCard>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const inputValue = ref('')
const inputValue2 = ref('')
const inputValue3 = ref('')
const loading = ref(false)

const handleClick = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    alert('按钮点击成功！')
  }, 2000)
}
</script>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
  color: #333;
}

.demo-section {
  margin-bottom: 50px;
  padding: 30px;
  background: #f5f7fa;
  border-radius: 8px;
}

.demo-section h2 {
  margin-bottom: 20px;
  color: #409eff;
  border-bottom: 2px solid #409eff;
  padding-bottom: 10px;
}

.demo-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.demo-col {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
