import type { App } from 'vue';
import { Button } from './components/Button';
import { Input } from './components/Input';

// 全量导出
export { Button, Input };

// 导出类型
export type { ButtonProps } from './components/Button/types';
export type { InputProps } from './components/Input/types';

// 插件安装函数（支持全局引入）
export default {
  install(app: App) {
    app.component('MyButton', Button);
    app.component('MyInput', Input);
  }
};
