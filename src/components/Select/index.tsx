import { SelectItem } from '@nextui-org/react'
import type {
  FieldErrors,
  FieldValues,
  UseFormRegister
} from 'react-hook-form'
import { MySelect } from './SelectExtend'
import { cn } from '@/libs/utils'
import { usePathname } from 'next/navigation'

interface SelectProps {
  label: string
  isRequired: boolean
  name: string
  options: Array<{ label: string, value: string }>
  disabled?: boolean
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
}

export const Select = (
  { label, isRequired, name, options, disabled, register, errors }: SelectProps
) => {
  const pathname = usePathname()

  return (
    <>
      <div className='relative overflow-hidden p-[1px] rounded-xl'>
        <MySelect
          label={label}
          isRequired={isRequired}
          isDisabled={disabled}
          color='stone'
          {...register(name)}
        >
          {
            options.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))
          }
        </MySelect>

        <span
          className={cn(
            'absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#00aaff_0%,#ff3366_50%,#00aaff_100%)] -z-10',
            pathname === '/sign-up' ? 'lg:animate-[spin_2s_linear_infinite]' : 'animate-[spin_2s_linear_infinite]'
          )}
        />
      </div>
      {
        errors[name]?.message !== undefined && (
          <p className='text-color-secondary -mt-3 text-sm z-10'>{String(errors[name]?.message)}</p>
        )
      }
    </>
  )
}
