import Image from 'next/image'
import Link from 'next/link'

export default function NotFound () {
  return (
    <section className='flex flex-col justify-center items-center h-screen pt-16 gap-5 w-full px-10'>
      <Image
        src='/svgs/logo-lunchfip-dark.svg'
        alt='logo lunchfip'
        width={130}
        height={130}
        className='hidden dark:flex w-56'
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
      <Link href='/' className="w-full md:w-72 text-center py-3 mt-3 animate-shimmer items-center justify-center rounded-xl border border-black dark:border-white bg-[linear-gradient(110deg,#f2f3f3,45%,#aaaeb4,55%,#f2f3f3)] dark:bg-[linear-gradient(110deg,#000103,45%,#637494,55%,#000103)] bg-[length:200%_100%] px-10 font-medium text-black dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 hover:px-14 disabled:opacity-50 disabled:cursor-not-allowed">
        Ir a Inicio
      </Link>
    </section>
  )
}
