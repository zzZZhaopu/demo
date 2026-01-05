import fs from 'fs'
import path from 'path'
import type { Plugin } from 'vite'

/**
 * SourceMap 上传插件配置项
 */
export interface SourceMapUploadOptions {
  /** 是否启用插件（默认仅在生产环境启用） */
  enabled?: boolean
  /** 监控平台 API 地址 */
  uploadUrl?: string
  /** API 密钥 */
  apiKey?: string
  /** 项目名称 */
  projectName?: string
  /** 项目版本 */
  version?: string
  /** 上传完成后是否删除 SourceMap 文件（默认 true） */
  removeSourceMap?: boolean
  /** 自定义上传函数（可选，用于对接特定监控平台） */
  uploadFn?: (filePath: string, options: Required<Pick<SourceMapUploadOptions, 'uploadUrl' | 'apiKey' | 'projectName' | 'version'>>) => Promise<boolean>
}

/**
 * Vite 插件：上传 SourceMap 到监控平台
 * 
 * @description
 * 这个插件会在打包完成后自动执行以下操作：
 * 1. 查找 dist 目录下所有的 .map 文件
 * 2. 上传到指定的监控平台（如 Sentry、阿里云 ARMS 等）
 * 3. 上传完成后自动删除 .map 文件（可配置）
 * 
 * @example
 * ```ts
 * // vite.config.ts
 * import { uploadSourceMapPlugin } from 'vite-plugin-upload-sourcemap'
 * 
 * export default defineConfig({
 *   plugins: [
 *     uploadSourceMapPlugin({
 *       enabled: mode === 'production',
 *       uploadUrl: 'https://your-platform.com/api/sourcemap',
 *       apiKey: process.env.SOURCEMAP_API_KEY,
 *       projectName: 'my-project',
 *       version: '1.0.0',
 *       removeSourceMap: true
 *     })
 *   ]
 * })
 * ```
 */
