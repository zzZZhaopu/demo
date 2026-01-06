# Git 提交规范

本项目使用 Husky + Commitlint + Lint-staged 来规范代码提交流程。

## 📝 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 示例

```bash
# 简单提交
feat(user): 添加用户登录功能

# 完整提交
feat(user): 添加用户登录功能

实现了用户名密码登录和记住密码功能

Closes #123
```

---

## 🏷️ Type 类型说明

| Type | 说明 | 示例 |
|------|------|------|
| **feat** | 新功能 | `feat(user): 添加用户注册功能` |
| **fix** | 修复 bug | `fix(login): 修复登录失败的问题` |
| **docs** | 文档变更 | `docs(readme): 更新安装说明` |
| **style** | 代码格式（不影响功能） | `style(home): 调整首页布局` |
| **refactor** | 重构（既不是新功能也不是修复） | `refactor(api): 优化接口请求逻辑` |
| **perf** | 性能优化 | `perf(list): 优化列表渲染性能` |
| **test** | 增加测试 | `test(user): 添加用户模块单元测试` |
| **chore** | 构建过程或辅助工具的变动 | `chore(deps): 升级依赖包版本` |
| **revert** | 回滚 | `revert: 回滚到 v1.0.0` |
| **build** | 构建系统或依赖项的更改 | `build(vite): 优化打包配置` |
| **ci** | CI/CD 配置更改 | `ci(github): 添加自动部署流程` |

---

## 🎯 Scope 范围（可选）

范围用于说明提交影响的范围，比如：

- `user` - 用户模块
- `order` - 订单模块
- `api` - 接口相关
- `deps` - 依赖相关
- `config` - 配置相关

---

## ✅ 提交流程

### 1. 暂存文件
```bash
git add .
```

### 2. 提交代码
```bash
git commit -m "feat(user): 添加用户登录功能"
```

### 3. 自动检查
提交时会自动执行：

**Pre-commit Hook（提交前）：**
- ✅ TypeScript 类型检查
- ✅ Stylelint 样式检查和自动修复

**Commit-msg Hook（提交信息检查）：**
- ✅ 检查提交信息格式是否符合规范

---

## ❌ 常见错误

### 错误 1：提交信息格式不正确

```bash
# ❌ 错误示例
git commit -m "添加登录功能"
git commit -m "fix bug"
git commit -m "update"

# ✅ 正确示例
git commit -m "feat(user): 添加登录功能"
git commit -m "fix(login): 修复登录失败的问题"
git commit -m "docs(readme): 更新文档"
```

**错误提示：**
```
⧗   input: 添加登录功能
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
```

### 错误 2：类型拼写错误

```bash
# ❌ 错误
git commit -m "feature(user): 添加登录功能"

# ✅ 正确
git commit -m "feat(user): 添加登录功能"
```

### 错误 3：代码检查未通过

如果代码有 TypeScript 错误或样式问题，提交会被阻止。

**解决方法：**
1. 修复代码错误
2. 重新提交

---

## 🔧 跳过检查（不推荐）

在紧急情况下，可以跳过 Hooks 检查：

```bash
# 跳过所有 Hooks
git commit --no-verify -m "feat(user): 添加登录功能"

# 或使用简写
git commit -n -m "feat(user): 添加登录功能"
```

**⚠️ 注意：** 非必要情况不要跳过检查，这会降低代码质量！

---

## 💡 最佳实践

### 1. 提交信息要清晰
```bash
# ❌ 不好
git commit -m "fix: 修复问题"

# ✅ 好
git commit -m "fix(login): 修复用户名为空时登录崩溃的问题"
```

### 2. 提交要原子化
- 每次提交只做一件事
- 避免一次提交包含多个不相关的改动

### 3. 善用 Scope
```bash
feat(user): 添加用户登录功能
feat(order): 添加订单列表页面
fix(api): 修复接口超时问题
```

### 4. 及时提交
- 完成一个功能点就提交
- 不要积累太多改动再提交

---

## 🛠️ 手动检查命令

如果想在提交前手动检查代码：

```bash
# TypeScript 类型检查
npm run lint:script

# 样式检查
npm run lint:style
```

---

## 📚 相关配置文件

- `.husky/pre-commit` - 提交前检查脚本
- `.husky/commit-msg` - 提交信息检查脚本
- `commitlint.config.cjs` - Commitlint 配置
- `package.json` - lint-staged 配置

---

## 🤝 团队协作

所有团队成员都应该：
1. ✅ 遵守提交信息规范
2. ✅ 确保代码检查通过再提交
3. ✅ 不要随意跳过 Hooks 检查
4. ✅ 保持提交信息清晰明了

---

## ❓ 常见问题

### Q: 为什么需要这些规范？
A: 规范的提交信息和代码质量检查可以：
- 方便团队成员理解代码变更
- 自动生成更新日志（CHANGELOG）
- 快速定位问题和回滚
- 保证代码质量

### Q: Husky 检查会影响提交速度吗？
A: 只检查暂存区的文件，速度很快，一般在几秒内完成。

### Q: 如何禁用 Husky？
A: 不推荐禁用。如果必须禁用：
```bash
# 临时禁用
HUSKY=0 git commit -m "message"

# 永久禁用（不推荐）
npm uninstall husky
```
