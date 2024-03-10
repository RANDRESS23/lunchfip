'use client'

import { useEstudiante } from '@/hooks/useEstudiante'
import Image from 'next/image'
import { Skeleton } from '@nextui-org/react'

export const StudentInfo = () => {
  const { estudiante } = useEstudiante()

  return (
    <div className='flex flex-col items-center gap-10 h-full'>
      <section className='flex flex-col items-center text-center gap-3'>
        {
          estudiante.imageUrl !== ''
            ? (
                <>
                  <div className='animate-color-cycle-5 rounded-full'>
                    <Image
                      src={estudiante.imageUrl}
                      alt={estudiante.primer_nombre}
                      width={150}
                      height={150}
                      className={'rounded-full p-1'}
                      priority
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
                </>
              )
            : (
                <>
                  <Skeleton className="flex rounded-full w-[150px] h-[150px]"/>
                  <div className='w-full flex flex-col justify-center items-center gap-3'>
                    <Skeleton className="h-5 w-full rounded-lg"/>
                    <Skeleton className="h-5 w-4/5 rounded-lg"/>
                  </div>
                </>
              )
        }
      </section>
      <section className='flex flex-col items-center h-full text-center justify-center gap-5'>
        <h2 className='text-xl font-bold tracking-tighter'>
          Códgio QR Personal
        </h2>
        <div className='w-[130%] flex justify-center items-center'>
          {
            estudiante.codigoUrl !== ''
              ? (
                  <div className='animate-color-cycle-5 w-full'>
                    <Image
                      src={estudiante.codigoUrl}
                      alt={estudiante.primer_apellido}
                      width={1000}
                      height={1000}
                      className='p-1 h-full w-full'
                    />
                  </div>
                )
              : (
                  <Skeleton className="flex w-[230px] h-[230px]"/>
                )
          }
        </div>
      </section>
    </div>
  )
}
