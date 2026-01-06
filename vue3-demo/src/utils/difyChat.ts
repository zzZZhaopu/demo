/**
 * Dify 流式聊天工具类
 * 用于处理 Dify API 的流式请求和响应
 */

// ==================== 类型定义 ====================

/**
 * Dify API 事件类型
 * - message: 消息片段
 * - message_end: 消息结束
 * - error: 错误事件
 * - agent_message: Agent 消息
 * - agent_thought: Agent 思考过程
 */
type DifyEventType =
  | "message"
  | "message_end"
  | "error"
  | "agent_message"
  | "agent_thought";

/**
 * Dify API 响应的基础数据结构
 */
interface DifyBaseResponse {
  /** 事件类型 */
  event: DifyEventType;
  /** 会话ID */
  conversation_id?: string;
  /** 消息ID */
  message_id?: string;
  /** 任务ID */
  task_id?: string;
  [key: string]: any;
}

/**
 * Dify 消息响应
 * 当事件类型为 'message' 时的响应结构
 */
interface DifyMessageResponse extends DifyBaseResponse {
  event: "message";
  /** 消息内容片段 */
  answer?: string;
  /** 创建时间戳 */
  created_at?: number;
}

/**
 * Dify 消息结束响应
 * 当事件类型为 'message_end' 时的响应结构
 */
interface DifyMessageEndResponse extends DifyBaseResponse {
  event: "message_end";
}

/**
 * Dify 错误响应
 * 当事件类型为 'error' 时的响应结构
 */
interface DifyErrorResponse extends DifyBaseResponse {
  event: "error";
  /** 错误状态码 */
  status?: number;
  /** 错误代码 */
  code?: string;
  /** 错误消息 */
  message?: string;
}

/**
 * Dify API 响应的联合类型
 * 可以是消息、消息结束或错误事件
 */
type DifyResponse =
  | DifyMessageResponse
  | DifyMessageEndResponse
  | DifyErrorResponse;

/**
 * 输入参数对象
 * 可以包含任意键值对
 */
interface DifyInputs {
  [key: string]: any;
  /** 环境标识（自动注入） */
  env?: string;
}

/**
 * sendDifyStreamMessage 函数的配置参数
 */
interface SendDifyStreamOptions {
  /** 用户输入的问题（必填） */
  query: string;
  /** 输入参数对象（可选） */
  inputs?: DifyInputs;
  /** 会话ID，用于继续之前的对话（可选） */
  conversation_id?: string;
  /** 用户标识 */
  user?: string;
  apiKey: string; // API 密钥
  /** 接收消息片段的回调函数 */
  onMessage: (response: DifyResponse) => void;
  /** 流式响应结束的回调函数 */
  onEnd?: (response: DifyMessageEndResponse) => void;
  /** 错误处理回调函数 */
  onError?: (error: Error, response?: DifyErrorResponse) => void;
}

/**
 * sendDifyStreamMessage 函数的返回值
 */
interface SendDifyStreamResult {
  /** 完整的响应内容 */
  response: string;
  /** 会话ID */
  conversation_id: string;
}

/**
 * Dify API 请求体结构
 */
interface DifyRequestBody {
  /** 输入参数 */
  inputs: DifyInputs;
  /** 用户问题 */
  query: string;
  /** 响应模式（固定为 streaming） */
  response_mode: "streaming";
  /** 会话ID */
  conversation_id: string;
  /** 用户标识 */
  user: string;
}

// ==================== 常量定义 ====================

/** Dify API 环境标识 */
const DIFY_API_ENV = import.meta.env.VUE_APP_DIFY_ENV;

// ==================== 主函数 ====================

/**
 * 发送 Dify 流式聊天消息
 *
 * @description
 * 这个函数用于向 Dify API 发送流式聊天请求。
 * 流式响应意味着服务器会分多次发送数据，而不是一次性返回所有内容。
 * 就像聊天时对方一个字一个字地打出来，而不是一次性发送整段话。
 *
 * @example
 * ```typescript
 * // 基础用法
 * await sendDifyStreamMessage({
 *   query: '你好，请介绍一下你自己',
 *   onMessage: (response) => {
 *     if (response.event === 'message') {
 *       console.log('收到消息片段:', response.answer)
 *     }
 *   },
 *   onEnd: (response) => {
 *     console.log('对话结束，会话ID:', response.conversation_id)
 *   },
 *   onError: (error) => {
 *     console.error('发生错误:', error.message)
 *   }
 * })
 *
 * // 继续之前的对话
 * await sendDifyStreamMessage({
 *   query: '继续刚才的话题',
 *   conversation_id: 'previous-conversation-id',
 *   onMessage: (response) => { ... }
 * })
 * ```
 *
 * @param options - 配置参数对象
 * @returns Promise，包含完整响应和会话ID
 * @throws 当 query 为空或 onMessage 不是函数时抛出错误
 */
