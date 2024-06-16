import { TextGenerateEffect } from '../ui/text-generate-effect'
import { words } from '@/constants/wordsSubtitleHome'

/* ➡ Componente del subtitle principal de la Home Page */
export const SubTitle = () => {
  return (
    <TextGenerateEffect
      className='flex justify-center items-center text-center text-lg lg:max-w-2xl z-10 text-p-light dark:text-p-dark font-normal italic transition-all'
      words={words}
    />
  )
}
