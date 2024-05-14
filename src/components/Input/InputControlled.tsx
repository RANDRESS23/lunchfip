import { cn } from '@/libs/utils'
import {
  Controller,
  type FieldErrors,
  type FieldValues
} from 'react-hook-form'
import { MyInput } from './InputExtend'
import { usePathname } from 'next/navigation'

interface InputProps {
  type: string
  name: string
  label?: string
  disabled?: boolean
  isRequired: boolean
  control: any
  size?: 'sm' | 'md' | 'lg'
  variant?: 'flat' | 'bordered' | 'underlined' | 'faded'
  endContent?: React.ReactNode
  errors: FieldErrors<FieldValues>
  className?: string
  classNamesInput?: string[]
}

export const InputControlled = (
  { type, name, label, disabled, isRequired, control, size, variant, endContent, errors, className, classNamesInput }: InputProps
) => {
  const pathname = usePathname()

  return (
    <>
      <div className='relative overflow-hidden p-[1px] rounded-xl w-full'>
        <Controller
          render={({ field }) => (
            <MyInput
              {...field}
              type={type}
              label={label}
              variant={variant}
              size={size}
              endContent={endContent}
              isDisabled={disabled}
              isRequired={isRequired}
              className={cn(
                'z-10',
                className
              )}
              classNames={{
                input: [...(classNamesInput ?? []), 'disabled:text-zinc-400 disabled:dark:text-zinc-500'],
                label: ['disabled:text-zinc-400 dark:disabled:text-zinc-500']
              }}
              color={variant !== 'underlined' ? 'stone' : 'default'}
            />
          )}
          name={name}
          rules={{ required: isRequired }}
          control={control}
          disabled={disabled}
        />

        {
          variant !== 'underlined' && (
            <span
              className={cn(
                'absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#00aaff_0%,#ff3366_50%,#00aaff_100%)] -z-10',
                (pathname === '/sign-up' || pathname === '/profile/student/info') ? 'lg:animate-[spin_2s_linear_infinite]' : 'animate-[spin_2s_linear_infinite]'
              )}
            />
          )
        }
      </div>
      {
        errors[name]?.message !== undefined && (
          <p className='text-color-secondary -mt-3 text-sm z-10'>{String(errors[name]?.message)}</p>
        )
      }
    </>
  )
}
