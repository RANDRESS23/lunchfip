import { SelectItem } from '@nextui-org/react'
import {
  Controller,
  type FieldErrors,
  type FieldValues
} from 'react-hook-form'
import { MySelect } from './SelectExtend'
import { cn } from '@/libs/utils'
import { usePathname } from 'next/navigation'

interface SelectProps {
  label: string
  isRequired: boolean
  name: string
  control: any
  value: Set<any>
  options: Array<{ label: string, value: string }>
  disabled?: boolean
  errors: FieldErrors<FieldValues>
  setValue: (keys: any) => any
}

export const SelectControlled = (
  { label, isRequired, name, control, value, options, disabled, errors, setValue }: SelectProps
) => {
  const pathname = usePathname()

  if (options.length === 0) return null

  return (
    <>
      <div className='relative overflow-hidden p-[1px] rounded-xl'>
        <Controller
          render={({ field }) => (
            <MySelect
              {...field}
              label={label}
              isRequired={isRequired}
              isDisabled={disabled}
              selectedKeys={value}
              onSelectionChange={setValue}
              color='stone'
            >
              {
                options.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))
              }
            </MySelect>
          )}
          name={name}
          rules={{ required: isRequired }}
          control={control}
          disabled={disabled}
        />

        <span
          className={cn(
            'absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#00aaff_0%,#ff3366_50%,#00aaff_100%)] -z-10',
            (pathname === '/sign-up' || pathname === '/profile/student/info') ? 'lg:animate-[spin_2s_linear_infinite]' : 'animate-[spin_2s_linear_infinite]'
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
