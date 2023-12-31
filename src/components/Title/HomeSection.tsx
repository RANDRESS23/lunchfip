'use client'

import { SubTitle } from '@/components/Title/SubTitle'
import { Title } from '@/components/Title'

export const HomeSection = () => {
  return (
    <section className='h-screen flex flex-col justify-center items-center py-20 gap-9'>
      <h1 className='flex flex-col justify-center items-center flex-wrap text-6xl lg:text-[90px] font-extrabold tracking-tighter'>
        <Title title='Reserva.' numberBgGradient="1" />
        <Title title='Escanea.' numberBgGradient="2" />
        <Title title='Disfruta.' numberBgGradient="3" />
      </h1>
      <SubTitle
        description='Optimiza tu almuerzo: Reserva fácilmente, evita largas filas y disfruta de los almuerzos sin complicaciones con nuestro sistema de gestión de almuerzos basado en códigos QR.'
      />
    </section>
  )
}
