import { useEstudiante } from '@/hooks/useEstudiante'
import { Skeleton } from '@nextui-org/react'
import Image from 'next/image'

export const CodigoQR = () => {
  const { estudiante } = useEstudiante()
  return (
    <section className='flex flex-col items-center justify-center gap-7 font-inter-sans'>
      <p className='w-full text-sm z-10 -mt-2 text-center italic text-p-light dark:text-p-dark'>Aqui encontrarás tu códgio QR Personal, con el cual podrás presentarselo al personal encargado para que sea más fácil y eficiente tus reservas, como también tus recargas a la plataforma.</p>
      <div className='flex justify-center items-center'>
        {
          estudiante.codigoUrl !== ''
            ? (
                <section className='w-full relative flex justify-center items-center overflow-hidden z-10'>
                  <Image
                    src={estudiante.codigoUrl}
                    alt={`${estudiante.primer_nombre} ${estudiante.primer_apellido}`}
                    width={1000}
                    height={1000}
                    className='w-full h-full p-[4px]'
                    priority
                  />
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00aaff_0%,#ff3366_50%,#00aaff_100%)] -z-10" />
                </section>
              )
            : (
                <Skeleton className="flex w-[230px] h-[230px]"/>
              )
        }
      </div>
    </section>
  )
}
