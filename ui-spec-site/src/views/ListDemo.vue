<template>
  <div class="demo-container">
    <div class="page-header">
      <el-button link @click="$router.back()">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h1>列表示例</h1>
      <p class="subtitle">遵循数据展示规范：信息层次、操作位置、分页加载</p>
    </div>

    <!-- 筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="用户名">
          <el-input
            v-model="filterForm.username"
            placeholder="请输入用户名"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="filterForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="激活" value="active" />
            <el-option label="禁用" value="inactive" />
            <el-option label="待审核" value="pending" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <div class="toolbar">
      <div>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增用户
        </el-button>
        <el-button 
          :disabled="selectedIds.length === 0" 
          @click="handleBatchDelete"
        >
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon>
          导出
        </el-button>
      </div>
      <div class="toolbar-right">
        <el-tooltip content="刷新">
          <el-button circle @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        @selection-change="handleSelectionChange"
        :header-cell-style="{ background: '#fafafa', color: '#000000d9', fontWeight: 600 }"
      >
        <el-table-column type="selection" width="55" fixed="left" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" min-width="120">
          <template #default="{ row }">
            <div class="user-info">
              <el-avatar :size="32" :src="row.avatar" />
              <span class="username">{{ row.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)">
              {{ getRoleText(row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" sortable />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">
              查看
            </el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-popconfirm
              title="确定要删除这条数据吗？"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button link type="danger" size="small">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  ArrowLeft, Search, Plus, Delete, Download, 
  Refresh 
} from '@element-plus/icons-vue'

// 接口定义
interface User {
  id: number
  username: string
  email: string
  avatar: string
  role: string
  status: string
  createTime: string
}

// 筛选表单
const filterForm = reactive({
  username: '',
  status: ''
})

// 分页数据
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 表格数据
const tableData = ref<User[]>([])
const loading = ref(false)
const selectedIds = ref<number[]>([])

// Mock 数据
const mockUsers: User[] = Array.from({ length: 46 }, (_, i) => {
  const roles = ['admin', 'user', 'editor']
  const statuses = ['active', 'inactive', 'pending']
  return {
    id: i + 1,
    username: `user_${i + 1}`,
    email: `user${i + 1}@example.com`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
    role: roles[Math.floor(Math.random() * 3)] as string,
    status: statuses[Math.floor(Math.random() * 3)] as string,
    createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleString()
  }
})

// 加载数据
const loadData = () => {
  loading.value = true
  
  setTimeout(() => {
    // 模拟筛选
    let filteredData = [...mockUsers]
    
    if (filterForm.username) {
      filteredData = filteredData.filter(item =>
        item.username.includes(filterForm.username)
      )
    }
    
    if (filterForm.status) {
      filteredData = filteredData.filter(item => item.status === filterForm.status)
    }
    
    pagination.total = filteredData.length
    
    // 分页
    const start = (pagination.page - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    tableData.value = filteredData.slice(start, end)
    
    loading.value = false
  }, 500)
}

// 角色类型
const getRoleType = (role: string) => {
  const types: Record<string, any> = {
    admin: 'danger',
    editor: 'warning',
    user: ''
  }
  return types[role] || ''
}

const getRoleText = (role: string) => {
  const texts: Record<string, string> = {
    admin: '管理员',
    editor: '编辑',
    user: '普通用户'
  }
  return texts[role] || role
}

// 状态类型
const getStatusType = (status: string) => {
  const types: Record<string, any> = {
    active: 'success',
    inactive: 'info',
    pending: 'warning'
  }
  return types[status] || ''
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    active: '激活',
    inactive: '禁用',
    pending: '待审核'
  }
  return texts[status] || status
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  filterForm.username = ''
  filterForm.status = ''
  pagination.page = 1
  loadData()
}

// 刷新
const handleRefresh = () => {
  loadData()
  ElMessage.success('刷新成功')
}

// 新增
const handleAdd = () => {
  ElMessage.info('打开新增用户对话框')
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedIds.value.length} 条数据吗?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    ElMessage.success('删除成功')
    selectedIds.value = []
    loadData()
  })
}

// 导出
const handleExport = () => {
  ElMessage.success('导出成功')
}

// 查看
const handleView = (row: User) => {
  ElMessage.info(`查看用户: ${row.username}`)
}

// 编辑
const handleEdit = (row: User) => {
  ElMessage.info(`编辑用户: ${row.username}`)
}

// 删除
const handleDelete = (row: User) => {
  ElMessage.success(`删除用户: ${row.username}`)
  loadData()
}

// 选择变化
const handleSelectionChange = (selection: User[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 分页变化
const handleSizeChange = () => {
  loadData()
}

const handleCurrentChange = () => {
  loadData()
}

// 初始化
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.demo-container {
  max-width: 1400px;
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

.filter-card {
  margin-bottom: 16px;
}

.filter-form {
  margin-bottom: 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 2px;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  font-weight: 500;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

@media (max-width: 768px) {
  .demo-container {
    padding: 16px;
  }
  
  .toolbar {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  
  .filter-form :deep(.el-form-item) {
    margin-right: 0;
    margin-bottom: 8px;
  }
}
</style>
