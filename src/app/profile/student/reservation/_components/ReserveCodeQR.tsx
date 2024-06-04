import { Skeleton } from '@nextui-org/react'
import Image from 'next/image'

interface ReserveCodeQRProps {
  primerNombre: string
  primerApellido: string
  codigoQRReserva: string
}

export const ReserveCodeQR = ({ primerNombre, primerApellido, codigoQRReserva }: ReserveCodeQRProps) => {
  return (
    <section className='flex flex-col items-center justify-center gap-7 font-inter-sans'>
      <p className='w-full z-10 mt-14 italic text-center text-color-primary'>✔ ¡Reservaste, puedes visualizar tu código QR de reserva a continuación, presenta este código QR al personal encargado para reclamar tu almuerzo!. ✔</p>
      <div className='w-full flex justify-center items-center'>
        {
          codigoQRReserva !== ''
            ? (
                <section className='w-full md:w-72 relative flex justify-center items-center overflow-hidden z-10'>
                  <Image
                    src={codigoQRReserva}
                    alt={`${primerNombre} ${primerApellido}`}
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
