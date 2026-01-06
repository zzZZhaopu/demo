/**
 * Commitlint 配置文件
 * 
 * 作用：规范 Git 提交信息格式，确保团队提交信息统一
 * 
 * 提交格式：<type>(<scope>): <subject>
 * 例如：feat(user): 添加用户登录功能
 */

module.exports = {
  // 继承常规配置（Angular 提交规范）
  extends: ['@commitlint/config-conventional'],
  
  // 自定义规则
  rules: {
    /**
     * type 类型定义：提交的类型枚举
     * 
     * 0 = 禁用规则
     * 1 = 警告（不会阻止提交）
     * 2 = 错误（会阻止提交）
     */
    'type-enum': [
      2, // 错误级别，不符合规则会阻止提交
      'always', // 总是检查
      [
        'feat',      // 新功能（feature）
        'fix',       // 修复 bug
        'docs',      // 文档变更
        'style',     // 代码格式（不影响功能，如空格、分号等）
        'refactor',  // 重构（既不是新功能，也不是修复 bug）
        'perf',      // 性能优化
        'test',      // 增加测试
        'chore',     // 构建过程或辅助工具的变动
        'revert',    // 回滚到上一个版本
        'build',     // 构建系统或外部依赖项的更改
        'ci',        // CI/CD 配置文件和脚本的更改
      ],
    ],
    
    // subject 不能为空
    'subject-empty': [2, 'never'],
    
    // subject 不能以句号结尾
    'subject-full-stop': [2, 'never', '.'],
    
    // subject 首字母不需要大写（允许中英文混合）
    'subject-case': [0],
    
    // header（第一行）最大长度 100 字符
    'header-max-length': [2, 'always', 100],
  },
};
