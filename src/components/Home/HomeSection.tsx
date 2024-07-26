'use client'

import { SubTitle } from '@/components/Home/SubTitle'
import { Title } from '@/components/Home'
import { Spotlight } from '../ui/Spotlight'
import { Link } from 'next-view-transitions'

/* ➡ Componente principal que renderiza la landing principal del aplicativo */
export const HomeSection = () => {
  return (
    <section className='h-screen relative bg-grid-black dark:bg-grid-white flex flex-col justify-center items-center py-20 font-inter-sans'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_0.5%,black)]" />
      <Spotlight
        className="-top-10 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <h1 className='relative flex flex-col justify-center items-center flex-wrap leading-none text-[65px] md:text-[90px] font-extrabold tracking-tighter mt-5 md:mb-7'>
        <Title />
        <div className='absolute w-[110%] h-[600px] md:w-[650px] md:h-[650px] bg-gradient-to-r from-color-primary to-color-secondary rounded-full blur-[75px] opacity-15 dark:opacity-25 mt-40 lg:mt-0' />
      </h1>
      <SubTitle />
      <div className='w-full md:w-auto flex flex-col md:flex-row justify-center items-center gap-5 mt-7'>
        <Link href='/sign-up' className="w-full md:w-auto text-center py-3 animate-shimmer items-center justify-center rounded-xl border border-black dark:border-white bg-[linear-gradient(110deg,#000103,45%,#637494,55%,#000103)] bg-[length:200%_100%] px-16 font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
          Registrarse
        </Link>
        <Link href='/sign-in' className="w-full md:w-auto text-center py-3 animate-shimmer items-center justify-center rounded-xl border border-black dark:border-white bg-[linear-gradient(110deg,#000103,45%,#637494,55%,#000103)] bg-[length:200%_100%] px-16 font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
          Iniciar Sesión
        </Link>
      </div>
    </section>
  )
}
