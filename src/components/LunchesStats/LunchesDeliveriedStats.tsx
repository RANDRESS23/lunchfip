'use client'

import { useAlmuerzosReservados } from '@/hooks/useAlmuerzosReservados'
import { StatCard } from '@/app/profile/student/info/_components/StatCard'
import { useAlmuerzosTotales } from '@/hooks/useAlmuerzosTotales'
import { useAlmuerzosEntregados } from '@/hooks/useAlmuerzosEntregados'

interface LunchesDeliveriedStatsProps {
  nextDate: Date
  nextFullDate: string
}

export const LunchesDeliveriedStats = ({ nextDate, nextFullDate }: LunchesDeliveriedStatsProps) => {
  const { almuerzosTotales, loadingAlmuerzosTotales } = useAlmuerzosTotales({ nextDate: nextDate.toString() })
  const { almuerzosReservados, loadingAlmuerzosReservados } = useAlmuerzosReservados({ nextDate: nextDate.toString() })
  const { almuerzosEntregados, loadingAlmuerzosEntregados } = useAlmuerzosEntregados({ nextDate: nextDate.toString() })

  const fechaParsed = (fechaUltimo: Date) => {
    const dateAux = new Date(fechaUltimo)

    dateAux.setUTCHours(dateAux.getUTCHours() + 5)

    const timeFormated = dateAux.toLocaleString('es-ES', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })

    return timeFormated
  }

  return (
    <section className='flex flex-col items-center justify-center gap-10 w-full'>
      {
        almuerzosTotales.id_almuerzo !== ''
          ? (
              <div className='grid grid-cols-2 place-items-center gap-7'>
                <StatCard
                  label="Cantidad Total de Almuerzos"
                  value={almuerzosTotales.total_almuerzos}
                  loading={loadingAlmuerzosTotales}
                />
                <StatCard
                  label="Hora de Última Entrega"
                  value={fechaParsed(almuerzosEntregados.updatedAt)}
                  loading={loadingAlmuerzosEntregados}
                />
                <StatCard
                  label="Cantidad de Almuerzos Reservados"
                  value={almuerzosReservados.cantidad}
                  loading={loadingAlmuerzosReservados}
                />
                <StatCard
                  label="Cantidad de Almuerzos Restantes para Entregar"
                  value={almuerzosReservados.cantidad - almuerzosEntregados.cantidad}
                  loading={loadingAlmuerzosReservados || loadingAlmuerzosEntregados}
                />
              </div>
            )
          : (
              <div className='relative w-full z-10 mt-32'>
                <p className='w-full italic text-center text-color-secondary'>⚠ ¡No hay datos para mostrar debido a que el administrador no ha definido la cantidad de almuerzos para el dia {nextFullDate}.!. ⚠</p>
              </div>
            )
      }
    </section>
  )
}
