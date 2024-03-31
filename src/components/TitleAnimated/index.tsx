import { cn } from '@/libs/utils'

interface TitleAnimatedProps {
  text1: string
  text2: string
}

export const TitleAnimated = ({ text1, text2 }: TitleAnimatedProps) => {
  return (
    <div className={cn(
      'relative flex flex-col justify-center items-center text-center mb-5 md:gap-2',
      text1.length >= 20 ? 'lg:flex-col' : 'lg:flex-row'
    )}>
      <span className='bg-clip-text text-transparent bg-gradient-to-b dark:from-white dark:to-neutral-400 from-black/80 to-black text-3xl lg:text-4xl font-extrabold'>{text1}</span>
      <div className='relative flex justify-center items-center'>
        <span className='top-0 left-0 text-3xl lg:text-4xl font-extrabold opacity-0'>{text2}</span>
        <span className='absolute top-0 left-0 bg-clip-text text-transparent bg-gradient-to-r from-color-primary to-color-primary text-3xl lg:text-4xl font-extrabold animate-color-cycle-1'>{text2}</span>
        <span className='absolute top-0 left-0 bg-clip-text text-transparent bg-gradient-to-r from-color-primary to-color-secondary text-3xl lg:text-4xl font-extrabold animate-color-cycle-2'>{text2}</span>
        <span className='absolute top-0 left-0 bg-clip-text text-transparent bg-gradient-to-r from-color-secondary to-color-secondary text-3xl lg:text-4xl font-extrabold animate-color-cycle-3'>{text2}</span>
      </div>
    </div>
  )
}
