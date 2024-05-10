import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { Button } from '@/components/Button'
import { cn } from '@/libs/utils'

interface BalanceCardProps {
  nextFullDate: string
  saldoParsed: string
  loadingReservation: boolean
  isAvailableReserve: boolean
  saveReservation: () => void
}

export function BalanceCard ({ nextFullDate, saldoParsed, loadingReservation, isAvailableReserve, saveReservation }: BalanceCardProps) {
  return (
    <CardContainer className="inter-var -mt-32 md:-mt-0">
      <CardBody className={cn(
        'bg-gray-50 relative group/card dark:hover:shadow-[-10px_-10px_30px_4px_rgba(0,170,255,0.15),_10px_10px_30px_4px_rgba(255,51,102,0.15)] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border transition-all bg-grid-black dark:bg-grid-white',
        !isAvailableReserve && 'opacity-50 pointer-events-none'
      )}>
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_0.5%,black)] rounded-xl" />
        <CardItem
          translateZ="50"
          className="w-full text-3xl text-center font-bold text-neutral-600 dark:text-white"
        >
          MI SALDO
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-center w-full mt-2 text-p-light dark:text-p-dark"
        >
          Saldo disponible para reservar almuerzo el {nextFullDate}
        </CardItem>
        <CardItem
          translateZ="50"
          className="w-full text-4xl text-center font-bold text-neutral-600 dark:text-white my-11"
        >
          {saldoParsed}
        </CardItem>
        <CardItem
          translateZ="50"
          className="w-full mx-auto"
        >
          <Button
            type="button"
            text={loadingReservation ? 'Cargando...' : 'Reservar Almuerzo'}
            disabled={loadingReservation}
            onClick={saveReservation}
          />
        </CardItem>
      </CardBody>
    </CardContainer>
  )
}
