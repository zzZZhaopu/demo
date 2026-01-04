import type { App, Plugin } from 'vue'
import MyCard from './src/MyCard.vue'

;(MyCard as any).install = function (app: App) {
  app.component((MyCard as any).name!, MyCard)
}

export default MyCard as typeof MyCard & Plugin
export * from './src/types'
