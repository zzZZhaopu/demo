<template>
  <div class="markdown-renderer markdown-renderer-5">
    <!-- 使用 v-html 渲染经过安全过滤的 HTML -->
    <div class="markdown-body" v-html="sanitizedHtml"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch, nextTick } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css'; // 代码高亮主题（Monokai）

/**
 * 方案五：marked + DOMPurify + highlight.js（最安全方案）
 * 
 * 特点：
 * - marked: 强大的 Markdown 解析器
 * - DOMPurify: 业界最强的 XSS 防护
 * - highlight.js: 专业的代码高亮
 * - 三层安全防护，适合 AI 对话场景
 * - 支持自定义渲染规则
 * - 性能优异
 * 
 * 安全特性：
 * 1. DOMPurify 过滤所有潜在的 XSS 攻击
 * 2. 禁止内联脚本执行
 * 3. 白名单标签和属性
 * 4. 自动清理危险的 URL 协议
 */

// ==================== Props 定义 ====================

interface Props {
  /** Markdown 内容 */
  content: string;
}

const props = defineProps<Props>();

// ==================== Marked 配置 ====================

// 创建自定义的 Renderer
const renderer = new marked.Renderer();

// 自定义链接渲染（在新窗口打开外部链接）
// @ts-ignore
renderer.link = function(token: any) {
  const href = token.href;
  const title = token.title;
  const text = token.text;
  
  const isExternal = href.startsWith('http://') || href.startsWith('https://');
  const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
  const titleAttr = title ? ` title="${title}"` : '';
  return `<a href="${href}"${titleAttr}${target}>${text}</a>`;
};

// 自定义代码块渲染（添加语言标签）
// @ts-ignore
renderer.code = function(token: any) {
  const code = token.text;
  const language = token.lang || 'plaintext';
  const lang = language || 'plaintext';
  const validLang = hljs.getLanguage(lang) ? lang : 'plaintext';
  
  // 使用 highlight.js 高亮代码
  const highlighted = hljs.highlight(code, { language: validLang }).value;
  
  // 返回带语言标签的代码块
  return `
    <div class="code-block-wrapper">
      <div class="code-block-header">
        <span class="code-language">${validLang}</span>
        <button class="code-copy-btn" onclick="navigator.clipboard.writeText(this.dataset.code)" data-code="${code.replace(/"/g, '&quot;')}">
          复制
        </button>
      </div>
      <pre><code class="hljs language-${validLang}">${highlighted}</code></pre>
    </div>
  `;
};

// 配置 marked
marked.setOptions({
  renderer,
  gfm: true,
  breaks: true,
  pedantic: false,
});

// ==================== DOMPurify 配置 ====================

// 配置 DOMPurify 选项
const purifyConfig = {
  // 允许的标签
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'strong', 'em', 'u', 's', 'del', 'mark',
    'a', 'img',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span', 'button'
  ],
  // 允许的属性
  ALLOWED_ATTR: [
    'href', 'title', 'target', 'rel',
    'src', 'alt', 'width', 'height',
    'class', 'id',
    'onclick', 'data-code' // 复制按钮需要
  ],
  // 允许的 URI 协议
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
};

// ==================== 渲染逻辑 ====================

/**
 * 将 Markdown 渲染为安全的 HTML
 */
const sanitizedHtml = computed(() => {
  if (!props.content) {
    return '';
  }
  
  try {
    // 1. 使用 marked 解析 Markdown
    const rawHtml = marked.parse(props.content) as string;
    
    // 2. 使用 DOMPurify 清理 HTML（防止 XSS 攻击）
    const cleanHtml = DOMPurify.sanitize(rawHtml, purifyConfig);
    
    return cleanHtml;
  } catch (error) {
    console.error('Markdown 解析失败:', error);
    return `<p style="color: red;">内容解析失败</p>`;
  }
});

// ==================== 代码高亮更新 ====================

/**
 * 监听内容变化，确保代码高亮正确应用
 */
