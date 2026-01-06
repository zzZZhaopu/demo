<template>
  <div class="markdown-renderer markdown-renderer-3">
    <!-- 使用 v-html 渲染 Markdown -->
    <div class="markdown-body" v-html="renderedHtml"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch, nextTick } from 'vue';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // 代码高亮主题

/**
 * 方案三：marked + highlight.js（手动集成）
 * 
 * 特点：
 * - 使用最流行的 marked 库
 * - 集成 highlight.js 实现代码高亮
 * - 手动配置，灵活性最高
 * - 支持自定义渲染规则
 */

// ==================== Props 定义 ====================

interface Props {
  /** Markdown 内容 */
  content: string;
}

const props = defineProps<Props>();

// ==================== Marked 配置 ====================

// 配置 marked 选项
marked.setOptions({
  // 启用 GitHub Flavored Markdown
  gfm: true,
  // 启用换行符转换为 <br>
  breaks: true,
});

// 设置代码高亮扩展
marked.use({
  extensions: [
    {
      name: 'code',
      level: 'block',
      renderer(token: any) {
        const code = token.text;
        const lang = token.lang || '';
        
        // 如果指定了语言且 highlight.js 支持，则高亮
        if (lang && hljs.getLanguage(lang)) {
          try {
            return `<pre><code class="hljs language-${lang}">${hljs.highlight(code, { language: lang }).value}</code></pre>`;
          } catch (err) {
            console.error('代码高亮失败:', err);
          }
        }
        // 否则返回原始代码
        return `<pre><code>${code}</code></pre>`;
      }
    }
  ]
});

// ==================== 渲染逻辑 ====================

/**
 * 将 Markdown 渲染为 HTML
 */
const renderedHtml = computed(() => {
  if (!props.content) {
    return '';
  }
  
  try {
    // 使用 marked 解析 Markdown
    return marked.parse(props.content);
  } catch (error) {
    console.error('Markdown 解析失败:', error);
    return `<p style="color: red;">Markdown 解析失败</p>`;
  }
});

// ==================== 代码高亮更新 ====================

/**
 * 监听内容变化，重新高亮代码块
 */
watch(
  () => props.content,
  () => {
    nextTick(() => {
      // 重新高亮所有代码块
      document.querySelectorAll('.markdown-renderer-3 pre code').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    });
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
/**
 * 方案三样式
 * 特点：GitHub 风格，简洁大方
 */

.markdown-renderer-3 {
  width: 100%;
  
  .markdown-body {
    font-size: 14px;
    line-height: 1.8;
    color: #24292e;
    word-wrap: break-word;
    
    // ==================== 标题 ====================
    
    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4),
    :deep(h5),
    :deep(h6) {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
      color: #1a1a1a;
    }
    
    :deep(h1) {
      font-size: 2em;
      border-bottom: 2px solid #eaecef;
      padding-bottom: 0.3em;
    }
    
    :deep(h2) {
      font-size: 1.5em;
      border-bottom: 1px solid #eaecef;
      padding-bottom: 0.3em;
    }
    
    :deep(h3) {
      font-size: 1.25em;
    }
    
    // ==================== 段落和文本 ====================
    
    :deep(p) {
      margin-top: 0;
      margin-bottom: 16px;
    }
    
    :deep(strong) {
      font-weight: 600;
      color: #000;
    }
    
    :deep(em) {
      font-style: italic;
    }
    
    // ==================== 列表 ====================
    
    :deep(ul),
    :deep(ol) {
      margin-top: 0;
      margin-bottom: 16px;
      padding-left: 2em;
    }
    
    :deep(li) {
      margin-top: 0.25em;
    }
    
    // ==================== 代码 ====================
    
    :deep(code) {
      padding: 0.2em 0.4em;
      margin: 0;
      font-size: 85%;
      background-color: rgba(175, 184, 193, 0.2);
      border-radius: 6px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    }
    
    :deep(pre) {
      padding: 16px;
      overflow: auto;
      font-size: 85%;
      line-height: 1.45;
      background-color: #f6f8fa;
      border-radius: 6px;
      margin-bottom: 16px;
      
      code {
        padding: 0;
        margin: 0;
        background-color: transparent;
        border-radius: 0;
        display: block;
        overflow-x: auto;
      }
    }
    
    // ==================== 引用 ====================
    
    :deep(blockquote) {
      margin: 0 0 16px 0;
      padding: 0 1em;
      color: #6a737d;
      border-left: 0.25em solid #dfe2e5;
    }
    
    // ==================== 表格 ====================
    
    :deep(table) {
      border-spacing: 0;
      border-collapse: collapse;
      margin-bottom: 16px;
      width: 100%;
      overflow: auto;
      
      tr {
        background-color: #fff;
        border-top: 1px solid #c6cbd1;
        
        &:nth-child(2n) {
          background-color: #f6f8fa;
        }
      }
      
      th,
      td {
        padding: 6px 13px;
        border: 1px solid #dfe2e5;
      }
      
      th {
        font-weight: 600;
        background-color: #f6f8fa;
      }
    }
    
    // ==================== 链接 ====================
    
    :deep(a) {
      color: #0366d6;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
    
    // ==================== 分割线 ====================
    
    :deep(hr) {
      height: 0.25em;
      padding: 0;
      margin: 24px 0;
      background-color: #e1e4e8;
      border: 0;
    }
  }
}
</style>
