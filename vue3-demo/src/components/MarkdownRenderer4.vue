<template>
  <div class="markdown-renderer markdown-renderer-4">
    <!-- 使用 vue3-markdown-it 组件 -->
    <Markdown
      :source="content"
      :breaks="true"
      :linkify="true"
      :typographer="true"
      :html="false"
      class="markdown-body"
    />
  </div>
</template>

<script lang="ts" setup>
import Markdown from "vue3-markdown-it";
import "highlight.js/styles/atom-one-dark.css"; // 代码高亮主题（深色）

/**
 * 方案四：vue3-markdown-it（开箱即用的 Vue 组件）
 *
 * 特点：
 * - 专为 Vue 3 设计的 Markdown 组件
 * - 基于 markdown-it 引擎
 * - 内置代码高亮（基于 highlight.js）
 * - 配置简单，开箱即用
 * - 自动处理 XSS 安全（html: false）
 * - 支持响应式更新
 *
 * 配置说明：
 * - source: Markdown 内容
 * - breaks: 将换行符转换为 <br>
 * - linkify: 自动识别 URL 并转换为链接
 * - typographer: 启用排版优化（如智能引号）
 * - html: 是否允许 HTML 标签（false 更安全）
 */

// ==================== Props 定义 ====================

interface Props {
  /** Markdown 内容 */
  content: string;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
/**
 * 方案四样式
 * 特点：现代化设计，深色代码主题
 */

.markdown-renderer-4 {
  width: 100%;

  :deep(.markdown-body) {
    font-size: 14px;
    line-height: 1.8;
    color: #2c3e50;
    overflow-wrap: break-word;

    // ==================== 标题 ====================

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
      color: #2c3e50;

      &:first-child {
        margin-top: 0;
      }
    }

    h1 {
      font-size: 2em;
      border-bottom: 2px solid #667eea;
      padding-bottom: 0.3em;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    h2 {
      font-size: 1.5em;
      border-bottom: 1px solid #e1e4e8;
      padding-bottom: 0.3em;
    }

    h3 {
      font-size: 1.25em;
    }

    // ==================== 段落和文本 ====================

    p {
      margin-top: 0;
      margin-bottom: 16px;
    }

    strong {
      font-weight: 600;
      color: #000;
    }

    em {
      font-style: italic;
      color: #667eea;
    }

    // ==================== 列表 ====================

    ul,
    ol {
      margin-top: 0;
      margin-bottom: 16px;
      padding-left: 2em;
    }

    li {
      margin-top: 0.25em;

      &::marker {
        color: #667eea;
      }
    }

    // ==================== 代码 ====================

    code {
      padding: 0.2em 0.4em;
      margin: 0;
      font-size: 85%;
      background-color: rgb(102 126 234 / 10%);
      color: #667eea;
      border-radius: 6px;
      font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo,
        monospace;
    }

    pre {
      padding: 16px;
      overflow: auto;
      font-size: 85%;
      line-height: 1.45;
      background-color: #282c34;
      border-radius: 8px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgb(0 0 0 / 10%);

      code {
        padding: 0;
        margin: 0;
        background-color: transparent;
        color: #abb2bf;
        border-radius: 0;
        display: block;
        overflow-x: auto;
      }
    }

    // ==================== 引用 ====================

    blockquote {
      margin: 0 0 16px;
      padding: 0 1em;
      color: #6a737d;
      border-left: 4px solid #667eea;
      background-color: rgb(102 126 234 / 5%);
      border-radius: 0 4px 4px 0;
    }

    // ==================== 表格 ====================

    table {
      border-spacing: 0;
      border-collapse: collapse;
      margin-bottom: 16px;
      width: 100%;
      border-radius: 8px;
      overflow: hidden;

      tr {
        background-color: #fff;
        border-top: 1px solid #e1e4e8;

        &:nth-child(2n) {
          background-color: #f9fafb;
        }
      }

      th,
      td {
        padding: 8px 13px;
        border: 1px solid #e1e4e8;
      }

      th {
        font-weight: 600;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-color: #667eea;
      }
    }

    // ==================== 链接 ====================

    a {
      color: #667eea;
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: all 0.3s;

      &:hover {
        border-bottom-color: #667eea;
      }
    }

    // ==================== 分割线 ====================

    hr {
      height: 2px;
      padding: 0;
      margin: 24px 0;
      background: linear-gradient(90deg, transparent, #667eea, transparent);
      border: 0;
    }
  }
}
</style>
