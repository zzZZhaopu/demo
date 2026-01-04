<template>
  <div class="demo-container">
    <div class="page-header">
      <el-button link @click="$router.back()">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h1>反馈示例</h1>
      <p class="subtitle">遵循反馈规范：即时反馈、明确类型、适当位置</p>
    </div>

    <!-- 消息提示 -->
    <el-card class="section-card">
      <template #header>
        <div class="card-header">
          <span>Message 消息提示</span>
          <el-tag type="info">顶部居中 / 3秒自动消失</el-tag>
        </div>
      </template>
      <el-space wrap>
        <el-button @click="showMessage('success')">成功消息</el-button>
        <el-button @click="showMessage('warning')">警告消息</el-button>
        <el-button @click="showMessage('info')">信息消息</el-button>
        <el-button @click="showMessage('error')">错误消息</el-button>
        <el-button @click="showMessageWithClose">可关闭消息</el-button>
        <el-button @click="showMessageHTML">HTML内容</el-button>
      </el-space>
    </el-card>

    <!-- 通知 -->
    <el-card class="section-card">
      <template #header>
        <div class="card-header">
          <span>Notification 通知</span>
          <el-tag type="info">右上角 / 4.5秒 / 可操作</el-tag>
        </div>
      </template>
      <el-space wrap>
        <el-button @click="showNotification('success')">成功通知</el-button>
        <el-button @click="showNotification('warning')">警告通知</el-button>
        <el-button @click="showNotification('info')">信息通知</el-button>
        <el-button @click="showNotification('error')">错误通知</el-button>
        <el-button @click="showNotificationWithAction">带操作通知</el-button>
        <el-button @click="showCustomNotification">自定义位置</el-button>
      </el-space>
    </el-card>

    <!-- 加载状态 -->
    <el-card class="section-card">
      <template #header>
        <div class="card-header">
          <span>Loading 加载</span>
          <el-tag type="info">全局 / 局部 / 自定义</el-tag>
        </div>
      </template>
      <el-space wrap direction="vertical" style="width: 100%">
        <div>
          <el-button @click="showFullScreenLoading">全屏加载</el-button>
          <el-button @click="showCustomLoading">自定义文本</el-button>
          <el-button @click="showLoadingInElement">元素内加载</el-button>
        </div>
        
        <el-card v-loading="cardLoading" element-loading-text="加载中..." class="loading-demo">
          <p>这是一个带加载状态的卡片</p>
          <p>可以在卡片上显示加载遮罩层</p>
          <el-button @click="toggleCardLoading">
            {{ cardLoading ? '停止加载' : '开始加载' }}
          </el-button>
        </el-card>
      </el-space>
    </el-card>

    <!-- 进度条 -->
    <el-card class="section-card">
      <template #header>
        <div class="card-header">
          <span>Progress 进度条</span>
          <el-tag type="info">展示操作进度</el-tag>
        </div>
      </template>
      <el-space wrap direction="vertical" style="width: 100%">
        <div>
          <el-button @click="startProgress">开始进度</el-button>
          <el-button @click="resetProgress">重置</el-button>
        </div>
        
        <div>
          <p>直线进度条</p>
          <el-progress :percentage="progressValue" />
        </div>
        
        <div>
          <p>不同状态的进度条</p>
          <el-progress :percentage="100" status="success" />
          <el-progress :percentage="70" status="warning" style="margin-top: 8px" />
          <el-progress :percentage="50" status="exception" style="margin-top: 8px" />
        </div>
        
        <div>
          <p>环形进度条</p>
          <el-row :gutter="16">
            <el-col :span="6">
              <el-progress type="circle" :percentage="progressValue" />
            </el-col>
            <el-col :span="6">
              <el-progress type="circle" :percentage="100" status="success" />
            </el-col>
            <el-col :span="6">
              <el-progress type="circle" :percentage="70" status="warning" />
            </el-col>
            <el-col :span="6">
              <el-progress type="circle" :percentage="50" status="exception" />
            </el-col>
          </el-row>
        </div>
      </el-space>
    </el-card>

    <!-- 结果反馈 -->
    <el-card class="section-card">
      <template #header>
        <div class="card-header">
          <span>Result 结果</span>
          <el-tag type="info">操作结果展示</el-tag>
        </div>
      </template>
      <el-space wrap>
        <el-button @click="showResult('success')">成功结果</el-button>
        <el-button @click="showResult('warning')">警告结果</el-button>
        <el-button @click="showResult('error')">失败结果</el-button>
        <el-button @click="showResult('info')">信息结果</el-button>
      </el-space>
      
      <el-dialog v-model="resultDialog.visible" :title="resultDialog.title" width="600px">
        <el-result
          :icon="resultDialog.icon"
          :title="resultDialog.title"
          :sub-title="resultDialog.subTitle"
        >
          <template #extra>
            <el-button type="primary" @click="resultDialog.visible = false">
              返回
            </el-button>
          </template>
        </el-result>
      </el-dialog>
    </el-card>

    <!-- 骨架屏 -->
    <el-card class="section-card">
      <template #header>
        <div class="card-header">
          <span>Skeleton 骨架屏</span>
          <el-tag type="info">加载占位</el-tag>
        </div>
      </template>
      <el-space wrap direction="vertical" style="width: 100%">
        <el-button @click="toggleSkeleton">
          {{ showSkeleton ? '显示内容' : '显示骨架屏' }}
        </el-button>
        
        <el-skeleton :loading="showSkeleton" animated :rows="5">
          <template #default>
            <el-card>
              <template #header>
                <div class="card-header">
                  <el-avatar :size="40" src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" />
                  <div style="margin-left: 12px">
                    <div style="font-weight: 600">用户名称</div>
                    <div style="font-size: 12px; color: #909399">2024-01-04 10:30</div>
                  </div>
                </div>
              </template>
              <p>这是实际加载完成后显示的内容。</p>
              <p>骨架屏在内容加载时提供视觉占位，改善用户体验。</p>
              <el-image
                src="https://picsum.photos/800/400"
                fit="cover"
                style="width: 100%; border-radius: 4px"
              />
            </el-card>
          </template>
        </el-skeleton>
      </el-space>
    </el-card>

    <!-- 空状态 -->
    <el-card class="section-card">
      <template #header>
        <div class="card-header">
          <span>Empty 空状态</span>
          <el-tag type="info">无数据展示</el-tag>
        </div>
      </template>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-empty description="暂无数据" />
        </el-col>
        <el-col :span="8">
          <el-empty description="没有找到相关内容">
            <el-button type="primary">刷新</el-button>
          </el-empty>
        </el-col>
        <el-col :span="8">
          <el-empty
            image="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            description="自定义图片"
          />
        </el-col>
      </el-row>
    </el-card>

    <!-- Alert 提示 -->
    <el-card class="section-card">
      <template #header>
        <div class="card-header">
          <span>Alert 警告提示</span>
          <el-tag type="info">页面级提示</el-tag>
        </div>
      </template>
      <el-space wrap direction="vertical" style="width: 100%">
        <el-alert title="成功提示" type="success" show-icon />
        <el-alert title="消息提示" type="info" show-icon />
        <el-alert title="警告提示" type="warning" show-icon />
        <el-alert title="错误提示" type="error" show-icon />
        <el-alert
          title="带辅助性文字介绍"
          type="success"
          description="这是一段辅助性文字介绍，可以帮助用户更好地理解提示内容。"
          show-icon
        />
        <el-alert
          title="可关闭的提示"
          type="warning"
          show-icon
          closable
          @close="handleAlertClose"
        />
      </el-space>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElNotification, ElLoading } from 'element-plus'
