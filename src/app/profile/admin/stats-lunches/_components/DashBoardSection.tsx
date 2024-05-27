'use client'

import { useAlmuerzosEstadisticas } from '@/hooks/useAlmuerzosEstadisticas'
import { DashBoardCard } from './DashBoardCard'
import { DateRangePicker } from '@nextui-org/react'
import { useState } from 'react'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { type RangeValue } from '@react-types/shared'
import { type DateValue } from '@react-types/datepicker'
import { I18nProvider } from '@react-aria/i18n'

export const DashBoardSection = () => {
  const [fecha, setFecha] = useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()).subtract({ days: 7 }),
    end: today(getLocalTimeZone())
  })
  const { almuerzosEstadisticas, loadingAlmuerzosEstadisticas } = useAlmuerzosEstadisticas({ fechaInicio: fecha.start.toString(), fechaFin: fecha.end.toString() })

  return (
    <section className='w-full flex flex-col'>
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
      <section className='w-full flex justify-between items-center flex-wrap gap-5 mt-7'>
        <DashBoardCard
          label='Almuerzos Definidos'
          amount={almuerzosEstadisticas.totalAlmuerzosDefinidos}
          description={`Cantidad de almuerzos definidos del ${almuerzosEstadisticas.fechaInicio} al ${almuerzosEstadisticas.fechaFin}`}
          Icon={<span>Icon</span>}
        />
        <DashBoardCard
          label='Total Almuerzos Reservados'
          amount={almuerzosEstadisticas.totalAlmuerzosReservados}
          description={`Cantidad total de almuerzos reservados del ${almuerzosEstadisticas.fechaInicio} al ${almuerzosEstadisticas.fechaFin}`}
          Icon={<span>Icon</span>}
        />
        <DashBoardCard
          label='Almuerzos Reservados Presencialmente'
          amount={almuerzosEstadisticas.totalAlmuerzosReservadosPresencial}
          description={`Cantidad de almuerzos reservados presencialmente del ${almuerzosEstadisticas.fechaInicio} al ${almuerzosEstadisticas.fechaFin}`}
          Icon={<span>Icon</span>}
        />
        <DashBoardCard
          label='Almuerzos Reservados Virtualmente'
          amount={almuerzosEstadisticas.totalAlmuerzosReservadosVirtual}
          description={`Cantidad de almuerzos reservados virtualmente del ${almuerzosEstadisticas.fechaInicio} al ${almuerzosEstadisticas.fechaFin}`}
          Icon={<span>Icon</span>}
        />
        <DashBoardCard
          label='Almuerzos Entregados'
          amount={almuerzosEstadisticas.totalAlmuerzosEntregados}
          description={`Cantidad de almuerzos entregados del ${almuerzosEstadisticas.fechaInicio} al ${almuerzosEstadisticas.fechaFin}`}
          Icon={<span>Icon</span>}
        />
        <DashBoardCard
          label='Almuerzos Sin Entregar'
          amount={almuerzosEstadisticas.totalAlmuerzosSinEntregar}
          description={`Cantidad de almuerzos sin entregar del ${almuerzosEstadisticas.fechaInicio} al ${almuerzosEstadisticas.fechaFin}`}
          Icon={<span>Icon</span>}
        />
        <DashBoardCard
          label='Recargas Realizadas'
          amount={almuerzosEstadisticas.totalRecargas}
          description={`Cantidad de recargas realizadas del ${almuerzosEstadisticas.fechaInicio} al ${almuerzosEstadisticas.fechaFin}`}
          Icon={<span>Icon</span>}
        />
      </section>
    </section>
  )
}
