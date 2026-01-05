# Vite SourceMap 上传插件使用指南

## 📖 简介

这个插件可以在生产环境打包完成后，自动将 SourceMap 文件上传到监控平台（如 Sentry、阿里云 ARMS 等），并在上传完成后自动删除 .map 文件，避免源码泄露。

## 🎯 为什么需要这个插件？

### 问题背景
1. **生产环境代码被压缩混淆**：为了减小包体积和提升性能，生产代码会被压缩和混淆
2. **错误定位困难**：当线上出现 bug 时，错误堆栈显示的是压缩后的代码位置，无法定位到源码
3. **SourceMap 不能部署到生产**：SourceMap 包含源码信息，如果部署到生产环境会造成源码泄露

### 解决方案
1. **打包时生成 SourceMap**：用于错误定位
2. **上传到监控平台**：监控平台可以通过 SourceMap 还原错误堆栈
3. **上传后删除**：避免源码泄露

## 🚀 快速开始

### 1. 配置环境变量

在 `.env.production` 文件中配置：

```bash
# SourceMap 上传配置
# 监控平台上传地址
VITE_SOURCEMAP_UPLOAD_URL=https://your-monitor-platform.com/api/sourcemap
# 监控平台 API 密钥
VITE_SOURCEMAP_API_KEY=your-api-key-here
```

### 2. 运行生产构建

```bash
npm run build:prod
```

### 3. 查看输出

插件会在构建完成后自动执行，输出类似：

```
🚀 开始处理 SourceMap 文件...

✅ 找到 5 个 SourceMap 文件

📤 开始上传 SourceMap...
📤 正在上传: index-B1Jke7sI.js.map
✅ 上传成功: index-B1Jke7sI.js.map
...

✅ 上传完成: 5/5 成功

🗑️  正在删除 SourceMap 文件...
  ✅ 已删除: index-B1Jke7sI.js.map
  ...

🎉 SourceMap 处理完成!
```

## ⚙️ 配置选项

在 `vite.config.ts` 中配置插件：

```typescript
uploadSourceMapPlugin({
  // 是否启用插件（默认仅在生产环境启用）
  enabled: mode === 'production',
  
  // 监控平台 API 地址
  uploadUrl: env.VITE_SOURCEMAP_UPLOAD_URL,
  
  // API 密钥
  apiKey: env.VITE_SOURCEMAP_API_KEY,
  
  // 项目名称
  projectName: 'vue3-demo',
  
  // 项目版本
  version: '1.0.0',
  
  // 上传完成后是否删除 SourceMap 文件（默认 true）
  removeSourceMap: true
})
```

## 🔧 对接不同监控平台

### Sentry

修改 `vite-plugin-upload-sourcemap.ts` 中的 `uploadSourceMap` 函数：

```typescript
async function uploadSourceMap(filePath: string, config: any): Promise<boolean> {
  const formData = new FormData()
  const content = fs.readFileSync(filePath, 'utf-8')
  
  formData.append('file', new Blob([content]), path.basename(filePath))
  formData.append('name', path.basename(filePath))
  
  const response = await fetch(
    `${config.uploadUrl}/${config.projectName}/${config.version}/`, 
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: formData
    }
  )
  
  return response.ok
}
```

### 阿里云 ARMS

```typescript
async function uploadSourceMap(filePath: string, config: any): Promise<boolean> {
  const content = fs.readFileSync(filePath, 'utf-8')
  
  const response = await fetch(config.uploadUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-ARMS-API-KEY': config.apiKey,
    },
    body: JSON.stringify({
      project: config.projectName,
      version: config.version,
      file: content,
      filename: path.basename(filePath)
    })
  })
  
  return response.ok
}
```

## 📝 工作流程

```
1. 开发阶段
   ├─ 编写代码
   └─ 本地调试

2. 构建阶段 (npm run build:prod)
   ├─ TypeScript 编译
   ├─ Vite 打包
   │  ├─ 生成压缩后的 JS 文件
   │  └─ 生成对应的 .map 文件
   └─ SourceMap 上传插件执行
      ├─ 查找所有 .map 文件
      ├─ 上传到监控平台
      └─ 删除 .map 文件 ✓

3. 部署阶段
   ├─ 部署 dist 目录（不包含 .map 文件）
   └─ 源码不会泄露 ✓

4. 线上运行
   ├─ 用户访问压缩后的代码
   ├─ 发生错误时
   ├─ 监控平台捕获错误
   └─ 通过 SourceMap 还原错误位置 ✓
```

## 🆚 与原脚本的对比

### 原来的方式（脚本）

```json
{
  "scripts": {
    "build:prod": "rimraf dist && vue-tsc -b && vite build --mode production && node scripts/upload-sourcemap.js && rimraf dist/**/*.map"
  }
}
```

**缺点：**
- 命令太长，难以维护
- 需要手动删除 .map 文件
- 构建流程不清晰
- 需要额外的 rimraf 依赖

### 现在的方式（插件）

```json
{
  "scripts": {
    "build:prod": "vue-tsc -b && vite build --mode production"
  }
}
```

**优点：**
- ✅ 命令简洁
- ✅ 自动化处理（上传 + 删除）
- ✅ 集成在构建流程中
- ✅ 配置更灵活
- ✅ 代码复用性强

## 🔍 常见问题

### Q1: 为什么构建后 dist 目录没有 .map 文件？

**A:** 这是正常的！插件会在上传完成后自动删除 .map 文件。如果你想保留文件用于调试，可以：

```typescript
uploadSourceMapPlugin({
  enabled: mode === 'production',
  removeSourceMap: false  // 不删除 .map 文件
})
```

### Q2: 如何在开发/测试环境禁用插件？

**A:** 插件默认只在生产环境启用，通过 `enabled` 选项控制：

```typescript
uploadSourceMapPlugin({
  enabled: mode === 'production'  // 只在生产环境启用
})
```

### Q3: 上传失败怎么办？

**A:** 插件不会中断构建流程。上传失败只会在控制台输出错误信息，但不影响打包结果。你可以：

1. 检查网络连接
2. 检查 API 地址和密钥是否正确
3. 查看控制台的详细错误信息

### Q4: 如何验证插件是否正常工作？

**A:** 运行 `npm run build:prod` 后，观察控制台输出：

```
🚀 开始处理 SourceMap 文件...
✅ 找到 X 个 SourceMap 文件
📤 开始上传 SourceMap...
✅ 上传完成: X/X 成功
🎉 SourceMap 处理完成!
```

## 📚 扩展阅读

- [Vite 插件开发指南](https://vitejs.dev/guide/api-plugin.html)
- [SourceMap 原理](https://web.dev/source-maps/)
- [Sentry SourceMap 上传](https://docs.sentry.io/platforms/javascript/sourcemaps/)

## 💡 提示

如果你使用的监控平台不在上述示例中，可以参考平台的官方文档修改 `uploadSourceMap` 函数的实现。

