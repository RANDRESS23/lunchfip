import Image from 'next/image'
import { FormDefineDateLunches } from './FormDefineDateLunches'

export const DefineDateLunches = () => {
  return (
    <section className='w-full z-10 flex flex-col lg:flex-row justify-center items-center gap-10 pb-10'>
      <div className='w-full hidden lg:flex'>
        <Image
          src='https://res.cloudinary.com/dje4ke8hw/image/upload/v1717963307/svgs/calendar-gif-dark_q2eqcu.gif'
          alt='logo lunchfip'
          width={200}
          height={200}
          className='hidden dark:flex w-80'
        />
        <Image
          src='https://res.cloudinary.com/dje4ke8hw/image/upload/v1717963151/svgs/calendar-gif-light_fmvvau.gif'
          alt='logo lunchfip'
          width={200}
          height={200}
          className='flex dark:hidden w-80'
        />
      </div>
      <FormDefineDateLunches />
      <div className='w-full flex lg:hidden'>
        <Image
          src='https://res.cloudinary.com/dje4ke8hw/image/upload/v1717963307/svgs/calendar-gif-dark_q2eqcu.gif'
          alt='logo lunchfip'
          width={200}
          height={200}
          className='hidden dark:flex w-80'
        />
        <Image
          src='https://res.cloudinary.com/dje4ke8hw/image/upload/v1717963151/svgs/calendar-gif-light_fmvvau.gif'
          alt='logo lunchfip'
          width={200}
          height={200}
          className='flex dark:hidden w-80'
        />
      </div>
    </section>
  )
}
