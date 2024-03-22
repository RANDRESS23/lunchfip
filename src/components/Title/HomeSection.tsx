'use client'

import { SubTitle } from '@/components/Title/SubTitle'
import { Title } from '@/components/Title'
import { Spotlight } from '../ui/Spotlight'

export const HomeSection = () => {
  return (
    <section className='h-screen relative bg-grid-black dark:bg-grid-white flex flex-col justify-center items-center py-20 gap-11'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_0.5%,black)]" />
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <h1 className='relative flex flex-col justify-center items-center flex-wrap text-6xl lg:text-[90px] font-extrabold tracking-tighter'>
        <Title />
        <div className='absolute w-[650px] h-[650px] bg-gradient-to-r from-color-primary to-color-secondary rounded-full blur-[75px] opacity-25' />
      </h1>
      <SubTitle />
    </section>
  )
}
