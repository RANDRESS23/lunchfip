import { Button as ButtonUI } from '@nextui-org/react'
import { cn } from '@/lib/utils'

interface ButtonProps {
  type: 'button' | 'submit' | 'reset'
  text: string
  disabled: boolean
}

export const Button = ({ type, text, disabled }: ButtonProps) => {
  return (
    <ButtonUI
      type={type}
      className={cn(
        'py-6 font-semibold text-md bg-transparent bg-clip-text animate-color-cycle-4 mt-5 border border-gray-200 transition-all duration-300',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-current hover:bg-clip-inherit'
      )}
      disabled={disabled}
    >
      {text}
    </ButtonUI>
  )
}
