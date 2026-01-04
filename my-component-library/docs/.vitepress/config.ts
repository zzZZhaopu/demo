import { defineConfig } from 'vitepress'
import { resolve } from 'path'

export default defineConfig({
  title: 'My UI Library',
  description: '基于 Vite + Vue3 的业务组件库',
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '组件', link: '/components/button' },
      { text: 'GitHub', link: 'https://github.com/yourusername/my-ui-library' }
    ],
    
    sidebar: [
      {
        text: '开始',
        items: [
          { text: '介绍', link: '/' },
          { text: '快速开始', link: '/guide/quick-start' }
        ]
      },
      {
        text: '组件',
        items: [
          { text: 'Button 按钮', link: '/components/button' },
          { text: 'Input 输入框', link: '/components/input' },
          { text: 'Card 卡片', link: '/components/card' }
        ]
      }
    ],
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/my-ui-library' }
    ],
    
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present'
    }
  },
  
  vite: {
    resolve: {
      alias: {
        '@': resolve(__dirname, '../../packages')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "${resolve(__dirname, '../../packages/styles/variables.scss')}";
            @import "${resolve(__dirname, '../../packages/styles/mixins.scss')}";
          `
        }
      }
    }
  }
})
