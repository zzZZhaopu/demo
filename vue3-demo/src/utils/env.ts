// 环境变量工具函数

/**
 * 获取当前环境
 */
export function getEnv(): 'development' | 'test' | 'production' {
  return import.meta.env.VITE_ENV
}

/**
 * 是否为开发环境
 */
export function isDev(): boolean {
  return import.meta.env.VITE_ENV === 'development'
}

/**
 * 是否为测试环境
 */
export function isTest(): boolean {
  return import.meta.env.VITE_ENV === 'test'
}

/**
 * 是否为生产环境
 */
export function isProd(): boolean {
  return import.meta.env.VITE_ENV === 'production'
}

/**
 * 获取 API 基础地址
 */
export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL
}

/**
 * 是否使用 Mock 数据
 */
export function useMock(): boolean {
  return import.meta.env.VITE_USE_MOCK === 'true'
}

/**
 * 获取应用标题
 */
export function getAppTitle(): string {
  return import.meta.env.VITE_APP_TITLE
}

// 导出所有环境变量(方便调试)
export const env = import.meta.env
