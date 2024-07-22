import { TitleAnimated } from '@/components/TitleAnimated'
import Image from 'next/image'

/* ➡ Este componente es el que se renderiza todo el contenido de la pagina "nosotros" del aplicativo */
export const AboutUsSection = () => {
  return (
    <section className='font-inter-sans flex flex-col justify-center items-center gap-24 lg:gap-32'>
      <article className='relative flex justify-center items-center gap-14 reveal-object'>
        <Image
          src='https://res.cloudinary.com/dje4ke8hw/image/upload/v1718232128/svgs/about-us_ygz45n.svg'
          alt='about us'
          width={200}
          height={200}
          className='hidden lg:flex w-[350px]'
        />
        <div className='flex flex-col justify-center items-center'>
          <TitleAnimated
            text1='¿Quiénes'
            text2='somos?'
            isTextRowMobile
            isTextLeft
          />
          <p className='text-neutral-700 dark:text-neutral-300 text-center lg:text-left transition-all'>Somos un equipo dedicado de estudiantes y profesionales del Instituto Tolimense de Formación Técnica Profesional (ITFIP) comprometidos con la mejora de la experiencia universitaria. Nuestra plataforma, LunchFip, nace de la necesidad de optimizar el proceso de reservas y entrega de almuerzos, brindando una solución eficiente y segura que ahorra tiempo y reduce errores.</p>
        </div>
        <div className='hidden lg:flex absolute left-0 w-[350px] h-[350px] bg-gradient-to-r from-color-primary to-color-secondary lg:rounded-full blur-[75px] opacity-15 dark:opacity-25 -z-10' />
      </article>
      <article className='flex justify-center items-center gap-14 reveal-object'>
        <div className='flex flex-col justify-center items-center'>
          <TitleAnimated
            text1='Nuestra'
            text2='Misión'
            isTextRowMobile
            isTextLeft
          />
          <p className='text-neutral-700 dark:text-neutral-300 text-center lg:text-left transition-all'>Nuestra misión es transformar la gestión de almuerzos en el ITFIP a través de la innovación tecnológica. Nos esforzamos por proporcionar una plataforma accesible y confiable que facilite las reservas diarias de almuerzos, garantizando un proceso rápido, preciso y sin complicaciones para todos los estudiantes y el personal encargado.</p>
        </div>
        <Image
          src='https://res.cloudinary.com/dje4ke8hw/image/upload/v1718233963/svgs/mision_igi4w1.svg'
          alt='mision'
          width={200}
          height={200}
          className='hidden lg:flex w-96'
        />
        <div className='hidden lg:flex absolute right-0 w-[350px] h-[350px] bg-gradient-to-r from-color-primary to-color-secondary rounded-full blur-[75px] opacity-15 dark:opacity-25 -z-10' />
      </article>
      <article className='flex justify-center items-center gap-14 reveal-object'>
        <Image
          src='https://res.cloudinary.com/dje4ke8hw/image/upload/v1718234155/svgs/vision_srsmbj.svg'
          alt='about us'
          width={200}
          height={200}
          className='hidden lg:flex w-[340px]'
        />
        <div className='flex flex-col justify-center items-center'>
          <TitleAnimated
            text1='Nuestra'
            text2='Visión'
            isTextRowMobile
            isTextLeft
          />
          <p className='text-neutral-700 dark:text-neutral-300 text-center lg:text-left transition-all'>Nuestra visión es ser el modelo de referencia en la gestión de servicios estudiantiles mediante soluciones tecnológicas avanzadas. Aspiramos a expandir nuestras soluciones a otras áreas y universidades, promoviendo una cultura de eficiencia, seguridad y satisfacción en la comunidad educativa.</p>
        </div>
        <div className='hidden lg:flex absolute left-0 w-[350px] h-[350px] bg-gradient-to-r from-color-primary to-color-secondary lg:rounded-full blur-[75px] opacity-15 dark:opacity-25 -z-10' />
      </article>
    </section>
  )
}
