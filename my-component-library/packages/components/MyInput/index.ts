import type { App, Plugin } from 'vue'
import MyInput from './src/MyInput.vue'

;(MyInput as any).install = function (app: App) {
  app.component((MyInput as any).name!, MyInput)
}

export default MyInput as typeof MyInput & Plugin
export * from './src/types'
