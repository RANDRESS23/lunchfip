import { useEstudiante } from '@/hooks/useEstudiante'
import { Skeleton } from '@nextui-org/react'
import Image from 'next/image'

export const CodigoQR = () => {
  const { estudiante } = useEstudiante()
  return (
    <section className='flex flex-col items-center h-full text-center justify-center gap-5'>
      <h2 className='text-xl font-bold tracking-tighter'>
        Códgio QR Personal
      </h2>
      <div className='flex justify-center items-center'>
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
  )
}
