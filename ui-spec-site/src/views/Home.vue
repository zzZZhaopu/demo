<template>
  <div class="home-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>前端开发规范示例</h1>
      <p class="subtitle">基于 Ant Design 设计体系的组件展示</p>
    </div>

    <!-- 导航卡片 -->
    <div class="nav-grid">
      <el-card 
        class="nav-card" 
        shadow="hover"
        @click="navigateTo('/form-demo')"
      >
        <div class="card-content">
          <el-icon class="card-icon" :size="48" color="#1890ff">
            <Edit />
          </el-icon>
          <h3>表单示例</h3>
          <p>数据录入、表单校验、布局规范</p>
        </div>
      </el-card>

      <el-card 
        class="nav-card" 
        shadow="hover"
        @click="navigateTo('/list-demo')"
      >
        <div class="card-content">
          <el-icon class="card-icon" :size="48" color="#52c41a">
            <List />
          </el-icon>
          <h3>列表示例</h3>
          <p>数据展示、表格操作、分页加载</p>
        </div>
      </el-card>

      <el-card 
        class="nav-card" 
        shadow="hover"
        @click="navigateTo('/dialog-demo')"
      >
        <div class="card-content">
          <el-icon class="card-icon" :size="48" color="#faad14">
            <Monitor />
          </el-icon>
          <h3>弹窗示例</h3>
          <p>对话框、抽屉、模态操作</p>
        </div>
      </el-card>

      <el-card 
        class="nav-card" 
        shadow="hover"
        @click="navigateTo('/feedback-demo')"
      >
        <div class="card-content">
          <el-icon class="card-icon" :size="48" color="#f5222d">
            <Bell />
          </el-icon>
          <h3>反馈示例</h3>
          <p>消息提示、通知、加载状态</p>
        </div>
      </el-card>
    </div>

    <!-- 设计价值观展示 -->
    <div class="values-section">
      <h2>设计价值观</h2>
      <el-row :gutter="16">
        <el-col :xs="24" :sm="12" :md="6">
          <el-card>
            <template #header>
              <div class="value-header">自然</div>
            </template>
            <p class="value-desc">追求自然交互，降低用户认知成本</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card>
            <template #header>
              <div class="value-header">确定性</div>
            </template>
            <p class="value-desc">高确定性、低合作熵的界面状态</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card>
            <template #header>
              <div class="value-header">意义感</div>
            </template>
            <p class="value-desc">为工作过程创造富有意义感的人机交互</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card>
            <template #header>
              <div class="value-header">生长性</div>
            </template>
            <p class="value-desc">用发展的眼光做设计，考虑人机共同生长</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Edit, List, Monitor, Bell } from '@element-plus/icons-vue'

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 600;
  color: #000000d9;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #00000073;
  margin: 0;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 48px;
}

.nav-card {
  cursor: pointer;
  transition: all 0.3s;
}

.nav-card:hover {
  transform: translateY(-4px);
}

.card-content {
  text-align: center;
  padding: 24px 16px;
}

.card-icon {
  margin-bottom: 16px;
}

.card-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #000000d9;
  margin: 0 0 8px 0;
}

.card-content p {
  font-size: 14px;
  color: #00000073;
  margin: 0;
}

.values-section {
  margin-top: 48px;
}

.values-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: #000000d9;
  margin-bottom: 16px;
}

.value-header {
  font-weight: 600;
  color: #1890ff;
}

.value-desc {
  font-size: 14px;
  color: #00000073;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 24px;
  }
  
  .nav-grid {
    grid-template-columns: 1fr;
  }
}
</style>
