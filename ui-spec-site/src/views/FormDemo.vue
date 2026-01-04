<template>
  <div class="demo-container">
    <div class="page-header">
      <el-button link @click="$router.back()">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h1>表单示例</h1>
      <p class="subtitle">遵循表单设计规范：最小化输入、即时校验、清晰标签</p>
    </div>

    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span>用户注册表单</span>
          <el-tag type="info">单列布局</el-tag>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        label-position="right"
        size="default"
      >
        <!-- 基本信息 -->
        <div class="form-section">
          <h3 class="section-title">基本信息</h3>
          
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="formData.username"
              placeholder="请输入用户名"
              clearable
              maxlength="20"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="formData.email"
              placeholder="请输入邮箱地址"
              clearable
            >
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="formData.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              show-password
            />
          </el-form-item>
        </div>

        <!-- 个人信息 -->
        <div class="form-section">
          <h3 class="section-title">个人信息</h3>

          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="formData.gender">
              <el-radio label="male">男</el-radio>
              <el-radio label="female">女</el-radio>
              <el-radio label="other">其他</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker
              v-model="formData.birthday"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
              :disabled-date="disabledDate"
            />
          </el-form-item>

          <el-form-item label="所在城市" prop="city">
            <el-select
              v-model="formData.city"
              placeholder="请选择城市"
              clearable
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="city in cityOptions"
                :key="city.value"
                :label="city.label"
                :value="city.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="兴趣爱好" prop="hobbies">
            <el-checkbox-group v-model="formData.hobbies">
              <el-checkbox label="reading">阅读</el-checkbox>
              <el-checkbox label="music">音乐</el-checkbox>
              <el-checkbox label="sports">运动</el-checkbox>
              <el-checkbox label="travel">旅行</el-checkbox>
              <el-checkbox label="coding">编程</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="个人简介" prop="bio">
            <el-input
              v-model="formData.bio"
              type="textarea"
              :rows="4"
              placeholder="请输入个人简介"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </div>

        <!-- 协议确认 -->
        <el-form-item prop="agreement">
          <el-checkbox v-model="formData.agreement">
            我已阅读并同意<el-link type="primary">用户协议</el-link>和<el-link type="primary">隐私政策</el-link>
          </el-checkbox>
        </el-form-item>

        <!-- 按钮组 -->
        <el-form-item>
          <div class="form-actions">
            <el-button type="primary" @click="handleSubmit" :loading="loading">
              提交注册
            </el-button>
            <el-button @click="handleReset">重置</el-button>
            <el-button link @click="handleCancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft, Message } from '@element-plus/icons-vue'

// 表单数据
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  gender: '',
  birthday: '',
  city: '',
  hobbies: [] as string[],
  bio: '',
  agreement: false
})

// 城市选项
const cityOptions = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' },
  { label: '深圳', value: 'shenzhen' },
  { label: '杭州', value: 'hangzhou' },
  { label: '成都', value: 'chengdu' },
  { label: '武汉', value: 'wuhan' },
  { label: '西安', value: 'xian' }
]

// 表单引用
const formRef = ref<FormInstance>()
const loading = ref(false)

// 自定义验证器
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (value.length < 6) {
    callback(new Error('密码长度不能少于6位'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== formData.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

// 表单验证规则
const formRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  birthday: [
    { required: true, message: '请选择出生日期', trigger: 'change' }
  ],
  city: [
    { required: true, message: '请选择所在城市', trigger: 'change' }
  ],
  agreement: [
    { 
      validator: (rule: any, value: any, callback: any) => {
        if (!value) {
          callback(new Error('请阅读并同意用户协议'))
        } else {
          callback()
        }
      }, 
      trigger: 'change' 
    }
  ]
}

// 禁用未来日期
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟提交
      setTimeout(() => {
        loading.value = false
        ElMessage.success('注册成功!')
        console.log('表单数据:', formData)
      }, 1500)
    } else {
      ElMessage.error('请检查表单填写是否正确')
    }
  })
}

// 重置表单
const handleReset = () => {
  formRef.value?.resetFields()
  ElMessage.info('表单已重置')
}

// 取消
const handleCancel = () => {
  ElMessage.info('已取消')
}
</script>

<style scoped>
.demo-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
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

.form-card {
  box-shadow: 0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.12), 0 5px 12px 4px rgba(0,0,0,0.09);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.form-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000d9;
  margin: 0 0 16px 0;
}

.form-actions {
  display: flex;
  gap: 8px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

@media (max-width: 768px) {
  .demo-container {
    padding: 16px;
  }
  
  :deep(.el-form--label-right .el-form-item__label) {
    text-align: left;
  }
}
</style>
