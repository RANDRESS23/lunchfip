import { Input as InputUI } from '@nextui-org/react'
import type {
  FieldErrors,
  FieldValues,
  UseFormRegister
} from 'react-hook-form'

interface InputProps {
  type: string
  label?: string
  isRequired: boolean
  name: string
  size?: 'sm' | 'md' | 'lg'
  value?: string
  variant?: 'flat' | 'bordered' | 'underlined' | 'faded'
  disabled?: boolean
  endContent?: React.ReactNode
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  className?: string
  classNamesInput?: string[]
  previousInputName?: string
  nextInputName?: string
  keyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  keyUp?: (event: React.KeyboardEvent<HTMLInputElement>, nextInputName?: string, previousInputName?: string) => void
}

export const Input = (
  { type, label, isRequired, name, size, value, variant, disabled, endContent, register, errors, className, classNamesInput, previousInputName, nextInputName, keyDown, keyUp }: InputProps
) => {
  return (
    <>
      <InputUI
        type={type}
        label={label}
        isRequired={isRequired}
        variant={variant}
        isDisabled={disabled}
        size={size}
        defaultValue={value}
        {...register(name)}
        endContent={endContent}
        className={className}
        classNames={{
          input: classNamesInput
        }}
        onKeyDown={(e) => {
          if (keyDown !== undefined) keyDown(e)
        }}
        onKeyUp={(e) => {
          if (keyUp !== undefined) keyUp(e, nextInputName, previousInputName)
        }}
      />
      {
        errors[name]?.message !== undefined && (
          <p className='text-red-600'>{String(errors[name]?.message)}</p>
        )
      }
    </>
  )
}
