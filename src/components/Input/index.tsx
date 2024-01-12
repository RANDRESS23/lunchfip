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
  variant?: 'flat' | 'bordered' | 'underlined' | 'faded'
  endContent?: React.ReactNode
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  className?: string
  classNamesInput?: string[]
  nextInputName?: string
  keyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  keyUp?: (event: React.KeyboardEvent<HTMLInputElement>, nextInputName: string) => void
}

export const Input = (
  { type, label, isRequired, name, variant, endContent, register, errors, className, classNamesInput, nextInputName, keyDown, keyUp }: InputProps
) => {
  return (
    <>
      <InputUI
        type={type}
        label={label}
        isRequired={isRequired}
        variant={variant}
        {...register(name)}
        endContent={endContent}
        className={className}
        classNames={{
          input: classNamesInput
        }}
        onKeyDown={keyDown}
        onKeyUp={(e) => {
          if (keyUp !== undefined && nextInputName !== undefined) keyUp(e, nextInputName)
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
