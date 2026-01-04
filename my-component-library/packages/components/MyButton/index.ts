import type { App, Plugin } from 'vue'
import MyButton from './src/MyButton.vue'

;(MyButton as any).install = function (app: App) {
  app.component((MyButton as any).name!, MyButton)
}

export default MyButton as typeof MyButton & Plugin
export * from './src/types'
