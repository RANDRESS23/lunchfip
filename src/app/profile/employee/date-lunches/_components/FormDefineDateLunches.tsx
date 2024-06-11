'use client'

import { useCallback, useEffect, useState } from 'react'
import { DatePicker, Skeleton } from '@nextui-org/react'
import { useConfetti } from '@/hooks/useConfetti'
import Realistic from 'react-canvas-confetti/dist/presets/realistic'
import { type DateValue, parseDate, today, isWeekend, getLocalTimeZone } from '@internationalized/date'
import { I18nProvider, useLocale } from '@react-aria/i18n'
import { Button } from '@/components/Button'
import { ButtonLitUpBorders } from '@/components/Button/ButtonLitUpBoders'
import { useAlmuerzosFecha } from '@/hooks/useAlmuerzosFecha'
import { format } from '@formkit/tempo'
import { toast } from 'sonner'
import api from '@/libs/api'
import { type AlmuerzosFecha } from '@/types/almuerzos'

export const FormDefineDateLunches = () => {
  const [fecha, setFecha] = useState<DateValue | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { almuerzosFecha, loadingAlmuerzosFecha, setAlmuerzosFecha } = useAlmuerzosFecha()
  const [editAmount, setEditAmount] = useState(false)
  const { onInitHandler, onShoot } = useConfetti()

  const { locale } = useLocale()

  const handleFecha = (newDate: DateValue) => {
    setFecha(newDate)
  }

  useEffect(() => {
    if (almuerzosFecha.id_almuerzos_fecha === '') {
      if (isWeekend(today(getLocalTimeZone()), locale)) {
        const fechaAux = today(getLocalTimeZone()).add({ days: 1 })

        if (isWeekend(fechaAux, locale)) {
          setFecha(today(getLocalTimeZone()).add({ days: 2 }))
        } else {
          setFecha(today(getLocalTimeZone()).add({ days: 1 }))
        }
      } else {
        const fechaAux = today(getLocalTimeZone()).add({ days: 1 })

        if (isWeekend(fechaAux, locale)) {
          setFecha(today(getLocalTimeZone()).add({ days: 3 }))
        } else {
          setFecha(today(getLocalTimeZone()).add({ days: 1 }))
        }
      }
    } else {
      const fechaAux = new Date(almuerzosFecha.fecha?.toString() ?? new Date().toString())
      const fechaAux2 = new Date(fechaAux.setDate(fechaAux.getDate() + 1))
      const fecha = format(fechaAux2, 'YYYY-MM-DD')

      setFecha(parseDate(fecha))
    }
  }, [almuerzosFecha.id_almuerzos_fecha])

  const isDateUnavailable = (date: DateValue) => isWeekend(date, locale)

  const getNextFullDate = useCallback(() => {
    if (almuerzosFecha.id_almuerzos_fecha !== '') {
      const fechaAux = new Date(almuerzosFecha.fecha?.toString() ?? new Date().toString())
      const fechaAux2 = new Date(fechaAux.setDate(fechaAux.getDate() + 1))
      return format(fechaAux2, 'full')
    } else {
      const fechaAux = new Date(fecha?.toString() ?? new Date().toString())
      const fechaAux2 = new Date(fechaAux.setDate(fechaAux.getDate() + 1))
      return format(fechaAux2, 'full')
    }
  }, [almuerzosFecha.fecha])

  const handleSubmitDate = async () => {
    try {
      setIsLoading(true)

      if (almuerzosFecha?.id_almuerzos_fecha !== '') {
        const fechaAux = new Date(almuerzosFecha.fecha?.toString() ?? new Date().toString())
        const fechaAux2 = new Date(fechaAux.setDate(fechaAux.getDate() + 1))
        const fechaDefinied = format(fechaAux2, 'YYYY-MM-DD')

        const fechaAux3 = new Date(fecha?.toString() ?? new Date().toString())
        const fechaAux4 = new Date(fechaAux3.setDate(fechaAux3.getDate() + 1))
        const fecha2 = format(fechaAux4, 'YYYY-MM-DD')

        const isPossibleSubmit = fechaDefinied !== fecha2

        if (!isPossibleSubmit) {
          return toast.success('¡La fecha seleccionada sigue igual, por lo tanto no se ha realizado ningún cambio!')
        }

        const response = await api.patch('/almuerzos/fecha', {
          id_almuerzos_fecha: almuerzosFecha.id_almuerzos_fecha,
          newFecha: fecha2
        })

        if (response.status === 201) {
          const { almuerzosFecha } = response.data

          setAlmuerzosFecha(almuerzosFecha as AlmuerzosFecha)

          toast.success(`¡Fecha del servicio de almuerzos actualizada exitosamente para el día ${format(fechaAux4, 'full')}!`)
          onShoot()
        }
      } else {
        const fechaAux = new Date(fecha?.toString() ?? new Date().toString())
        const fechaAux2 = new Date(fechaAux.setDate(fechaAux.getDate() + 1))
        const fecha2 = format(fechaAux2, 'YYYY-MM-DD')

        const response = await api.post('/almuerzos/fecha', {
          newFecha: fecha2
        })

        if (response.status === 201) {
          const { almuerzosFecha } = response.data

          setAlmuerzosFecha(almuerzosFecha as AlmuerzosFecha)

          toast.success(`¡Fecha del servicio de almuerzos registrada exitosamente para el día ${format(fechaAux2, 'full')}!`)
          onShoot()
        }
      }
    } catch (error: any) {
      if (error.response.data !== undefined) {
        const errorsMessages = Object.values(error.response.data as Record<string, string>)
        let errorsMessagesString = ''

        errorsMessages.forEach((message: any) => {
          errorsMessagesString += `${message} ${'\n'}`
        })

        return toast.error(errorsMessagesString)
      }

      console.error({ error })
    } finally {
      setIsLoading(false)
      setEditAmount(false)
    }
  }

  return (
    <section className='w-2/5'>
      {
        almuerzosFecha.id_almuerzos_fecha !== '' && !editAmount
          ? (
              <p className='w-full z-10 -mt-3 mb-6 text-p-light dark:text-p-dark italic text-center'>
                Ya se registró la fecha de servicio de almuerzos para el día <span className='font-semibold'>{getNextFullDate()}</span>
              </p>
            )
          : (
              <p className='w-full z-10 -mt-3 mb-6 text-p-light dark:text-p-dark italic text-center'>
                Registrar la fecha para habilitar el servicio de almuerzos a los estudiantes
              </p>
            )
      }
      {
        !loadingAlmuerzosFecha
          ? (
              <section className='flex flex-col justify-center items-center gap-5'>
                <I18nProvider locale="co-CO">
                  <DatePicker
                    label="Fecha"
                    value={fecha}
                    onChange={handleFecha}
                    minValue={today(getLocalTimeZone()).subtract({ days: 1 })}
                    maxValue={parseDate('2024-06-22')}
                    isDateUnavailable={isDateUnavailable}
                    className="w-full"
                    granularity="day"
                    isDisabled={isLoading || (!editAmount && almuerzosFecha.id_almuerzos_fecha !== '')}
                  />
                </I18nProvider>
                <Button
                  type="button"
                  text={
                    isLoading
                      ? 'Cargando...'
                      : almuerzosFecha.id_almuerzos_fecha !== ''
                        ? 'Actualizar Fecha'
                        : 'Registrar Fecha'
                  }
                  disabled={isLoading || (!editAmount && almuerzosFecha.id_almuerzos_fecha !== '') || loadingAlmuerzosFecha}
                  onClick={handleSubmitDate}
                />

                {
                  (almuerzosFecha.id_almuerzos_fecha !== '' && !editAmount) && (
                    <Button
                      type="button"
                      text='Editar fecha de servicio de almuerzos'
                      disabled={false}
                      onClick={() => { setEditAmount(true) }}
                    />
                  )
                }

                {
                  (almuerzosFecha.id_almuerzos_fecha !== '' && editAmount) && (
                    <ButtonLitUpBorders
                      type="button"
                      text='Cancelar'
                      disabled={isLoading}
                      onClick={() => {
                        setEditAmount(false)

                        const fechaAux = new Date(almuerzosFecha.fecha?.toString() ?? new Date().toString())
                        const fechaAux2 = new Date(fechaAux.setDate(fechaAux.getDate() + 1))
                        const fecha = format(fechaAux2, 'YYYY-MM-DD')

                        setFecha(parseDate(fecha))
                      }}
                    />
                  )
                }
              </section>
            )
          : (
              <div className='flex flex-col justify-center items-center gap-5'>
                <Skeleton className="flex w-full h-[60px] rounded-xl"/>
                <Skeleton className="flex w-full h-[60px] rounded-xl"/>
              </div>
            )
      }
      <Realistic onInit={onInitHandler} />
    </section>
  )
}