import { ArrowLeft, SuccessFilled, WarningFilled, InfoFilled, CircleCloseFilled } from '@element-plus/icons-vue'

// 加载状态
const cardLoading = ref(false)
const showSkeleton = ref(false)

// 进度值
const progressValue = ref(0)
let progressTimer: any = null

// 结果对话框
const resultDialog = reactive({
  visible: false,
  icon: SuccessFilled,
  title: '',
  subTitle: ''
})

// 显示消息
const showMessage = (type: 'success' | 'warning' | 'info' | 'error') => {
  const messages = {
    success: '操作成功！',
    warning: '警告：请注意检查！',
    info: '这是一条普通消息',
    error: '操作失败，请重试'
  }
  ElMessage({
    message: messages[type],
    type,
    duration: 3000
  })
}

const showMessageWithClose = () => {
  ElMessage({
    message: '这是一条可以手动关闭的消息',
    type: 'info',
    showClose: true,
    duration: 0
  })
}

const showMessageHTML = () => {
  ElMessage({
    dangerouslyUseHTMLString: true,
    message: '<strong>这是 <i>HTML</i> 片段</strong>',
    type: 'info'
  })
}

// 显示通知
const showNotification = (type: 'success' | 'warning' | 'info' | 'error') => {
  const config = {
    success: {
      title: '成功',
      message: '恭喜你，操作成功完成！'
    },
    warning: {
      title: '警告',
      message: '警告：这是一条警告通知，请注意检查相关信息。'
    },
    info: {
      title: '消息',
      message: '这是一条普通的通知消息。'
    },
    error: {
      title: '错误',
      message: '糟糕，操作失败了，请检查后重试。'
    }
  }
  
  ElNotification({
    ...config[type],
    type,
    duration: 4500
  })
}

