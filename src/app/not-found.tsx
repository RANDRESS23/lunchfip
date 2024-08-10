import Image from 'next/image'

export default function NotFound () {
  return (
    <section className='flex justify-center items-center h-screen pt-24'>
      <Image
        src='/svgs/logo-lunchfip-dark.svg'
        alt='logo lunchfip'
        width={130}
        height={130}
        className='hidden dark:flex w-32'
      />
      <Image
        src='/svgs/logo-lunchfip-light.svg'
        alt='logo lunchfip'
        width={130}
        height={130}
        className='flex dark:hidden w-32'
      />
    </section>
  )
}