watch(
  () => props.content,
  () => {
    nextTick(() => {
      // 重新高亮所有代码块
      document.querySelectorAll('.markdown-renderer-5 pre code:not(.hljs)').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    });
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
/**
 * 方案五样式
 * 特点：专业级设计，带代码复制功能
 */

.markdown-renderer-5 {
  width: 100%;
  
  .markdown-body {
    font-size: 14px;
    line-height: 1.8;
    color: #24292e;
    overflow-wrap: break-word;
    
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
      position: relative;
      
      &:first-child {
        margin-top: 0;
      }
      
      // 标题前的装饰符号
      &::before {
        content: '#';
        color: #667eea;
        margin-right: 0.5em;
        font-weight: bold;
      }
    }
    
    :deep(h1) {
      font-size: 2em;
      border-bottom: 3px solid #667eea;
      padding-bottom: 0.3em;
      
      &::before {
        content: '# ';
      }
    }
    
    :deep(h2) {
      font-size: 1.5em;
      border-bottom: 2px solid #e1e4e8;
      padding-bottom: 0.3em;
      
      &::before {
        content: '## ';
      }
    }
    
    :deep(h3) {
      font-size: 1.25em;
      
      &::before {
        content: '### ';
      }
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
    
    :deep(mark) {
      background-color: #fff3cd;
      padding: 0.1em 0.3em;
      border-radius: 2px;
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
      background-color: #f6f8fa;
      color: #e83e8c;
      border: 1px solid #e1e4e8;
      border-radius: 4px;
      font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
    }
    
    // 代码块容器
    :deep(.code-block-wrapper) {
      margin-bottom: 16px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgb(0 0 0 / 10%);
      
      // 代码块头部
      .code-block-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 16px;
        background-color: #272822;
        border-bottom: 1px solid #3e3d32;
        
        .code-language {
          font-size: 12px;
          color: #f8f8f2;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .code-copy-btn {
          padding: 4px 12px;
          font-size: 12px;
          color: #f8f8f2;
          background-color: #667eea;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
          
          &:hover {
            background-color: #764ba2;
            transform: translateY(-1px);
          }
          
          &:active {
            transform: translateY(0);
          }
        }
      }
      
      pre {
        margin: 0;
        padding: 16px;
        background-color: #272822;
        overflow-x: auto;
        
        code {
          padding: 0;
          margin: 0;
          background-color: transparent;
          color: #f8f8f2;
          border: none;
          border-radius: 0;
          display: block;
          font-size: 13px;
          line-height: 1.5;
        }
      }
    }
    
    // ==================== 引用 ====================
    
    :deep(blockquote) {
      margin: 0 0 16px;
      padding: 12px 16px;
      color: #6a737d;
      border-left: 4px solid #667eea;
      background-color: rgb(102 126 234 / 5%);
      border-radius: 0 4px 4px 0;
      
      p:last-child {
        margin-bottom: 0;
      }
    }
    
    // ==================== 表格 ====================
    
    :deep(table) {
      border-spacing: 0;
      border-collapse: collapse;
      margin-bottom: 16px;
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
      
      tr {
        background-color: #fff;
        border-top: 1px solid #e1e4e8;
        
        &:nth-child(2n) {
          background-color: #f9fafb;
        }
        
        &:hover {
          background-color: rgb(102 126 234 / 5%);
        }
      }
      
      th,
      td {
        padding: 10px 16px;
        border: 1px solid #e1e4e8;
        text-align: left;
      }
      
      th {
        font-weight: 600;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-color: #667eea;
      }
    }
    
    // ==================== 链接 ====================
    
    :deep(a) {
      color: #667eea;
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: all 0.3s;
      
      &:hover {
        border-bottom-color: #667eea;
        color: #764ba2;
      }
      
      // 外部链接图标
      &[target="_blank"]::after {
        content: ' ↗';
        font-size: 0.8em;
        opacity: 0.7;
      }
    }
    
    // ==================== 分割线 ====================
    
    :deep(hr) {
      height: 2px;
      padding: 0;
      margin: 24px 0;
      background: linear-gradient(90deg, transparent, #667eea, transparent);
      border: 0;
      border-radius: 1px;
    }
    
    // ==================== 图片 ====================
    
    :deep(img) {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
      margin: 8px 0;
    }
  }
}
</style>
