import { Select as SelectUI, SelectItem } from '@nextui-org/react'
import type {
  FieldErrors,
  FieldValues,
  UseFormRegister
} from 'react-hook-form'

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
  return (
    <>
      <SelectUI
        label={label}
        isRequired={isRequired}
        isDisabled={disabled}
        {...register(name)}
      >
        {
          options.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))
        }
      </SelectUI>
      {
        errors[name]?.message !== undefined && (
          <p className='text-red-600'>{String(errors[name]?.message)}</p>
        )
      }
    </>
  )
}
