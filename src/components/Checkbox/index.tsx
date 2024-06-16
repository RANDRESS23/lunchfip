import { Checkbox as CheckboxUI } from '@nextui-org/react'

interface CheckboxProps {
  option: string
  checked: boolean
  className?: string
  onChange?: () => void
}

/* ➡ Componente del checbox del aplicativo */
export const Checkbox = ({ option, checked, className, onChange }: CheckboxProps) => {
  return (
    <CheckboxUI
      checked={checked}
      onChange={onChange}
      className={className}
      color='danger'
    >
      {option}
    </CheckboxUI>
  )
}
