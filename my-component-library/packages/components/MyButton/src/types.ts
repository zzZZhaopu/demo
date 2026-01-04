export interface MyButtonProps {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  loading?: boolean
  text?: string
  icon?: string
  round?: boolean
  circle?: boolean
}

export interface MyButtonEmits {
  (e: 'click', event: MouseEvent): void
}
