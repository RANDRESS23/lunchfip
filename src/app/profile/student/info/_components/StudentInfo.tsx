'use client'

import { useEstudiante } from '@/hooks/useEstudiante'
import Image from 'next/image'

export const StudentInfo = () => {
  const { estudiante } = useEstudiante()

  console.log({ estudiante })

  return (
    <div className='flex flex-col items-center gap-10 h-full'>
      <section className='flex flex-col items-center text-center gap-3'>
        <div className='animate-color-cycle-5 rounded-full'>
          <Image
            src={estudiante.imageUrl}
            alt={estudiante.primer_nombre}
            width={150}
            height={150}
            className='rounded-full p-1'
          />
        </div>
        <div>
          <h2 className='text-2xl font-extrabold tracking-tighter relative bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] animate-color-cycle-5'>
            {estudiante.primer_nombre} {estudiante.primer_apellido}
          </h2>
          <p className='font-semibold tracking-tighter italic'>
            {estudiante.numero_documento} {estudiante.tipo_documento === 'Cédula de Ciudadanía' ? 'C.C' : 'T.I'}
          </p>
        </div>
      </section>
      <section className='flex flex-col items-center h-full text-center justify-center gap-5'>
        <h2 className='text-xl font-bold tracking-tighter'>
          Códgio QR Personal
        </h2>
        <div className='animate-color-cycle-5 w-[130%]'>
          <Image
            src={estudiante.codigoUrl}
            alt={estudiante.primer_apellido}
            width={1000}
            height={1000}
            className='p-1 h-full w-full'
          />
        </div>
      </section>
    </div>
  )
}
