import { cn } from '@/libs/utils'
import type {
  FieldErrors,
  FieldValues,
  UseFormRegister
} from 'react-hook-form'
import { MyInput } from './InputExtend'

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
      <div className='relative overflow-hidden p-[1px] rounded-xl w-full'>
        <MyInput
          type={type}
          label={label}
          isRequired={isRequired}
          variant={variant}
          isDisabled={disabled}
          size={size}
          defaultValue={value}
          {...register(name)}
          endContent={endContent}
          className={cn(
            'z-10',
            className
          )}
          classNames={{
            input: classNamesInput
          }}
          onKeyDown={(e) => {
            if (keyDown !== undefined) keyDown(e)
          }}
          onKeyUp={(e) => {
            if (keyUp !== undefined) keyUp(e, nextInputName, previousInputName)
          }}
          color={variant !== 'underlined' ? 'stone' : 'default'}
        />

        {
          variant !== 'underlined' && (
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00aaff_0%,#ff3366_50%,#00aaff_100%)] -z-10" />
          )
        }
      </div>
      {
        errors[name]?.message !== undefined && (
          <p className='text-red-600'>{String(errors[name]?.message)}</p>
        )
      }
    </>
  )
}
