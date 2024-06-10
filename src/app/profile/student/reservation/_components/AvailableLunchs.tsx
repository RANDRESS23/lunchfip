import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { cn } from '@/libs/utils'

interface AvailableLunchsProps {
  amounthLunch: number | string
  nextFullDate?: string
  isAvailableReserve: boolean
}

export const AvailableLunchs = ({ amounthLunch, nextFullDate, isAvailableReserve }: AvailableLunchsProps) => {
  return (
    <CardContainer className="inter-var">
      <CardBody className={cn(
        'bg-gray-50 relative group/card dark:hover:shadow-[-10px_-10px_30px_4px_rgba(0,170,255,0.15),_10px_10px_30px_4px_rgba(255,51,102,0.15)] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[20rem] h-auto rounded-xl p-6 border transition-all bg-grid-black dark:bg-grid-white',
        !isAvailableReserve && 'opacity-50 pointer-events-none'
      )}>
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_0.5%,black)] rounded-xl" />
        <CardItem
          translateZ="50"
          className="w-full text-2xl text-center font-bold text-neutral-600 dark:text-white"
        >
          CANTIDAD RESTANTE
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-center text-sm w-full mt-2 text-p-light dark:text-p-dark"
        >
          Cantidad actual de los almuerzos restantes para el {nextFullDate}
        </CardItem>
        <CardItem
          translateZ="50"
          className="w-full text-5xl text-center font-bold text-neutral-600 dark:text-white my-11"
        >
          {amounthLunch}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-center text-sm w-full mt-2 text-p-light dark:text-p-dark"
        >
          {amounthLunch === 'N/A' && 'Servicio de reservas de almuerzo finalizado, espera a las 05:00 p.m. para reservar tu almuerzo del día siguiente.'}
        </CardItem>
      </CardBody>
    </CardContainer>
  )
}
