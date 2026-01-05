import fs from "fs";
import path from "path";
import type { Plugin } from "vite";

/**
 * SourceMap 上传插件配置项
 */
export interface SourceMapUploadOptions {
  /** 是否启用插件（默认仅在生产环境启用） */
  enabled?: boolean;
  /** 监控平台 API 地址 */
  uploadUrl?: string;
  /** API 密钥 */
  apiKey?: string;
  /** 项目名称 */
  projectName?: string;
  /** 项目版本 */
  version?: string;
  /** 上传完成后是否删除 SourceMap 文件（默认 true） */
  removeSourceMap?: boolean;
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
 * import { uploadSourceMapPlugin } from './plugins/vite-plugin-upload-sourcemap'
 *
 * export default defineConfig({
 *   plugins: [
 *     uploadSourceMapPlugin({
 *       enabled: mode === 'production',
 *       uploadUrl: 'https://your-platform.com/api/sourcemap',
 *       apiKey: process.env.SOURCEMAP_API_KEY,
 *       projectName: 'vue3-demo',
 *       version: '1.0.0',
 *       removeSourceMap: true
 *     })
 *   ]
 * })
 * ```
 */
export function uploadSourceMapPlugin(
  options: SourceMapUploadOptions = {}
): Plugin {
  // 默认配置
  const config = {
    enabled: options.enabled ?? process.env.NODE_ENV === "production",
    uploadUrl:
      options.uploadUrl ||
      process.env.VITE_SOURCEMAP_UPLOAD_URL ||
      "https://your-monitor-platform.com/api/sourcemap",
    apiKey:
      options.apiKey || process.env.VITE_SOURCEMAP_API_KEY || "your-api-key",
    projectName:
      options.projectName || process.env.npm_package_name || "vue3-demo",
    version: options.version || process.env.npm_package_version || "1.0.0",
    removeSourceMap: options.removeSourceMap ?? true,
  };

  // 用于存储输出目录路径
  let outDir = "dist";

  const sourceMapFiles: string[] = [];

  return {
    // 插件名称
    name: "vite-plugin-upload-sourcemap",

    // 仅在构建时应用
    apply: "build",

    /**
     * 在 Vite 配置解析完成后调用
     * 用于获取构建配置信息（如输出目录）
     */
    configResolved(resolvedConfig) {
      // 获取实际的输出目录
      outDir = resolvedConfig.build.outDir;
    },

    generateBundle(_options, bundle) {
      // 如果插件未启用，直接返回
      if (!config.enabled) {
        console.log("⏭️  SourceMap 上传插件已禁用");
        return;
      }
      Object.keys(bundle).forEach((fileName) => {
        if (fileName.endsWith(".map")) {
          const fullPath = path.resolve(outDir, fileName);
          sourceMapFiles.push(fullPath);
        }
      });
    },

    /**
     * 在打包完成后调用（所有文件都已写入磁盘）
     * 这是执行 SourceMap 上传的最佳时机
     */
    async closeBundle() {
      // 如果插件未启用，直接返回
      if (!config.enabled) {
        console.log("⏭️  SourceMap 上传插件已禁用");
        return;
      }

      console.log("\n🚀 开始处理 SourceMap 文件...\n");

      try {
        if (sourceMapFiles.length === 0) {
          console.log("⚠️  未找到 SourceMap 文件");
          return;
        }

        console.log(`✅ 找到 ${sourceMapFiles.length} 个 SourceMap 文件\n`);

        // 2. 上传所有 SourceMap 文件
        console.log("📤 开始上传 SourceMap...");
        const uploadResults = await Promise.all(
          sourceMapFiles.map((file) => uploadSourceMap(file, config))
        );

        const successCount = uploadResults.filter(Boolean).length;
        console.log(`\n✅ 上传完成: ${successCount}/${sourceMapFiles.length} 成功`);

        // 3. 删除 SourceMap 文件（如果配置了）
        if (config.removeSourceMap) {
          console.log("\n🗑️  正在删除 SourceMap 文件...");
          sourceMapFiles.forEach((file) => {
            try {
              fs.unlinkSync(file);
              console.log(`  ✅ 已删除: ${path.basename(file)}`);
            } catch (error) {
              console.error(`  ❌ 删除失败: ${path.basename(file)}`, error);
            }
          });
        }

        console.log("\n🎉 SourceMap 处理完成!");
      } catch (error) {
        console.error("\n❌ SourceMap 处理失败:", error);
        // 不中断构建流程
      }
    },
  };
}

/**
 * 上传单个 SourceMap 文件到监控平台
 *
 * @param filePath - SourceMap 文件的绝对路径
 * @param config - 上传配置
 * @returns 上传是否成功
 *
 * @description
 * 这是一个示例实现，实际使用时需要根据你的监控平台（如 Sentry、阿里云 ARMS 等）
 * 修改上传逻辑。不同平台的 API 接口和参数可能不同。
 */
async function uploadSourceMap(
  filePath: string,
  _config: Required<
    Pick<
      SourceMapUploadOptions,
      "uploadUrl" | "apiKey" | "projectName" | "version"
    >
  >
): Promise<boolean> {
  console.log(`📤 正在上传: ${path.basename(filePath)}`);

  try {
    // 读取文件内容
    // const content = fs.readFileSync(filePath, 'utf-8')

    /*
     * ==============================================
     * 🔧 这里需要根据实际的监控平台 API 修改上传逻辑
     * ==============================================
     *
     * 示例 1: Sentry 上传
     * const formData = new FormData()
     * formData.append('file', new Blob([content]), path.basename(filePath))
     * formData.append('name', path.basename(filePath))
     *
     * const response = await fetch(`${config.uploadUrl}/${config.projectName}/${config.version}/`, {
     *   method: 'POST',
     *   headers: {
     *     'Authorization': `Bearer ${config.apiKey}`,
     *   },
     *   body: formData
     * })
     *
     * 示例 2: 阿里云 ARMS
     * const response = await fetch(config.uploadUrl, {
     *   method: 'POST',
     *   headers: {
     *     'Content-Type': 'application/json',
     *     'X-ARMS-API-KEY': config.apiKey,
     *   },
     *   body: JSON.stringify({
     *     project: config.projectName,
     *     version: config.version,
     *     file: content,
     *     filename: path.basename(filePath)
     *   })
     * })
     */

    // 当前是模拟上传（实际使用时请替换为真实的 API 调用）
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log(`✅ 上传成功: ${path.basename(filePath)}`);
    return true;
  } catch (error) {
    console.error(
      `❌ 上传失败: ${path.basename(filePath)}`,
      error instanceof Error ? error.message : error
    );
    return false;
  }
}
