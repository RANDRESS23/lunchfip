'use client'

import { TableLunches } from './TableLunches'
import { useAlmuerzosReservados } from '@/hooks/useAlmuerzosReservados'
import { useAlmuerzosEntregados } from '@/hooks/useAlmuerzosEntregados'
import { Card, Skeleton } from '@nextui-org/react'

interface TablesDefineLunchesProps {
  nextDate: Date
  nextFullDate: string
}

export const TablesDefineLunches = ({ nextDate, nextFullDate }: TablesDefineLunchesProps) => {
  const { almuerzosReservados, loadingAlmuerzosReservados } = useAlmuerzosReservados({ nextDate: nextDate.toString() })
  const { almuerzosEntregados, loadingAlmuerzosEntregados } = useAlmuerzosEntregados({ nextDate: nextDate.toString() })

  return (
    <section className='flex flex-col justify-center gap-10 w-full'>
      {
        !loadingAlmuerzosEntregados && !loadingAlmuerzosReservados
          ? almuerzosReservados.id_almuerzo !== '' && almuerzosEntregados.id_almuerzo !== ''
            ? (
                <>
                  <TableLunches
                    title='Reservas'
                    fechaUltimo={almuerzosReservados.updatedAt}
                    cantidad={almuerzosReservados.cantidad}
                  />
                  <TableLunches
                    title='Entregas'
                    fechaUltimo={almuerzosEntregados.updatedAt}
                    cantidad={almuerzosEntregados.cantidad}
                  />
                </>
              )
            : (
                <div className='flex justify-center items-center z-10 mt-32'>
                  <span className='text-p-light dark:text-p-dark text-center'>No hay datos para mostrar debido a que no se ha definido la cantidad de almuerzos para el dia {nextFullDate}.</span>
                </div>
              )
          : (
            <div className='flex flex-col gap-10 py-10'>
              <Card className="w-full space-y-3 p-4" radius="lg">
                <div className="space-y-3">
                  <Skeleton className="w-full rounded-lg">
                    <div className="h-5 w-full rounded-lg bg-default-200"></div>
                  </Skeleton>
                </div>
                <Skeleton className="rounded-lg">
                  <div className="h-24 rounded-lg bg-default-300"></div>
                </Skeleton>
              </Card>
              <Card className="w-full space-y-3 p-4" radius="lg">
                <div className="space-y-3">
                  <Skeleton className="w-full rounded-lg">
                    <div className="h-5 w-full rounded-lg bg-default-200"></div>
                  </Skeleton>
                </div>
                <Skeleton className="rounded-lg">
                  <div className="h-24 rounded-lg bg-default-300"></div>
                </Skeleton>
              </Card>
            </div>
            )
      }
    </section>
  )
}
