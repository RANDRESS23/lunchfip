'use client'

import { TableLunches } from './TableLunches'
import { useAlmuerzosReservados } from '@/hooks/useAlmuerzosReservados'
import { useAlmuerzosEntregados } from '@/hooks/useAlmuerzosEntregados'

interface TablesDefineLunchesProps {
  nextDate: Date
}

export const TablesDefineLunches = ({ nextDate }: TablesDefineLunchesProps) => {
  const { almuerzosReservados, loadingAlmuerzosReservados } = useAlmuerzosReservados({ nextDate: nextDate.toString() })
  const { almuerzosEntregados, loadingAlmuerzosEntregados } = useAlmuerzosEntregados({ nextDate: nextDate.toString() })

  return (
    <section className='flex flex-col justify-center gap-10'>
      {
        !loadingAlmuerzosEntregados && !loadingAlmuerzosReservados
          ? almuerzosReservados.id_almuerzo !== '' && almuerzosEntregados.id_almuerzo !== ''
            ? (
                <>
                  <TableLunches
                    title='Estadística - Reservas'
                    fechaUltimo={almuerzosReservados.updatedAt}
                    cantidad={almuerzosReservados.cantidad}
                  />
                  <TableLunches
                    title='Estadística - Entregas'
                    fechaUltimo={almuerzosEntregados.updatedAt}
                    cantidad={almuerzosEntregados.cantidad}
                  />
                </>
              )
            : (
                <div className='text-center text-2xl text-gray-600'>
                  No hay datos para mostrar
                </div>
              )
          : (
              <div>loading...</div>
            )
      }
    </section>
  )
}
