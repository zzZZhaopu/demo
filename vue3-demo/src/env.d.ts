/// <reference types="vite/client" />

// 环境变量类型声明
interface ImportMetaEnv {
  // 环境标识
  readonly VITE_ENV: 'development' | 'test' | 'production'
  
  // 是否启用 SourceMap
  readonly VITE_BUILD_SOURCEMAP: 'true' | 'false'
  
  // 是否移除 console
  readonly VITE_DROP_CONSOLE: 'true' | 'false'
  
  // API 基础地址
  readonly VITE_API_BASE_URL: string
  
  // 是否使用 Mock 数据
  readonly VITE_USE_MOCK: 'true' | 'false'
  
  // 应用标题
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
