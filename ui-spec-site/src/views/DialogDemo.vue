<template>
  <div class="demo-container">
    <div class="page-header">
      <el-button link @click="$router.back()">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h1>弹窗示例</h1>
      <p class="subtitle">遵循对话框规范：合理尺寸、清晰操作、足不出户</p>
    </div>

    <!-- 操作按钮区域 -->
    <el-card class="button-grid">
      <h3 class="section-title">对话框类型</h3>
      <el-space wrap>
        <el-button type="primary" @click="showBasicDialog">
          基础对话框
        </el-button>
        <el-button type="success" @click="showFormDialog">
          表单对话框
        </el-button>
        <el-button type="warning" @click="showConfirmDialog">
          确认对话框
        </el-button>
        <el-button type="danger" @click="showDeleteDialog">
          删除确认
        </el-button>
        <el-button type="info" @click="showFullscreenDialog">
          全屏对话框
        </el-button>
      </el-space>

      <h3 class="section-title">抽屉类型</h3>
      <el-space wrap>
        <el-button @click="showDrawerRight">
          右侧抽屉
        </el-button>
        <el-button @click="showDrawerLeft">
          左侧抽屉
        </el-button>
        <el-button @click="showDrawerTop">
          顶部抽屉
        </el-button>
        <el-button @click="showDrawerBottom">
          底部抽屉
        </el-button>
      </el-space>

      <h3 class="section-title">其他弹窗</h3>
      <el-space wrap>
        <el-button @click="showPopover">
          气泡确认框
        </el-button>
        <el-button @click="showNestedDialog">
          嵌套对话框
        </el-button>
      </el-space>
    </el-card>

    <!-- 基础对话框 -->
    <el-dialog
      v-model="dialogs.basic"
      title="基础对话框"
      width="520px"
    >
      <p>这是一个基础对话框示例，用于展示简单的信息内容。</p>
      <p>对话框应该有清晰的标题，简洁的内容，以及明确的操作按钮。</p>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogs.basic = false">取消</el-button>
          <el-button type="primary" @click="handleBasicConfirm">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 表单对话框 -->
    <el-dialog
      v-model="dialogs.form"
      title="添加用户"
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="dialogFormRef"
        :model="dialogForm"
        :rules="dialogRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="dialogForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dialogForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="dialogForm.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="编辑" value="editor" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="dialogForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogs.form = false">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleFormSubmit">
            提交
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 全屏对话框 -->
    <el-dialog
      v-model="dialogs.fullscreen"
      title="全屏对话框"
      fullscreen
    >
      <div class="fullscreen-content">
        <h2>全屏内容展示</h2>
        <p>全屏对话框适合展示复杂的内容或需要用户专注的操作。</p>
        <el-divider />
        <el-descriptions title="用户信息" :column="2" border>
          <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
          <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
          <el-descriptions-item label="居住地" :span="2">苏州市</el-descriptions-item>
          <el-descriptions-item label="备注">
            <el-tag size="small">学校</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="联系地址" :span="2">
            江苏省苏州市吴中区吴中大道 1188 号
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogs.fullscreen = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 右侧抽屉 -->
    <el-drawer
      v-model="drawers.right"
      title="用户详情"
      direction="rtl"
      size="50%"
    >
      <div class="drawer-content">
        <el-descriptions title="基本信息" :column="1" border>
          <el-descriptions-item label="姓名">张三</el-descriptions-item>
          <el-descriptions-item label="邮箱">zhangsan@example.com</el-descriptions-item>
          <el-descriptions-item label="电话">13800138000</el-descriptions-item>
          <el-descriptions-item label="地址">北京市朝阳区</el-descriptions-item>
        </el-descriptions>
        <el-divider />
        <h4>操作记录</h4>
        <el-timeline>
          <el-timeline-item timestamp="2024/01/04 10:30" placement="top">
            <el-card>
              <h4>更新用户资料</h4>
              <p>修改了邮箱和电话信息</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2024/01/03 15:20" placement="top">
            <el-card>
              <h4>登录系统</h4>
              <p>从 IP: 192.168.1.1 登录</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2024/01/02 09:15" placement="top">
            <el-card>
              <h4>创建账户</h4>
              <p>账户创建成功</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-drawer>

    <!-- 左侧抽屉 -->
    <el-drawer
      v-model="drawers.left"
      title="筛选条件"
      direction="ltr"
      size="300px"
    >
      <div class="drawer-content">
        <el-form label-width="80px">
          <el-form-item label="分类">
            <el-checkbox-group v-model="filterOptions.categories">
              <el-checkbox label="电子产品" />
              <el-checkbox label="图书" />
              <el-checkbox label="服装" />
              <el-checkbox label="食品" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="价格区间">
            <el-slider v-model="filterOptions.priceRange" range :max="1000" />
          </el-form-item>
          <el-form-item label="评分">
            <el-rate v-model="filterOptions.rating" />
          </el-form-item>
        </el-form>
        <el-divider />
        <div class="drawer-footer">
          <el-button @click="resetFilters">重置</el-button>
          <el-button type="primary" @click="applyFilters">应用</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 顶部抽屉 -->
    <el-drawer
      v-model="drawers.top"
      title="通知中心"
      direction="ttb"
      size="40%"
    >
      <div class="drawer-content">
        <el-alert
          v-for="(item, index) in notifications"
          :key="index"
          :title="item.title"
          :type="item.type"
          :closable="false"
          style="margin-bottom: 12px"
        >
          {{ item.message }}
        </el-alert>
      </div>
    </el-drawer>

    <!-- 底部抽屉 -->
    <el-drawer
      v-model="drawers.bottom"
      title="快捷操作"
      direction="btt"
      size="30%"
    >
      <div class="drawer-content">
        <el-row :gutter="16">
          <el-col :span="6" v-for="i in 8" :key="i">
            <el-card shadow="hover" class="quick-action-card">
              <el-icon :size="32"><Setting /></el-icon>
              <p>操作{{ i }}</p>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-drawer>

    <!-- 嵌套对话框 - 外层 -->
    <el-dialog
      v-model="dialogs.nested"
      title="外层对话框"
      width="720px"
    >
      <p>这是外层对话框的内容。</p>
      <el-button type="primary" @click="dialogs.nestedInner = true">
        打开内层对话框
      </el-button>
      
      <!-- 嵌套对话框 - 内层 -->
      <el-dialog
        v-model="dialogs.nestedInner"
        title="内层对话框"
        width="520px"
        append-to-body
      >
        <p>这是内层对话框的内容。</p>
        <template #footer>
          <el-button @click="dialogs.nestedInner = false">关闭</el-button>
        </template>
      </el-dialog>
      
      <template #footer>
        <el-button @click="dialogs.nested = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft, Setting } from '@element-plus/icons-vue'

