'use client'

import { useAlmuerzosReservados } from '@/hooks/useAlmuerzosReservados'
import { StatCard } from '@/app/profile/student/info/_components/StatCard'
import { useAlmuerzosTotales } from '@/hooks/useAlmuerzosTotales'
import { cn } from '@/libs/utils'
import { useAlmuerzosFecha } from '@/hooks/useAlmuerzosFecha'
import { format } from '@formkit/tempo'

interface LunchesReservedStatsProps {
  isFlex?: boolean
}

export const LunchesReservedStats = ({ isFlex }: LunchesReservedStatsProps) => {
  const { almuerzosFecha, loadingAlmuerzosFecha } = useAlmuerzosFecha()
  const { almuerzosTotales, loadingAlmuerzosTotales } = useAlmuerzosTotales({ nextDate: almuerzosFecha.fecha.toString() })
  const { almuerzosReservados, loadingAlmuerzosReservados } = useAlmuerzosReservados({ nextDate: almuerzosFecha.fecha.toString() })

  const horaParsed = (fechaUltimo: Date) => {
    const dateAux = new Date(fechaUltimo.toString())
    dateAux.setUTCHours(dateAux.getUTCHours() + 5)
    const fecha = new Date(dateAux.toString())

    return format(fecha, 'h:mm A')
  }

  const getNextFullDate = () => {
    if (almuerzosFecha.id_almuerzos_fecha !== '') {
      const fechaAux = new Date(almuerzosFecha.fecha?.toString() ?? new Date().toString())
      const fechaAux2 = new Date(fechaAux.setDate(fechaAux.getDate() + 1))
      return format(fechaAux2, 'full')
    }
  }

  return (
    <section className='flex flex-col items-center justify-center gap-10 w-full'>
      {
        almuerzosTotales.id_almuerzo !== '' && almuerzosFecha.id_almuerzos_fecha !== ''
          ? (
              <div className={cn(
                isFlex ? 'flex flex-wrap justify-center items-center gap-7' : 'grid grid-cols-2 place-items-center gap-7'
              )}>
                <StatCard
                  label="Cantidad Total de Almuerzos"
                  value={almuerzosTotales.total_almuerzos}
                  loading={loadingAlmuerzosTotales || loadingAlmuerzosFecha}
                />
                <StatCard
                  label="Hora de Última Reserva"
                  value={horaParsed(almuerzosReservados.updatedAt)}
                  loading={loadingAlmuerzosReservados || loadingAlmuerzosFecha}
                />
                <StatCard
                  label="Cantidad de Almuerzos Reservados"
                  value={almuerzosReservados.cantidad}
                  loading={loadingAlmuerzosReservados || loadingAlmuerzosFecha}
                />
                <StatCard
                  label="Cantidad de Almuerzos Restantes"
                  value={almuerzosTotales.total_almuerzos - almuerzosReservados.cantidad}
                  loading={loadingAlmuerzosTotales || loadingAlmuerzosReservados || loadingAlmuerzosFecha}
                />
              </div>
            )
          : (
              <div className='relative w-full z-10 mt-32'>
                <p className='w-full italic text-center text-color-secondary'>⚠ ¡No hay datos para mostrar debido a que el administrador no ha definido la cantidad de almuerzos para el dia {getNextFullDate()}.!. ⚠</p>
              </div>
            )
      }
    </section>
  )
}
