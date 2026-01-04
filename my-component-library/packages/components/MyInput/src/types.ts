export interface MyInputProps {
  modelValue?: string | number
  type?: 'text' | 'password' | 'number' | 'email'
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  size?: 'large' | 'default' | 'small'
  maxlength?: number
}

export interface MyInputEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
}
