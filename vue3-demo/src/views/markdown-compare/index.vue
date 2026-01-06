<template>
  <div class="markdown-compare-container">
    <h1>Markdown 渲染方案对比</h1>
    
    <!-- 输入区域 -->
    <div class="input-section">
      <h2>测试内容</h2>
      <el-input
        v-model="markdownContent"
        type="textarea"
        :rows="10"
        placeholder="输入 Markdown 内容进行测试..."
      />
      <div class="preset-buttons">
        <el-button @click="loadPreset1">加载示例 1（基础语法）</el-button>
        <el-button @click="loadPreset2">加载示例 2（代码块）</el-button>
        <el-button @click="loadPreset3">加载示例 3（综合测试）</el-button>
      </div>
    </div>
    
    <!-- 对比展示区域 -->
    <div class="compare-section">
      <!-- 方案三 -->
      <div class="renderer-card">
        <div class="card-header">
          <h3>方案三：marked + highlight.js</h3>
          <el-tag type="success">手动集成</el-tag>
        </div>
        <div class="card-desc">
          <p>✅ 最流行的组合</p>
          <p>✅ 灵活性高</p>
          <p>⚠️ 需要手动配置</p>
        </div>
        <div class="card-body">
          <MarkdownRenderer3 :content="markdownContent" />
        </div>
      </div>
      
      <!-- 方案四 -->
      <div class="renderer-card">
        <div class="card-header">
          <h3>方案四：vue3-markdown-it</h3>
          <el-tag type="primary">开箱即用</el-tag>
        </div>
        <div class="card-desc">
          <p>✅ Vue 3 专用组件</p>
          <p>✅ 配置简单</p>
          <p>✅ 响应式更新</p>
        </div>
        <div class="card-body">
          <MarkdownRenderer4 :content="markdownContent" />
        </div>
      </div>
      
      <!-- 方案五 -->
      <div class="renderer-card">
        <div class="card-header">
          <h3>方案五：marked + DOMPurify + highlight.js</h3>
          <el-tag type="danger">最安全</el-tag>
        </div>
        <div class="card-desc">
          <p>✅ XSS 防护最强</p>
          <p>✅ 适合 AI 对话</p>
          <p>✅ 代码复制功能</p>
        </div>
        <div class="card-body">
          <MarkdownRenderer5 :content="markdownContent" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import MarkdownRenderer3 from '@/components/MarkdownRenderer3.vue';
import MarkdownRenderer4 from '@/components/MarkdownRenderer4.vue';
import MarkdownRenderer5 from '@/components/MarkdownRenderer5.vue';

// Markdown 内容
const markdownContent = ref(`# 欢迎使用 Markdown 渲染器

这是一个 **Markdown 渲染器**对比页面。

## 功能特性

- 支持标题
- 支持**粗体**和*斜体*
- 支持列表
- 支持代码高亮

\`\`\`javascript
function hello() {
  console.log('Hello, Markdown!');
}
\`\`\`

> 这是一个引用块
`);

// 预设示例 1：基础语法
const loadPreset1 = () => {
  markdownContent.value = `# Markdown 基础语法测试

## 文本格式

这是**粗体文本**，这是*斜体文本*，这是~~删除线~~。

## 列表

### 无序列表
- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2
- 项目 3

### 有序列表
1. 第一步
2. 第二步
3. 第三步

## 链接和图片

[访问 GitHub](https://github.com)

## 引用

> 这是一段引用文本。
> 可以有多行。

## 分割线

---

这是分割线后的内容。
`;
};

// 预设示例 2：代码块
const loadPreset2 = () => {
  markdownContent.value = `# 代码高亮测试

## JavaScript 代码

\`\`\`javascript
// 这是一段 JavaScript 代码
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 输出: 55
\`\`\`

## Python 代码

\`\`\`python
# 这是一段 Python 代码
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

print(quick_sort([3, 6, 8, 10, 1, 2, 1]))
\`\`\`

## 行内代码

这是一段包含 \`const name = 'Vue 3'\` 的行内代码。
`;
};

// 预设示例 3：综合测试
const loadPreset3 = () => {
  markdownContent.value = `# 🎉 Markdown 综合功能测试

## 📝 表格测试

| 方案 | 优点 | 缺点 | 推荐指数 |
|------|------|------|----------|
| marked | 流行稳定 | 需配置 | ⭐⭐⭐⭐ |
| vue3-markdown-it | 开箱即用 | 社区小 | ⭐⭐⭐⭐⭐ |
| marked + DOMPurify | 最安全 | 复杂 | ⭐⭐⭐⭐⭐ |

## 💻 复杂代码示例

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/users');
  const data = await response.json();
  return data.map((user: any) => ({
    id: user.id,
    name: user.name,
    email: user.email
  }));
}

// 使用示例
fetchUsers().then(users => {
  console.log('用户列表:', users);
});
\`\`\`

## 📚 嵌套引用

> 一级引用
>> 二级引用
>>> 三级引用

## ✨ 混合内容

这是一段包含 **粗体**、*斜体* 和 \`代码\` 的混合文本。

[点击访问外部链接](https://example.com)

---

**测试完成！** 🎊
`;
};
</script>

<style lang="scss" scoped>
.markdown-compare-container {
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
  
  h1 {
    text-align: center;
    font-size: 2em;
    margin-bottom: 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  // 输入区域
  .input-section {
    margin-bottom: 30px;
    padding: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    
    h2 {
      margin-bottom: 16px;
      font-size: 1.5em;
    }
    
    .preset-buttons {
      margin-top: 12px;
      display: flex;
      gap: 12px;
    }
  }
  
  // 对比展示区域
  .compare-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: 20px;
    
    .renderer-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      
      .card-header {
        padding: 16px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        h3 {
          margin: 0;
          font-size: 1.1em;
        }
      }
      
      .card-desc {
        padding: 12px 20px;
        background: #f9fafb;
        border-bottom: 1px solid #e1e4e8;
        
        p {
          margin: 4px 0;
          font-size: 13px;
          color: #6a737d;
        }
      }
      
      .card-body {
        padding: 20px;
        max-height: 600px;
        overflow-y: auto;
        
        // 自定义滚动条
        &::-webkit-scrollbar {
          width: 6px;
        }
        
        &::-webkit-scrollbar-thumb {
          background: #dcdfe6;
          border-radius: 3px;
          
          &:hover {
            background: #c0c4cc;
          }
        }
      }
    }
  }
}
</style>
