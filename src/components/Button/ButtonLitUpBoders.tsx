import { cn } from '@/libs/utils'
import { ButtonsCard } from '../ui/tailwindcss-buttons'

interface ButtonLitUpBordersProps {
  type: 'button' | 'submit' | 'reset'
  text: string
  disabled: boolean
  onClick?: () => void
}

/* ➡ Componente del boton customizable */
export const ButtonLitUpBorders = ({ type, text, disabled, onClick }: ButtonLitUpBordersProps) => {
  return (
    <ButtonsCard className='w-full group hover:shadow-[-10px_-10px_30px_4px_rgba(253,44,97,0.15),_10px_10px_30px_4px_rgba(255,51,102,0.15)] rounded-xl transition-all z-10'>
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className="w-full h-12 relative rounded-xl p-[1px]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-color-secondary-b to-color-secondary rounded-xl" />
        <div className={cn(
          'w-full h-full flex items-center justify-center px-3 py-1 text-md font-medium bg-white dark:bg-black rounded-xl relative transition-all duration-200 text-nav-link-light dark:text-nav-link-dark hover:bg-transparent',
          disabled ? 'cursor-not-allowed' : 'hover:text-white'
        )}>
          {text}
        </div>
      </button>
    </ButtonsCard>
  )
}