export async function sendDifyStreamMessage(
  options: SendDifyStreamOptions
): Promise<SendDifyStreamResult> {
  // 解构配置参数
  const {
    query,
    inputs = {},
    conversation_id = "",
    user = "",
    apiKey = "",
    onMessage,
    onEnd,
    onError,
  } = options;

  // ==================== 参数验证 ====================
    
  // 验证 apiKey 不能为空
  if (!apiKey || !apiKey.trim()) {
    const error = new Error("apiKey（Dify API 密钥）不能为空，请传入有效的 API Key");
    onError?.(error);
    throw error;
  }
    
  // 验证 query 不能为空
  if (!query || !query.trim()) {
    const error = new Error("query 不能为空");
    onError?.(error);
    throw error;
  }

  // 验证 onMessage 必须是函数
  if (typeof onMessage !== "function") {
    const error = new Error("onMessage 必须是一个函数");
    onError?.(error);
    throw error;
  }

  try {
    // ==================== 构建请求体 ====================

    const requestBody: DifyRequestBody = {
      // 输入参数（自动注入环境标识）
      inputs: {
        ...inputs,
        env: DIFY_API_ENV,
      },
      // 用户问题
      query,
      // 响应模式：streaming（流式）
      response_mode: "streaming",
      // 会话ID（如果是继续对话则传入之前的ID）
      conversation_id,
      // 用户标识
      user,
    };

    // ==================== 发送请求 ====================

    const response = await fetch(`https://dify.hinadt.com/v1/chat-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 告诉服务器我们接受流式响应（Server-Sent Events）
        Accept: "text/event-stream",
        // accessToken,
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody),
    });

    // 检查 HTTP 响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // ==================== 处理流式响应 ====================

    // 获取响应体的读取器
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("无法获取响应流");
    }

    // 创建文本解码器（将二进制数据转为文本）
    const decoder = new TextDecoder();

    // 控制标志和缓冲区
    let isReading = true;
    let buffer = ""; // 用于暂存不完整的数据块
    let fullResponse = ""; // 保存完整的响应内容

    // 循环读取流式数据
    while (isReading) {
      // 读取一块数据
      const { done, value } = await reader.read();

      // 如果读取完成，退出循环
      if (done) {
        isReading = false;
        break;
      }

      // 将二进制数据解码为文本
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      // ==================== 解析 SSE 格式 ====================
      // Server-Sent Events (SSE) 格式说明：
      // - 每个事件以 "data: " 开头
      // - 事件之间用 "\n\n" 分隔

      // 按双换行符分割数据块
      const lines = buffer.split("\n\n");

      // 保留最后一行（可能是不完整的数据）
      buffer = lines.pop() || "";

      // 处理每一行数据
      for (const line of lines) {
        // 检查是否是 SSE 数据格式
        if (line.startsWith("data:")) {
          // 提取 JSON 数据（去掉 "data:" 前缀和空格）
          const data = line.slice(5).trim();

          try {
            // 解析 JSON 数据
            const json = JSON.parse(data) as DifyResponse;

            // 根据事件类型处理
            if (json.event === "message_end") {
              // 消息结束事件
              onEnd?.(json as DifyMessageEndResponse);
              break;
            } else if (json.event === "error") {
              // 错误事件
              const error = new Error(json.message || "未知错误");
              onError?.(error, json as DifyErrorResponse);
            }

            // 调用消息回调（包括所有事件类型）
            onMessage(json);
          } catch (e) {
            // JSON 解析失败
            console.warn("JSON parse error:", e);
            console.error("JSON parse error:", data);
          }
        }
      }
    }

    // ==================== 返回结果 ====================

    return {
      response: fullResponse,
      conversation_id,
    };
  } catch (error) {
    // 调用错误回调
    onError?.(error as Error);
    throw error;
  }
}

// ==================== 默认导出 ====================

export default {
  sendDifyStreamMessage,
};

// ==================== 导出类型 ====================
// 这样其他文件也可以使用这些类型定义

export type {
  DifyEventType,
  DifyBaseResponse,
  DifyMessageResponse,
  DifyMessageEndResponse,
  DifyErrorResponse,
  DifyResponse,
  DifyInputs,
  SendDifyStreamOptions,
  SendDifyStreamResult,
  DifyRequestBody,
};
