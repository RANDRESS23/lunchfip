import { cn } from '@/libs/utils'

interface TitleAnimatedProps {
  text1: string
  text2: string
  textSize?: string
  isTextLeft?: boolean
  isTextCol?: boolean
  isTextRowMobile?: boolean
}

/* ➡ Componente que renderiza un titulo principal animado */
export const TitleAnimated = ({ text1, text2, textSize, isTextLeft, isTextCol, isTextRowMobile }: TitleAnimatedProps) => {
  const textSizeDefault = 'text-3xl lg:text-4xl'

  return (
    <div className={cn(
      'w-full relative flex flex-col items-center text-center mb-5 md:gap-3 reveal-object',
      isTextLeft === undefined ? 'justify-center' : 'justify-center lg:justify-start',
      isTextCol ? 'lg:flex-col' : 'lg:flex-row',
      isTextRowMobile && 'flex-row gap-3'
    )}>
      <span className={cn(
        'bg-clip-text text-transparent bg-gradient-to-b dark:from-white dark:to-neutral-400 from-black/80 to-black font-extrabold',
        textSize ?? textSizeDefault
      )}>{text1}</span>
      <div className='relative flex justify-center items-center'>
        <span className={cn(
          'top-0 left-0 font-extrabold opacity-0',
          textSize ?? textSizeDefault
        )}>{text2}</span>
        <span className={cn(
          'absolute top-0 left-0 bg-clip-text text-transparent bg-gradient-to-r from-color-primary to-color-primary font-extrabold animate-color-cycle-1',
          textSize ?? textSizeDefault
        )}>{text2}</span>
        <span className={cn(
          'absolute top-0 left-0 bg-clip-text text-transparent bg-gradient-to-r from-color-primary to-color-secondary font-extrabold animate-color-cycle-2',
          textSize ?? textSizeDefault
        )}>{text2}</span>
        <span className={cn(
          'absolute top-0 left-0 bg-clip-text text-transparent bg-gradient-to-r from-color-secondary to-color-secondary font-extrabold animate-color-cycle-3',
          textSize ?? textSizeDefault
        )}>{text2}</span>
      </div>
    </div>
  )
}