const showNotificationWithAction = () => {
  ElNotification({
    title: '更新提示',
    message: '发现新版本，是否立即更新？',
    type: 'info',
    duration: 0,
    showClose: true,
    position: 'top-right'
  })
}

const showCustomNotification = () => {
  ElNotification({
    title: '自定义位置',
    message: '通知显示在左下角',
    type: 'success',
    position: 'bottom-left'
  })
}

// 全屏加载
const showFullScreenLoading = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  setTimeout(() => {
    loading.close()
    ElMessage.success('加载完成')
  }, 2000)
}

const showCustomLoading = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '正在处理您的请求，请稍候...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  setTimeout(() => {
    loading.close()
  }, 3000)
}

const showLoadingInElement = () => {
  cardLoading.value = true
  setTimeout(() => {
    cardLoading.value = false
  }, 2000)
}

const toggleCardLoading = () => {
  cardLoading.value = !cardLoading.value
}

// 进度条
const startProgress = () => {
  progressValue.value = 0
  if (progressTimer) {
    clearInterval(progressTimer)
  }
  
  progressTimer = setInterval(() => {
    if (progressValue.value >= 100) {
      clearInterval(progressTimer)
      ElMessage.success('进度完成')
    } else {
      progressValue.value += 10
    }
  }, 300)
}

const resetProgress = () => {
  if (progressTimer) {
    clearInterval(progressTimer)
  }
  progressValue.value = 0
}

// 结果展示
const showResult = (type: 'success' | 'warning' | 'error' | 'info') => {
  const config = {
    success: {
      icon: SuccessFilled,
      title: '操作成功',
      subTitle: '您的操作已经成功完成，可以继续进行下一步操作。'
    },
    warning: {
      icon: WarningFilled,
      title: '警告提示',
      subTitle: '您的操作存在风险，请谨慎处理。'
    },
    error: {
      icon: CircleCloseFilled,
      title: '操作失败',
      subTitle: '很抱歉，操作失败了，请检查后重试。'
    },
    info: {
      icon: InfoFilled,
      title: '信息提示',
      subTitle: '这是一条普通的信息提示。'
    }
  }
  
  resultDialog.icon = config[type].icon
  resultDialog.title = config[type].title
  resultDialog.subTitle = config[type].subTitle
  resultDialog.visible = true
}

// 骨架屏
const toggleSkeleton = () => {
  showSkeleton.value = !showSkeleton.value
}

// Alert关闭
const handleAlertClose = () => {
  ElMessage.info('Alert已关闭')
}
</script>

<style scoped>
.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 16px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #000000d9;
  margin: 8px 0;
}

.subtitle {
  font-size: 14px;
  color: #00000073;
  margin: 0;
}

.section-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.loading-demo {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

:deep(.el-progress) {
  margin-top: 8px;
}

:deep(.el-alert) {
  margin-bottom: 12px;
}

:deep(.el-alert:last-child) {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .demo-container {
    padding: 16px;
  }
}
</style>
