## vu3 项目解析

### 1、项目构建

```bash

npm init vite

# (默认安装 latest)
npm install vue-router

npm install -D sass

npm install element-plus

# 按需引入
npm install -D unplugin-vue-components unplugin-auto-import

```

### 2、项目目录结构

```bash

├── public
│   └── index.html
├── src
│   ├── assets
│   ├── components
│   ├── App.vue
│   ├── main.js
│   └── shims-vue.d.ts
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js

```

### 3、项目配置

#### 3.1、vite.config.js
