import { cn } from '@/libs/utils'
import { ButtonsCard } from '../ui/tailwindcss-buttons'

interface ButtonProps {
  type: 'button' | 'submit' | 'reset'
  text: string
  disabled: boolean
  onClick?: () => void
}

export const Button = ({ type, text, disabled, onClick }: ButtonProps) => {
  return (
    <ButtonsCard className='w-full group hover:shadow-[-10px_-10px_30px_4px_rgba(0,170,255,0.15),_10px_10px_30px_4px_rgba(255,51,102,0.15)] rounded-xl transition-all z-10'>
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className="w-full relative inline-flex overflow-hidden rounded-xl p-[1px]"
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00aaff_0%,#ff3366_50%,#00aaff_100%)]" />
        <span className={cn(
          'inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-white dark:bg-black px-3 py-3 text-md font-medium backdrop-blur-3xl transition-all text-nav-link-light dark:text-nav-link-dark',
          disabled ? 'cursor-not-allowed' : 'hover:text-black dark:hover:text-white'
        )}
        >
          {text}
        </span>
      </button>
    </ButtonsCard>
  )
}
