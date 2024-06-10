import Image from 'next/image'
import { FormDefineLunches } from './FormDefineLunches'

export const DefineLunches = () => {
  return (
    <section className='w-full z-10 flex justify-center items-center gap-5'>
      <FormDefineLunches />
      <Image
        src='https://res.cloudinary.com/dje4ke8hw/image/upload/v1716165613/svgs/define-lunches-gif-dark_sxoiim.gif'
        alt='logo lunchfip'
        width={200}
        height={200}
        className='hidden dark:flex w-80'
      />
      <Image
        src='https://res.cloudinary.com/dje4ke8hw/image/upload/v1716165604/svgs/define-lunches-gif-light_y99ezw.gif'
        alt='logo lunchfip'
        width={200}
        height={200}
        className='flex dark:hidden w-80'
      />
    </section>
  )
}
