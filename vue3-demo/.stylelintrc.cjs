module.exports = {
  // 继承推荐的标准配置
  extends: [
    'stylelint-config-standard',              // CSS 标准规则
    'stylelint-config-recommended-vue/scss'   // Vue + SCSS 支持
  ],
  
  // 插件
  plugins: [
    'stylelint-scss'  // SCSS 语法支持
  ],
  
  // 自定义语法解析器配置
  overrides: [
    {
      // 对 Vue 文件使用特殊的解析器
      files: ['*.vue', '**/*.vue'],
      customSyntax: 'postcss-html'
    },
    {
      // 对 SCSS 文件使用 SCSS 解析器
      files: ['*.scss', '**/*.scss'],
      customSyntax: 'postcss-scss'
    }
  ],
  rules: {
    // 允许未知的 @ 规则
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': null,
    
    // 允许空的源文件
    'no-empty-source': null,
    
    // 选择器类名的命名格式（允许 BEM 命名法）
    'selector-class-pattern': null,
    
    // 关键帧动画名称格式
    'keyframes-name-pattern': null,
    
    // 允许选择器优先级降序
    'no-descending-specificity': null,
    
    // 允许双斜杠注释
    'no-invalid-double-slash-comments': null,
    
    // 允许未知的伪元素
    'selector-pseudo-element-no-unknown': null,
    
    // 允许未知的伪类
    'selector-pseudo-class-no-unknown': null,
    
    // 允许 @import 位置
    'no-invalid-position-at-import-rule': null,
    
    // 允许重复选择器
    'no-duplicate-selectors': null,
    
    // 允许 ID 选择器
    'selector-id-pattern': null,
    
    // SCSS 变量命名
    'scss/dollar-variable-pattern': null,
    
    // SCSS 操作符空格
    'scss/operator-no-unspaced': null,
    
    // SCSS 注释
    'scss/comment-no-empty': null,
    'scss/double-slash-comment-whitespace-inside': null,
    
    // 允许 vendor 前缀
    'property-no-vendor-prefix': null,
    'value-no-vendor-prefix': null,
    
    // 其他
    'font-family-no-missing-generic-family-keyword': null
  },
};
