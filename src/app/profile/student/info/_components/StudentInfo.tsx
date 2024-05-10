'use client'

import { useEstudiante } from '@/hooks/useEstudiante'
import Image from 'next/image'
import { Skeleton } from '@nextui-org/react'
import { TitleAnimated } from '@/components/TitleAnimated'

export const StudentInfo = () => {
  const { estudiante } = useEstudiante()

  return (
    <div className='flex flex-col items-center gap-10 h-full font-inter-sans mt-10'>
      <section className='flex flex-col items-center text-center gap-3'>
        {
          estudiante.imageUrl !== ''
            ? (
                <>
                  <section className='w-40 relative flex justify-center items-center overflow-hidden rounded-full z-10'>
                    <Image
                      src={estudiante.imageUrl}
                      alt={estudiante.primer_nombre}
                      width={1000}
                      height={1000}
                      className='w-full h-full rounded-full p-[4px]'
                      priority
                    />
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00aaff_0%,#ff3366_50%,#00aaff_100%)] -z-10" />
                  </section>
                  <section>
                    <div className='-ml-1'>
                      <TitleAnimated
                        text1=''
                        text2={`${estudiante.primer_nombre} ${estudiante.primer_apellido}`}
                        textSize='text-3xl'
                        isTextLeft
                      />
                    </div>
                    <p className='font-semibold tracking-tighter italic -mt-5'>
                      {estudiante.numero_documento} {estudiante.tipo_documento === 'Cédula de Ciudadanía' ? 'C.C' : 'T.I'}
                    </p>
                  </section>
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
    </div>
  )
}
