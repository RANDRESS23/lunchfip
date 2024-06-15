'use client'

import { useAlmuerzosEstadisticas } from '@/hooks/useAlmuerzosEstadisticas'
import { DashBoardCard } from './DashBoardCard'
import { DateRangePicker, Skeleton } from '@nextui-org/react'
import { useState } from 'react'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { type RangeValue } from '@react-types/shared'
import { type DateValue } from '@react-types/datepicker'
import { I18nProvider } from '@react-aria/i18n'
import { TabCharts } from './TabCharts'
import { ImListNumbered } from 'react-icons/im'

export const DashBoardSection = () => {
  const [fecha, setFecha] = useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()).subtract({ days: 7 }),
    end: today(getLocalTimeZone())
  })
  const { almuerzosEstadisticas, loadingAlmuerzosEstadisticas } = useAlmuerzosEstadisticas({ fechaInicio: fecha.start.toString(), fechaFin: fecha.end.toString() })

  return (
    <section className='w-full flex items-center lg:items-start flex-col'>
      <I18nProvider locale="co-CO">
        <DateRangePicker
          label="Rango de Fecha"
          value={fecha}
          variant='bordered'
          minValue={parseDate('2024-03-13')}
          maxValue={parseDate('2024-06-22')}
          onChange={setFecha}
          className='w-full'
          classNames={{
            inputWrapper: 'border border-black hover:border-neutral-600 dark:hover:border-neutral-400 dark:border-white transition transition-all duration-500'
          }}
          granularity="day"
          isDisabled={loadingAlmuerzosEstadisticas}
        />
      </I18nProvider>
      <section className='w-full flex flex-col justify-center items-center gap-10 my-7'>
        {
          loadingAlmuerzosEstadisticas
            ? (
                <>
                  <div className='w-full flex flex-col lg:flex-row gap-5 h-96'>
                    <div className='w-full h-full lg:w-1/3'>
                      <Skeleton className="flex w-full h-full rounded-lg"/>
                    </div>
                    <div className='w-full h-full lg:w-4/6'>
                      <Skeleton className="flex w-full h-full rounded-lg"/>
                    </div>
                  </div>
                  <div className='w-full flex flex-col lg:flex-row gap-5 h-96'>
                    <div className='hidden lg:flex w-full lg:w-4/6'>
                      <Skeleton className="flex w-full h-full rounded-lg"/>
                    </div>
                    <div className='w-full h-full lg:w-1/3'>
                      <Skeleton className="flex w-full h-full rounded-lg"/>
                    </div>
                    <div className='flex lg:hidden w-full lg:w-4/6'>
                      <Skeleton className="flex w-full h-full rounded-lg"/>
                    </div>
                  </div>
                  <div className='w-full flex flex-col lg:flex-row gap-5 h-96'>
                    <div className='w-full h-full lg:w-1/3'>
                      <Skeleton className="flex w-full h-full rounded-lg"/>
                    </div>
                    <div className='w-full h-full lg:w-4/6'>
                      <Skeleton className="flex w-full h-full rounded-lg"/>
                    </div>
                  </div>
                  <div className='w-full flex flex-col lg:flex-row gap-5 h-96'>
                    <div className='hidden lg:flex w-full lg:w-4/6'>
                      <Skeleton className="flex w-full h-full rounded-lg"/>
                    </div>
                    <div className='w-full h-full lg:w-1/3'>
                      <Skeleton className="flex w-full h-full rounded-lg"/>
                    </div>
                    <div className='flex lg:hidden w-full lg:w-4/6'>
                      <Skeleton className="flex w-full h-full rounded-lg"/>
                    </div>
                  </div>
                  <div className='w-full flex flex-col lg:flex-row gap-5 h-96'>
                    <div className='w-full h-full lg:w-1/3'>
                      <Skeleton className="flex w-full h-full rounded-lg"/>
                    </div>
                    <div className='w-full h-full lg:w-4/6'>
                      <Skeleton className="flex w-full h-full rounded-lg"/>
                    </div>
                  </div>
                  <div className='w-full flex flex-col lg:flex-row gap-5 h-96'>
                    <div className='hidden lg:flex w-full lg:w-4/6'>
                      <Skeleton className="flex w-full h-full rounded-lg"/>
                    </div>
                    <div className='w-full h-full lg:w-1/3'>
                      <Skeleton className="flex w-full h-full rounded-lg"/>
                    </div>
                    <div className='flex lg:hidden w-full lg:w-4/6'>
                      <Skeleton className="flex w-full h-full rounded-lg"/>
                    </div>
                  </div>
                  <div className='w-full flex flex-col lg:flex-row gap-5 h-96'>
                    <div className='w-full h-full lg:w-1/3'>
                      <Skeleton className="flex w-full h-full rounded-lg"/>
                    </div>
                    <div className='w-full h-full lg:w-4/6'>
                      <Skeleton className="flex w-full h-full rounded-lg"/>
                    </div>
                  </div>
                </>
              )
            : (
                <>
                  <div className='w-full flex flex-col lg:flex-row gap-5 h-[600px] lg:h-96'>
                    <div className='w-full lg:w-1/3'>
                      <DashBoardCard
                        label='Almuerzos Definidos'
                        amount={almuerzosEstadisticas.totalAlmuerzosDefinidos}
                        description={`Cantidad de almuerzos definidos del ${almuerzosEstadisticas.fechaInicio} al ${almuerzosEstadisticas.fechaFin}`}
                        Icon={<ImListNumbered className='text-2xl text-black dark:text-white' />}
                      />
                    </div>
                    <div className='w-full lg:w-4/6'>
                      <TabCharts
                        text1='Almuerzos Definidos'
                        text2='Cantidad de almuerzos definidos el'
                        data={almuerzosEstadisticas.dataTotalAlmuerzosDefinidos}
                      />
                    </div>
                  </div>
                  <div className='w-full flex flex-col lg:flex-row gap-5 h-[600px] lg:h-96'>
                    <div className='hidden lg:block w-full lg:w-4/6'>
                      <TabCharts
                        text1='Total Almuerzos Reservados'
                        text2='Cantidad total de almuerzos reservados el'
                        data={almuerzosEstadisticas.dataTotalAlmuerzosReservados}
                      />
                    </div>
                    <div className='w-full lg:w-1/3'>
                      <DashBoardCard
                        label='Total Almuerzos Reservados'
                        amount={almuerzosEstadisticas.totalAlmuerzosReservados}
                        description={`Cantidad total de almuerzos reservados del ${almuerzosEstadisticas.fechaInicio} al ${almuerzosEstadisticas.fechaFin}`}
                        Icon={<ImListNumbered className='text-2xl text-black dark:text-white' />}
                      />
                    </div>
                    <div className='block lg:hidden w-full lg:w-4/6'>
                      <TabCharts
                        text1='Total Almuerzos Reservados'
                        text2='Cantidad total de almuerzos reservados el'
                        data={almuerzosEstadisticas.dataTotalAlmuerzosReservados}
                      />
                    </div>
                  </div>
                  <div className='w-full flex flex-col lg:flex-row gap-5 h-[600px] lg:h-96'>
                    <div className='w-full lg:w-1/3'>
                      <DashBoardCard
                        label='Almuerzos Reservados Presencialmente'
                        amount={almuerzosEstadisticas.totalAlmuerzosReservadosPresencial}
                        description={`Cantidad de almuerzos reservados presencialmente del ${almuerzosEstadisticas.fechaInicio} al ${almuerzosEstadisticas.fechaFin}`}
                        Icon={<ImListNumbered className='text-2xl text-black dark:text-white' />}
                      />
                    </div>
                    <div className='w-full lg:w-4/6'>
                      <TabCharts
                        text1='Almuerzos Reservados Presencialmente'
                        text2='Cantidad total de almuerzos reservados presencialmente el'
                        data={almuerzosEstadisticas.dataTotalAlmuerzosReservadosPresencial}
                      />
                    </div>
                  </div>
                  <div className='w-full flex flex-col lg:flex-row gap-5 h-[600px] lg:h-96'>
                    <div className='hidden lg:block w-full lg:w-4/6'>
                      <TabCharts
                        text1='Almuerzos Reservados Virtualmente'
                        text2='Cantidad total de almuerzos reservados virtualmente el'
                        data={almuerzosEstadisticas.dataTotalAlmuerzosReservadosVirtual}
                      />
                    </div>
                    <div className='w-full lg:w-1/3'>
                      <DashBoardCard
                        label='Almuerzos Reservados Virtualmente'
                        amount={almuerzosEstadisticas.totalAlmuerzosReservadosVirtual}
                        description={`Cantidad de almuerzos reservados virtualmente del ${almuerzosEstadisticas.fechaInicio} al ${almuerzosEstadisticas.fechaFin}`}
                        Icon={<ImListNumbered className='text-2xl text-black dark:text-white' />}
                      />
                    </div>
                    <div className='block lg:hidden w-full lg:w-4/6'>
                      <TabCharts
                        text1='Almuerzos Reservados Virtualmente'
                        text2='Cantidad total de almuerzos reservados virtualmente el'
                        data={almuerzosEstadisticas.dataTotalAlmuerzosReservadosVirtual}
                      />
                    </div>
                  </div>
                  <div className='w-full flex flex-col lg:flex-row gap-5 h-[600px] lg:h-96'>
                    <div className='w-full lg:w-1/3'>
                      <DashBoardCard
                        label='Almuerzos Entregados'
                        amount={almuerzosEstadisticas.totalAlmuerzosEntregados}
                        description={`Cantidad de almuerzos entregados del ${almuerzosEstadisticas.fechaInicio} al ${almuerzosEstadisticas.fechaFin}`}
                        Icon={<ImListNumbered className='text-2xl text-black dark:text-white' />}
                      />
                    </div>
                    <div className='w-full lg:w-4/6'>
                      <TabCharts
                        text1='Almuerzos Entregados'
                        text2='Cantidad total de almuerzos entregados el'
                        data={almuerzosEstadisticas.dataTotalAlmuerzosEntregados}
                      />
                    </div>
                  </div>
                  <div className='w-full flex flex-col lg:flex-row gap-5 h-[600px] lg:h-96'>
                    <div className='hidden lg:block w-full lg:w-4/6'>
                      <TabCharts
                        text1='Almuerzos Sin Entregar'
                        text2='Cantidad total de almuerzos sin entregar el'
                        data={almuerzosEstadisticas.dataTotalAlmuerzosSinEntregar}
                      />
                    </div>
                    <div className='w-full lg:w-1/3'>
                      <DashBoardCard
                        label='Almuerzos Sin Entregar'
                        amount={almuerzosEstadisticas.totalAlmuerzosSinEntregar}
                        description={`Cantidad de almuerzos sin entregar del ${almuerzosEstadisticas.fechaInicio} al ${almuerzosEstadisticas.fechaFin}`}
                        Icon={<ImListNumbered className='text-2xl text-black dark:text-white' />}
                      />
                    </div>
                    <div className='block lg:hidden w-full lg:w-4/6'>
                      <TabCharts
                        text1='Almuerzos Sin Entregar'
                        text2='Cantidad total de almuerzos sin entregar el'
                        data={almuerzosEstadisticas.dataTotalAlmuerzosSinEntregar}
                      />
                    </div>
                  </div>
                  <div className='w-full flex flex-col lg:flex-row gap-5 h-[600px] lg:h-96'>
                    <div className='w-full lg:w-1/3'>
                      <DashBoardCard
                        label='Recargas Realizadas'
                        amount={almuerzosEstadisticas.totalRecargas}
                        description={`Cantidad de recargas realizadas del ${almuerzosEstadisticas.fechaInicio} al ${almuerzosEstadisticas.fechaFin}`}
                        Icon={<ImListNumbered className='text-2xl text-black dark:text-white' />}
                      />
                    </div>
                    <div className='w-full lg:w-4/6'>
                      <TabCharts
                        text1='Recargas Realizadas'
                        text2='Cantidad total de recargas realizadas el'
                        data={almuerzosEstadisticas.dataTotalRecargas}
                      />
                    </div>
                  </div>
                </>
              )
        }
      </section>
    </section>
  )
}
