import { defineConfig } from 'vitepress'
import { demoblockPlugin, demoblockVitePlugin } from 'vitepress-theme-demoblock'

export default defineConfig({
  title: 'UI 规范站点',
  description: '后台系统 UI 规范与组件示例',
  markdown: {
    config: (md) => {
      md.use(demoblockPlugin)
    }
  },
  vite: {
    plugins: [demoblockVitePlugin()]
  },
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '组件示例', link: '/components/button' }
    ],
    sidebar: {
      '/components/': [
        {
          text: '组件示例',
          items: [
            { text: '按钮 Button', link: '/components/button' }
          ]
        }
      ]
    }
  }
})
