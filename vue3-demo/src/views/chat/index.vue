<template>
  <div class="chat-container">
    <!-- 聊天消息区域 -->
    <div class="chat-messages" ref="messagesContainer">
      <!-- 消息列表 -->
      <div v-if="messageList.length === 0" class="empty-state">
        <el-empty description="暂无对话，开始聊天吧！" />
      </div>
      
      <div 
        v-for="(msg, index) in messageList" 
        :key="index" 
        class="message-item"
        :class="msg.role"
      >
        <!-- 用户消息 -->
        <div v-if="msg.role === 'user'" class="message-wrapper user-message">
          <div class="message-content">
            <div class="message-text">{{ msg.content }}</div>
          </div>
          <div class="message-avatar">
            <el-avatar :size="36">
              <el-icon><User /></el-icon>
            </el-avatar>
          </div>
        </div>
        
        <!-- AI 回复 -->
        <div v-else class="message-wrapper assistant-message">
          <div class="message-avatar">
            <el-avatar :size="36" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
              <el-icon><ChatDotRound /></el-icon>
            </el-avatar>
          </div>
          <div class="message-content">
            <!-- 使用 Markdown 渲染组件 -->
            <MarkdownRenderer :content="msg.content" />
            <!-- 加载中动画 -->
            <div v-if="msg.loading" class="loading-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 输入区域 -->
    <div class="chat-input-area">
      <div class="input-wrapper">
        <el-input
          v-model="input"
          :rows="3"
          type="textarea"
          placeholder="输入消息... (Shift + Enter 换行，Enter 发送)"
          :disabled="isLoading"
          @keydown.enter="handleEnter"
          resize="none"
        />
        <div class="input-actions">
          <div class="left-actions">
            <el-tooltip content="清空对话" placement="top">
              <el-button 
                :icon="Delete" 
                circle 
                size="small"
                @click="clearMessages"
                :disabled="messageList.length === 0"
              />
            </el-tooltip>
          </div>
          <div class="right-actions">
            <el-button
              type="primary"
              @click="send"
              :loading="isLoading"
              :disabled="!input.trim()"
            >
              {{ isLoading ? '发送中...' : '发送' }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { User, ChatDotRound, Delete } from "@element-plus/icons-vue";
import { sendDifyStreamMessage } from "../../utils/difyChat";
// import MarkdownRenderer from "@/components/MarkdownRenderer5.vue";
import MarkdownRenderer from "@/components/MarkdownRenderer4.vue";
// import MarkdownRenderer from "@/components/MarkdownRenderer3.vue";

// ==================== 类型定义 ====================

/** 消息角色 */
type MessageRole = 'user' | 'assistant'

/** 消息对象 */
interface Message {
  role: MessageRole
  content: string
  loading?: boolean  // 是否正在加载中
  timestamp?: number // 时间戳
}

// ==================== 响应式数据 ====================

/** 用户输入 */
const input = ref("");

/** 消息列表 */
const messageList = ref<Message[]>([]);

/** 是否正在加载中 */
const isLoading = ref(false);

/** 消息容器的引用 */
const messagesContainer = ref<HTMLElement>();

/** 会话ID（用于连续对话） */
const conversationId = ref("");

// ==================== 方法定义 ====================

/**
 * 滚动到底部
 * 在新消息添加后，自动滚动到最底部
 */
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

/**
 * 格式化消息内容
 * 将换行符转换为 <br> 标签，实现换行显示
 */
const formatMessage = (content: string): string => {
  return content.replace(/\n/g, '<br>');
};

/**
 * 处理 Enter 键事件
 * - Enter: 发送消息
 * - Shift + Enter: 换行
 */
const handleEnter = (event: Event) => {
  // 类型断言：确保是 KeyboardEvent
  const keyboardEvent = event as KeyboardEvent;
  
  // 如果按下 Shift + Enter，允许换行
  if (keyboardEvent.shiftKey) {
    return;
  }
  
  // 如果只按 Enter，阻止默认行为（换行），然后发送消息
  event.preventDefault();
  send();
};

/**
 * 发送消息
 */
const send = async () => {
  // 验证输入
  if (!input.value.trim()) {
    ElMessage.warning('请输入消息内容');
    return;
  }
  
  if (isLoading.value) {
    return;
  }
  
  // 保存用户输入
  const userMessage = input.value.trim();
  
  // 添加用户消息到列表
  messageList.value.push({
    role: 'user',
    content: userMessage,
    timestamp: Date.now()
  });
  
  // 清空输入框
  input.value = '';
  
  // 添加 AI 回复占位（显示加载状态）
  const assistantIndex = messageList.value.length;
  messageList.value.push({
    role: 'assistant',
    content: '',
    loading: true,
    timestamp: Date.now()
  });
  
  // 滚动到底部
  scrollToBottom();
  
  // 设置加载状态
  isLoading.value = true;
  
  try {
    // 发送请求到 Dify API
    await sendDifyStreamMessage({
      apiKey: "app-hp4AQZy32hnhtPLli8ZKFI8O",
      query: userMessage,
      user: "123",
      conversation_id: conversationId.value,
      
      // 接收消息片段
      onMessage: (response) => {
        if (response.event === "message" && response.answer) {
          // 确保消息项存在
          const message = messageList.value[assistantIndex];
          if (message) {
            // 累加消息内容
            message.content += response.answer;
            // 实时滚动到底部
            scrollToBottom();
          }
        }
      },
      
      // 消息结束
      onEnd: (response) => {
        // 确保消息项存在
        const message = messageList.value[assistantIndex];
        if (message) {
          // 移除加载状态
          message.loading = false;
        }
        // 保存会话ID（用于下次对话）
        if (response.conversation_id) {
          conversationId.value = response.conversation_id;
        }
        // 设置加载完成
        isLoading.value = false;
        console.log('对话结束');
      },
      
      // 错误处理
      onError: (error) => {
        // 确保消息项存在
        const message = messageList.value[assistantIndex];
        if (message) {
          // 移除加载状态
          message.loading = false;
          // 显示错误消息
          message.content = `发生错误：${error.message}`;
        }
        // 设置加载完成
        isLoading.value = false;
        // 提示用户
        ElMessage.error('消息发送失败，请重试');
      }
    });
  } catch (error) {
    // 异常处理
    const message = messageList.value[assistantIndex];
    if (message) {
      message.loading = false;
      message.content = '发送失败，请重试';
    }
    isLoading.value = false;
    ElMessage.error('发送失败，请重试');
  }
};

/**
 * 清空消息列表
 */
const clearMessages = () => {
  if (messageList.value.length === 0) {
    return;
  }
  
  ElMessage.success('对话已清空');
  messageList.value = [];
  conversationId.value = ''; // 清空会话ID
};
</script>

<style lang="scss" scoped>
// ==================== 聊天容器 ====================

.chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px); // 减去导航栏高度
  background: #f5f7fa;
  
  // ==================== 消息区域 ====================
  
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    
    // 空状态
    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #909399;
    }
    
    // 消息项
    .message-item {
      margin-bottom: 20px;
      animation: fadeIn 0.3s ease-in;
      
      // 消息包装器
      .message-wrapper {
        display: flex;
        gap: 12px;
        max-width: 80%;
        
        // 头像
        .message-avatar {
          flex-shrink: 0;
        }
        
        // 消息内容
        .message-content {
          flex: 1;
          
          .message-text {
            padding: 12px 16px;
            border-radius: 12px;
            line-height: 1.6;
            overflow-wrap: break-word;
            white-space: pre-wrap;
          }
          
          // 加载动画
          .loading-dots {
            display: inline-flex;
            gap: 4px;
            padding: 8px 0;
            
            span {
              width: 8px;
              height: 8px;
              background: #409eff;
              border-radius: 50%;
              animation: bounce 1.4s infinite ease-in-out both;
              
              &:nth-child(1) {
                animation-delay: -0.32s;
              }
              
              &:nth-child(2) {
                animation-delay: -0.16s;
              }
            }
          }
        }
      }
      
      // 用户消息样式
      &.user .message-wrapper {
        margin-left: auto;
        flex-direction: row-reverse;
        
        .message-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 8px rgb(102 126 234 / 30%);
        }
      }
      
      // AI 消息样式
      &.assistant .message-wrapper {
        .message-text {
          background: white;
          color: #303133;
          box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
          border: 1px solid #e4e7ed;
        }
      }
    }
  }
  
  // ==================== 输入区域 ====================
  
  .chat-input-area {
    padding: 20px;
    background: white;
    border-top: 1px solid #e4e7ed;
    box-shadow: 0 -2px 12px rgb(0 0 0 / 4%);
    
    .input-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      
      // 输入框样式
      :deep(.el-textarea__inner) {
        border-radius: 12px;
        border: 2px solid #e4e7ed;
        padding: 12px;
        font-size: 14px;
        line-height: 1.6;
        transition: all 0.3s;
        
        &:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgb(102 126 234 / 10%);
        }
      }
      
      // 操作按钮区域
      .input-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 12px;
        
        .left-actions {
          display: flex;
          gap: 8px;
        }
        
        .right-actions {
          display: flex;
          gap: 8px;
        }
      }
    }
  }
}

// ==================== 动画定义 ====================

// 淡入动画
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 跳动动画（加载中）
@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }

  40% {
    transform: scale(1);
  }
}

// ==================== 滚动条美化 ====================

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
  
  &:hover {
    background: #c0c4cc;
  }
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}
</style>
