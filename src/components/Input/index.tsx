import { Input as InputUI } from '@nextui-org/react'
import type {
  FieldErrors,
  FieldValues,
  UseFormRegister
} from 'react-hook-form'

interface InputProps {
  type: string
  label: string
  isRequired: boolean
  name: string
  endContent?: React.ReactNode
  register: UseFormRegister<FieldValues>
  errors?: FieldErrors<FieldValues>
}

export const Input = (
  { type, label, isRequired, name, endContent, register, errors }: InputProps
) => {
  return (
    <InputUI
      type={type}
      label={label}
      isRequired={isRequired}
      {...register(name)}
      endContent={endContent}
    />
  )
}
