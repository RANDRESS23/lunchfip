import { TitleAnimated } from '../TitleAnimated'
import { ItemsBecauseCards } from './ItemsBecauseCards'

export const BecauseSection = () => {
  return (
    <section className="relative flex flex-col justify-center items-center py-20 font-inter-sans">
      <div className='hidden md:flex absolute top-7 -left-10 md:w-[550px] md:h-[100px]'>
        <div className='md:w-[550px] md:h-[50px] bg-gradient-to-r from-color-primary to-color-secondary rounded-b-full blur-[75px] opacity-15 dark:opacity-25' />
      </div>
      <div className='hidden md:flex absolute top-7 -right-10 md:w-[550px] md:h-[100px]'>
        <div className='md:w-[550px] md:h-[50px] bg-gradient-to-r from-color-secondary to-color-primary rounded-b-full blur-[75px] opacity-15 dark:opacity-25' />
      </div>
      <TitleAnimated
        text1="¿Por qué"
        text2="LunchFip?"
        textSize="text-[40px]"
      />
      <p className="flex justify-center items-center text-center text-lg lg:max-w-3xl z-10 text-p-light dark:text-p-dark font-normal italic transition-all">LunchFip revoluciona la forma en que los estudiantes del ITFIP reservan y reclaman sus almuerzos, reduciendo las filas, incremento de seguridad, y por supuesto, mejorando la eficiencia de todo el proceso. Aquí te mostramos cómo:</p>
      <ItemsBecauseCards />
    </section>
  )
}
