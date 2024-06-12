import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect'
import Image from 'next/image'

const wordsAboutUs = [
  {
    text: '¿Quiénes'
  },
  {
    text: 'somos?',
    className: 'text-color-primary dark:text-color-secondary'
  }
]

const wordsMision = [
  {
    text: 'Nuestra'
  },
  {
    text: 'Misión',
    className: 'text-color-secondary dark:text-color-primary'
  }
]

const wordsVision = [
  {
    text: 'Nuestra'
  },
  {
    text: 'Visión',
    className: 'text-color-primary dark:text-color-secondary'
  }
]

export const AboutUsSection = () => {
  return (
    <section className='font-inter-sans flex flex-col justify-center items-center gap-20'>
      <article className='flex justify-center items-center gap-14 reveal-object'>
        <Image
          src='https://res.cloudinary.com/dje4ke8hw/image/upload/v1718232128/svgs/about-us_ygz45n.svg'
          alt='about us'
          width={200}
          height={200}
          className='hidden lg:flex w-[350px]'
        />
        <div className='flex flex-col justify-center items-center'>
          <TypewriterEffectSmooth words={wordsAboutUs} />
          <p className='text-neutral-700 dark:text-neutral-300 text-center lg:text-left transition-all'>Somos un equipo dedicado de estudiantes y profesionales del Instituto Tolimense de Formación Técnica Profesional (ITFIP) comprometidos con la mejora de la experiencia universitaria. Nuestra plataforma, LunchFip, nace de la necesidad de optimizar el proceso de reservas y entrega de almuerzos, brindando una solución eficiente y segura que ahorra tiempo y reduce errores.</p>
        </div>
      </article>
      <article className='flex justify-center items-center gap-14 reveal-object'>
        <div className='flex flex-col justify-center items-center'>
          <TypewriterEffectSmooth words={wordsMision} />
          <p className='text-neutral-700 dark:text-neutral-300 text-center lg:text-left transition-all'>Nuestra misión es transformar la gestión de almuerzos en el ITFIP a través de la innovación tecnológica. Nos esforzamos por proporcionar una plataforma accesible y confiable que facilite las reservas diarias de almuerzos, garantizando un proceso rápido, preciso y sin complicaciones para todos los estudiantes y el personal encargado.</p>
        </div>
        <Image
          src='https://res.cloudinary.com/dje4ke8hw/image/upload/v1718233963/svgs/mision_igi4w1.svg'
          alt='mision'
          width={200}
          height={200}
          className='hidden lg:flex w-96'
        />
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
          <TypewriterEffectSmooth words={wordsVision} />
          <p className='text-neutral-700 dark:text-neutral-300 text-center lg:text-left transition-all'>Nuestra visión es ser el modelo de referencia en la gestión de servicios estudiantiles mediante soluciones tecnológicas avanzadas. Aspiramos a expandir nuestras soluciones a otras áreas y universidades, promoviendo una cultura de eficiencia, seguridad y satisfacción en la comunidad educativa.</p>
        </div>
      </article>
    </section>
  )
}