// 对话框显示状态
const dialogs = reactive({
  basic: false,
  form: false,
  fullscreen: false,
  nested: false,
  nestedInner: false
})

// 抽屉显示状态
const drawers = reactive({
  right: false,
  left: false,
  top: false,
  bottom: false
})

// 表单数据
const dialogForm = reactive({
  username: '',
  email: '',
  role: '',
  remark: ''
})

const dialogFormRef = ref<FormInstance>()
const submitLoading = ref(false)

// 表单验证规则
const dialogRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 筛选选项
const filterOptions = reactive({
  categories: [] as string[],
  priceRange: [0, 1000],
  rating: 0
})

// 通知数据
const notifications = ref([
  { title: '系统通知', message: '您有一条新的系统消息', type: 'info' },
  { title: '成功通知', message: '操作已成功完成', type: 'success' },
  { title: '警告通知', message: '请注意检查您的账户安全', type: 'warning' },
  { title: '错误通知', message: '操作失败，请重试', type: 'error' }
])

// 显示各种对话框
const showBasicDialog = () => {
  dialogs.basic = true
}

const showFormDialog = () => {
  dialogs.form = true
}

const showConfirmDialog = () => {
  ElMessageBox.confirm(
    '此操作将永久删除该文件, 是否继续?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    ElMessage.success('删除成功!')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const showDeleteDialog = () => {
  ElMessageBox.confirm(
    '确定要删除这条数据吗？删除后将无法恢复。',
    '危险操作',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'error',
      buttonSize: 'default'
    }
  ).then(() => {
    ElMessage.success('已删除')
  })
}

const showFullscreenDialog = () => {
  dialogs.fullscreen = true
}

const showNestedDialog = () => {
  dialogs.nested = true
}

// 显示抽屉
const showDrawerRight = () => {
  drawers.right = true
}

const showDrawerLeft = () => {
  drawers.left = true
}

const showDrawerTop = () => {
  drawers.top = true
}

const showDrawerBottom = () => {
  drawers.bottom = true
}

// 显示气泡确认框
const showPopover = () => {
  ElMessageBox.confirm(
    '这是一个简单的确认提示',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }
  )
}

// 处理基础对话框确认
const handleBasicConfirm = () => {
  dialogs.basic = false
  ElMessage.success('操作成功')
}

// 处理表单提交
const handleFormSubmit = async () => {
  if (!dialogFormRef.value) return
  
  await dialogFormRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      setTimeout(() => {
        submitLoading.value = false
        dialogs.form = false
        ElMessage.success('提交成功')
        console.log('表单数据:', dialogForm)
      }, 1000)
    }
  })
}

// 重置表单
const resetForm = () => {
  dialogFormRef.value?.resetFields()
}

// 重置筛选
const resetFilters = () => {
  filterOptions.categories = []
  filterOptions.priceRange = [0, 1000]
  filterOptions.rating = 0
  ElMessage.info('已重置筛选条件')
}

// 应用筛选
const applyFilters = () => {
  drawers.left = false
  ElMessage.success('已应用筛选条件')
  console.log('筛选条件:', filterOptions)
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

.button-grid {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000d9;
  margin: 16px 0 12px 0;
}

.section-title:first-child {
  margin-top: 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.fullscreen-content {
  padding: 24px;
}

.drawer-content {
  padding: 0 8px;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

.quick-action-card {
  text-align: center;
  cursor: pointer;
  margin-bottom: 16px;
}

.quick-action-card:hover {
  box-shadow: 0 3px 6px -4px rgba(0,0,0,0.12), 0 6px 16px 0 rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05);
}

.quick-action-card p {
  margin: 8px 0 0 0;
  font-size: 14px;
}

:deep(.el-alert) {
  margin-bottom: 12px;
}
</style>
