# Markdown 渲染组件使用指南

## 📦 已创建的组件

### 1. MarkdownRenderer3.vue（方案三）
**技术栈：** marked + highlight.js

**特点：**
- ✅ 最流行的组合，社区支持最好
- ✅ 灵活性高，可自定义配置
- ✅ GitHub 风格样式
- ⚠️ 需要手动配置

**使用场景：** 适合需要高度自定义的场景

**代码高亮主题：** GitHub Dark

---

### 2. MarkdownRenderer4.vue（方案四）
**技术栈：** vue3-markdown-it

**特点：**
- ✅ Vue 3 专用组件，开箱即用
- ✅ 配置最简单
- ✅ 自动响应式更新
- ✅ 现代化设计，渐变色主题

**使用场景：** 适合快速开发，不需要复杂配置

**代码高亮主题：** Atom One Dark

---

### 3. MarkdownRenderer5.vue（方案五）⭐ **推荐**
**技术栈：** marked + DOMPurify + highlight.js

**特点：**
- ✅ **安全性最强**，DOMPurify 提供 XSS 防护
- ✅ **最适合 AI 对话场景**
- ✅ 代码块带复制功能
- ✅ 外部链接自动在新窗口打开
- ✅ 标题带装饰符号
- ✅ 专业级设计

**使用场景：** **AI 对话、用户生成内容**等需要高安全性的场景

**代码高亮主题：** Monokai Sublime

---

## 🚀 快速开始

### 基础用法

```vue
<template>
  <div>
    <!-- 方案三 -->
    <MarkdownRenderer3 :content="markdownText" />
    
    <!-- 方案四 -->
    <MarkdownRenderer4 :content="markdownText" />
    
    <!-- 方案五（推荐用于 AI 对话） -->
    <MarkdownRenderer5 :content="markdownText" />
  </div>
</template>

<script setup>
import MarkdownRenderer3 from '@/components/MarkdownRenderer3.vue';
import MarkdownRenderer4 from '@/components/MarkdownRenderer4.vue';
import MarkdownRenderer5 from '@/components/MarkdownRenderer5.vue';
import { ref } from 'vue';

const markdownText = ref(`
# 标题
这是**粗体**和*斜体*文本。

\`\`\`javascript
console.log('Hello, Markdown!');
\`\`\`
`);
</script>
```

---

## 🎨 对比页面

访问 `/markdown-compare` 路由查看三个方案的实时对比。

---

## 📝 已集成到聊天页面

聊天页面 (`/src/views/chat/index.vue`) 已集成 **方案五**，AI 的回复会自动渲染为 Markdown 格式。

---

## 🔧 依赖包

```json
{
  "dependencies": {
    "marked": "^latest",
    "dompurify": "^latest",
    "highlight.js": "^latest",
    "markdown-it": "^latest",
    "vue3-markdown-it": "^latest"
  },
  "devDependencies": {
    "@types/marked": "^latest",
    "@types/dompurify": "^latest",
    "@types/markdown-it": "^latest"
  }
}
```

---

## 💡 推荐使用方案

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| **AI 对话** | 方案五 | 最安全，防止 XSS 攻击 |
| **快速开发** | 方案四 | 开箱即用，配置简单 |
| **高度自定义** | 方案三 | 灵活性最高 |

---

## 🎯 当前使用

- **聊天页面：** 使用方案五（最安全）
- **对比页面：** 可同时查看三个方案的效果
