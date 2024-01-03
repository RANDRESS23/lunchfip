import { Checkbox as CheckboxUI } from '@nextui-org/react'

interface CheckboxProps {
  option: string
  checked: boolean
  onChange?: () => void
}

export const Checkbox = ({ option, checked, onChange }: CheckboxProps) => {
  return (
    <CheckboxUI
      checked={checked}
      onChange={onChange}
    >
      {option}
    </CheckboxUI>
  )
}