export function uploadSourceMapPlugin(options: SourceMapUploadOptions = {}): Plugin {
  // 默认配置
  const config = {
    enabled: options.enabled ?? process.env.NODE_ENV === 'production',
    uploadUrl: options.uploadUrl || process.env.VITE_SOURCEMAP_UPLOAD_URL || '',
    apiKey: options.apiKey || process.env.VITE_SOURCEMAP_API_KEY || '',
    projectName: options.projectName || process.env.npm_package_name || 'unknown-project',
    version: options.version || process.env.npm_package_version || '1.0.0',
    removeSourceMap: options.removeSourceMap ?? true,
    uploadFn: options.uploadFn
  }

  // 用于存储输出目录路径
  let outDir = 'dist'
  
  // 用于存储在构建过程中生成的 SourceMap 文件路径
  // 在 generateBundle 钩子中收集，在 closeBundle 钩子中使用
  const sourceMapFiles: string[] = []

  return {
    // 插件名称
    name: 'vite-plugin-upload-sourcemap',
    
    // 仅在构建时应用
    apply: 'build',
    
    /**
     * 在 Vite 配置解析完成后调用
     * 用于获取构建配置信息（如输出目录）
     */
    configResolved(resolvedConfig) {
      // 获取实际的输出目录
      outDir = resolvedConfig.build.outDir
    },
    
    /**
     * 在生成产物时调用（产物还在内存中，未写入磁盘）
     * 这个钩子可以获取到所有生成的文件信息，包括 SourceMap 文件
     * 
     * @description
     * 在这个阶段我们可以知道哪些文件是 .map 文件，提前记录下来
     * 避免后续在 closeBundle 中遍历文件系统查找
     */
    generateBundle(_options, bundle) {
      // 遍历所有生成的文件
      Object.keys(bundle).forEach(fileName => {
        // 如果是 .map 文件，记录其完整路径
        if (fileName.endsWith('.map')) {
          const fullPath = path.resolve(outDir, fileName)
          sourceMapFiles.push(fullPath)
        }
      })
    },
    
    /**
     * 在打包完成后调用（所有文件都已写入磁盘）
     * 这是执行 SourceMap 上传的最佳时机
     */
    async closeBundle() {
      // 如果插件未启用，直接返回
      if (!config.enabled) {
        console.log('⏭️  SourceMap 上传插件已禁用')
        return
      }

      // 验证必要的配置
      if (!config.uploadUrl || !config.apiKey) {
        console.warn('⚠️  SourceMap 上传配置不完整，跳过上传')
        console.warn('   请配置 uploadUrl 和 apiKey')
        return
      }

      console.log('\n🚀 开始处理 SourceMap 文件...\n')

      try {
        // 1. 检查是否有 SourceMap 文件（已在 generateBundle 中收集）
        if (sourceMapFiles.length === 0) {
          console.log('⚠️  未找到 SourceMap 文件')
          return
        }

        console.log(`✅ 找到 ${sourceMapFiles.length} 个 SourceMap 文件\n`)

        // 2. 上传所有 SourceMap 文件
        console.log('📤 开始上传 SourceMap...')
        const uploadResults = await Promise.all(
          sourceMapFiles.map(file => {
            // 如果提供了自定义上传函数，使用自定义函数
            if (config.uploadFn) {
              return config.uploadFn(file, {
                uploadUrl: config.uploadUrl,
                apiKey: config.apiKey,
                projectName: config.projectName,
                version: config.version
              })
            }
            // 否则使用默认上传函数
            return uploadSourceMap(file, {
              uploadUrl: config.uploadUrl,
              apiKey: config.apiKey,
              projectName: config.projectName,
              version: config.version
            })
          })
        )

        const successCount = uploadResults.filter(Boolean).length
        console.log(`\n✅ 上传完成: ${successCount}/${sourceMapFiles.length} 成功`)

        // 3. 删除 SourceMap 文件（如果配置了）
        if (config.removeSourceMap) {
          console.log('\n🗑️  正在删除 SourceMap 文件...')
          sourceMapFiles.forEach(file => {
            try {
              fs.unlinkSync(file)
              console.log(`  ✅ 已删除: ${path.basename(file)}`)
            } catch (error) {
              console.error(`  ❌ 删除失败: ${path.basename(file)}`, error)
            }
          })
        }

        console.log('\n🎉 SourceMap 处理完成!')
      } catch (error) {
        console.error('\n❌ SourceMap 处理失败:', error)
        // 不中断构建流程
      }
    }
  }
}

/**
 * 上传单个 SourceMap 文件到监控平台（默认实现）
 * 
 * @param filePath - SourceMap 文件的绝对路径
 * @param config - 上传配置
 * @returns 上传是否成功
 * 
 * @description
 * 这是一个示例实现，实际使用时建议通过 uploadFn 参数传入自定义上传函数
 * 以对接具体的监控平台（如 Sentry、阿里云 ARMS 等）
 */
async function uploadSourceMap(
  filePath: string, 
  config: Required<Pick<SourceMapUploadOptions, 'uploadUrl' | 'apiKey' | 'projectName' | 'version'>>
): Promise<boolean> {
  console.log(`📤 正在上传: ${path.basename(filePath)}`)
  
  try {
    // 读取文件内容
    const content = fs.readFileSync(filePath, 'utf-8')
    
    /* 
     * ==============================================
     * 🔧 默认实现：基础的 HTTP POST 请求
     * ==============================================
     * 
     * 建议通过 uploadFn 参数传入自定义上传函数以对接具体平台
     * 
     * 不同监控平台的 API 接口差异较大，这里提供一个通用的实现
     * 实际使用时请根据平台文档修改
     */
    
    const response = await fetch(config.uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        project: config.projectName,
        version: config.version,
        filename: path.basename(filePath),
        content: content
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    console.log(`✅ 上传成功: ${path.basename(filePath)}`)
    return true
  } catch (error) {
    console.error(`❌ 上传失败: ${path.basename(filePath)}`, error instanceof Error ? error.message : error)
    return false
  }
}

// 默认导出（支持两种导入方式）
export default uploadSourceMapPlugin

