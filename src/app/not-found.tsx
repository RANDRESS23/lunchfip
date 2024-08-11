import Image from 'next/image'

export default function NotFound () {
  return (
    <section className='flex flex-col justify-center items-center h-screen pt-20 gap-5'>
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
      <div className='flex justify-center items-center'>
        <p className='text-center text-2xl dark:text-white'>
          <span className='font-bold'>404</span> | Página no encontrada
        </p>
      </div>
    </section>
  )
}
