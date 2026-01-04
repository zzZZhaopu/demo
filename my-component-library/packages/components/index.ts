import type { App } from 'vue'
import MyButton from './MyButton'
import MyInput from './MyInput'
import MyCard from './MyCard'

const components = [
  MyButton,
  MyInput,
  MyCard
]

const install = (app: App): void => {
  components.forEach(component => {
    app.use(component)
  })
}

export {
  install,
  MyButton,
  MyInput,
  MyCard
}

export default {
  install
}
