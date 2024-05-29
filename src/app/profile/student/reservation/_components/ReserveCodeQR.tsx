import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { cn } from '@/libs/utils'
import Image from 'next/image'

interface ReserveCodeQRProps {
  primerNombre: string
  primerApellido: string
  codigoQRReserva: string
  isAvailableReserve: boolean
}

export const ReserveCodeQR = ({ primerNombre, primerApellido, codigoQRReserva, isAvailableReserve }: ReserveCodeQRProps) => {
  return (
    <CardContainer className="inter-var">
      <CardBody className={cn(
        'bg-gray-50 relative group/card dark:hover:shadow-[-10px_-10px_30px_4px_rgba(0,170,255,0.15),_10px_10px_30px_4px_rgba(255,51,102,0.15)] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[20rem] h-auto -mt-10 rounded-xl p-6 border transition-all bg-grid-black dark:bg-grid-white',
        !isAvailableReserve && 'opacity-50 pointer-events-none'
      )}>
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_0.5%,black)] rounded-xl" />
        <CardItem className='w-full relative flex justify-center items-center overflow-hidden z-10'>
          <Image
            src={codigoQRReserva}
            alt={`${primerNombre} ${primerApellido}`}
            width={1000}
            height={1000}
            className='w-full h-full p-[4px]'
            priority
          />
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00aaff_0%,#ff3366_50%,#00aaff_100%)] -z-10" />
        </CardItem>
      </CardBody>
    </CardContainer>
  )
}
