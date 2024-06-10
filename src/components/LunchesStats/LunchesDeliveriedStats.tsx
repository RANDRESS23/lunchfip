'use client'

import { useAlmuerzosReservados } from '@/hooks/useAlmuerzosReservados'
import { StatCard } from '@/app/profile/student/info/_components/StatCard'
import { useAlmuerzosTotales } from '@/hooks/useAlmuerzosTotales'
import { useAlmuerzosEntregados } from '@/hooks/useAlmuerzosEntregados'
import { useAlmuerzosFecha } from '@/hooks/useAlmuerzosFecha'
import { format } from '@formkit/tempo'

export const LunchesDeliveriedStats = () => {
  const { almuerzosFecha, loadingAlmuerzosFecha } = useAlmuerzosFecha()
  const { almuerzosTotales, loadingAlmuerzosTotales } = useAlmuerzosTotales({ nextDate: almuerzosFecha.fecha.toString() })
  const { almuerzosReservados, loadingAlmuerzosReservados } = useAlmuerzosReservados({ nextDate: almuerzosFecha.fecha.toString() })
  const { almuerzosEntregados, loadingAlmuerzosEntregados } = useAlmuerzosEntregados({ nextDate: almuerzosFecha.fecha.toString() })

  const fechaParsed = (fechaUltimo: Date) => {
    const dateAux = new Date(fechaUltimo)

    return format(dateAux, 'h:mm A')
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
        almuerzosTotales.id_almuerzo !== ''
          ? (
              <div className='grid grid-cols-2 place-items-center gap-7'>
                <StatCard
                  label="Cantidad Total de Almuerzos"
                  value={almuerzosTotales.total_almuerzos}
                  loading={loadingAlmuerzosTotales || loadingAlmuerzosFecha}
                />
                <StatCard
                  label="Hora de Última Entrega"
                  value={fechaParsed(almuerzosEntregados.updatedAt)}
                  loading={loadingAlmuerzosEntregados || loadingAlmuerzosFecha}
                />
                <StatCard
                  label="Cantidad de Almuerzos Reservados"
                  value={almuerzosReservados.cantidad}
                  loading={loadingAlmuerzosReservados || loadingAlmuerzosFecha}
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
                <p className='w-full italic text-center text-color-secondary'>⚠ ¡No hay datos para mostrar debido a que el administrador no ha definido la cantidad de almuerzos para el dia {getNextFullDate()}.!. ⚠</p>
              </div>
            )
      }
    </section>
  )
}
