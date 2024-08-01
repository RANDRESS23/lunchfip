'use client'

import { useEffect, useState } from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '@/libs/api'
import { FaSortAmountUpAlt } from 'react-icons/fa'
import { Button } from '@/components/Button'
import { toast } from 'sonner'
import { totalLunchesSchema } from '@/app/api/almuerzos/schema'
import { type Almuerzos, type AlmuerzosEntregados, type AlmuerzosReservados } from '@/types/almuerzos'
import { useAlmuerzosTotales } from '@/hooks/useAlmuerzosTotales'
import { Skeleton } from '@nextui-org/react'
import { useConfetti } from '@/hooks/useConfetti'
import Realistic from 'react-canvas-confetti/dist/presets/realistic'
import { useAlmuerzosEntregados } from '@/hooks/useAlmuerzosEntregados'
import { useAlmuerzosReservados } from '@/hooks/useAlmuerzosReservados'
import { ButtonLitUpBorders } from '@/components/Button/ButtonLitUpBoders'
import { useAlmuerzosFecha } from '@/hooks/useAlmuerzosFecha'
import { format } from '@formkit/tempo'
import { InputControlled } from '@/components/Input/InputControlled'

export const FormDefineLunches = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { almuerzosFecha, loadingAlmuerzosFecha } = useAlmuerzosFecha()
  const { setAlmuerzosReservados } = useAlmuerzosReservados({ nextDate: almuerzosFecha.fecha.toString() })
  const { setAlmuerzosEntregados } = useAlmuerzosEntregados({ nextDate: almuerzosFecha.fecha.toString() })
  const { almuerzosTotales, loadingAlmuerzosTotales, setAlmuerzosTotales } = useAlmuerzosTotales({ nextDate: almuerzosFecha.fecha.toString() })
  const [editAmount, setEditAmount] = useState(true)
  const { onInitHandler, onShoot } = useConfetti()

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      total_almuerzos: almuerzosTotales.total_almuerzos === 0 ? '' : almuerzosTotales.total_almuerzos.toString(),
      nextDate: ''
    },
    resolver: zodResolver(totalLunchesSchema)
  })

  useEffect(() => {
    setEditAmount(almuerzosTotales?.id_almuerzo === '')
  }, [almuerzosTotales])

  useEffect(() => {
    if (almuerzosTotales.id_almuerzo !== '') {
      setValue('total_almuerzos', almuerzosTotales.total_almuerzos.toString(), {
        shouldValidate: true,
        shouldDirty: true
      })
    }
  }, [almuerzosTotales.id_almuerzo])

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    try {
      setIsLoading(true)

      if (almuerzosTotales?.id_almuerzo !== '') {
        const isPossibleSubmit = almuerzosTotales.total_almuerzos !== Number(data.total_almuerzos)

        if (!isPossibleSubmit) {
          return toast.success('¡La cantidad de almuerzos sigue igual, por lo tanto no se ha realizado ningún cambio!')
        }

        const response = await api.patch('/almuerzos', {
          id_almuerzo: almuerzosTotales.id_almuerzo,
          cantidad: data.total_almuerzos
        })

        if (response.status === 201) {
          const { almuerzosTotales, almuerzosReservados, almuerzosEntregados } = response.data

          setAlmuerzosTotales(almuerzosTotales as Almuerzos)
          setAlmuerzosReservados(almuerzosReservados as AlmuerzosReservados)
          setAlmuerzosEntregados(almuerzosEntregados as AlmuerzosEntregados)

          toast.success(`¡Cantidad de almuerzos actualizada exitosamente para el día ${getNextFullDate()}!`)
          onShoot()
        }
      } else {
        const fechaAux = new Date(almuerzosFecha.fecha?.toString() ?? new Date().toString())
        const fechaAux2 = new Date(fechaAux.setDate(fechaAux.getDate() + 1))
        const fechaDefinied = format(fechaAux2, 'YYYY-MM-DD')

        const response = await api.post('/almuerzos', {
          total_almuerzos: data.total_almuerzos,
          nextDate: fechaDefinied
        })

        if (response.status === 201) {
          const { almuerzosTotales, almuerzosReservados, almuerzosEntregados } = response.data

          setAlmuerzosTotales(almuerzosTotales as Almuerzos)
          setAlmuerzosReservados(almuerzosReservados as AlmuerzosReservados)
          setAlmuerzosEntregados(almuerzosEntregados as AlmuerzosEntregados)

          toast.success(`¡Cantidad de almuerzos asignada exitosamente para el día ${format(fechaAux2, 'full')}!`)
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

  const getNextFullDate = () => {
    if (almuerzosFecha.id_almuerzos_fecha !== '') {
      const fechaAux = new Date(almuerzosFecha.fecha?.toString() ?? new Date().toString())
      const fechaAux2 = new Date(fechaAux.setDate(fechaAux.getDate() + 1))
      return format(fechaAux2, 'full')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full lg:w-[420px] flex flex-col justify-center items-center font-inter-sans'>
        <div className='mb-3'>
          {
            almuerzosFecha.id_almuerzos_fecha === ''
              ? (
                  <p className='w-full z-10 -mt-3 mb-6 text-color-secondary italic text-center'>
                    ⚠ ¡No se ha definido la fecha de servicio de almuerzos! ⚠
                  </p>
                )
              : (
                  <>
                    {
                      almuerzosTotales?.id_almuerzo !== '' && !editAmount
                        ? (
                            <p className='w-full z-10 -mt-3 mb-6 text-p-light dark:text-p-dark italic text-center'>
                              Ya se registró la cantidad de almuerzos para el día <span className='font-semibold'>{getNextFullDate()}</span>
                            </p>
                          )
                        : (
                            <p className='w-full z-10 -mt-3 mb-6 text-p-light dark:text-p-dark italic text-center'>
                              Registrar la cantidad de almuerzos para el día <span className='font-semibold'>{getNextFullDate()}</span>
                            </p>
                          )
                    }
                  </>
                )
          }
        </div>

        {
          !loadingAlmuerzosTotales || !loadingAlmuerzosFecha
            ? (
                <div className='flex flex-col justify-center items-center gap-5'>
                  <InputControlled
                    type="number"
                    control={control}
                    label="Cantidad de Almuerzos"
                    isRequired
                    name="total_almuerzos"
                    disabled={isLoading || !editAmount || almuerzosFecha.id_almuerzos_fecha === ''}
                    endContent={
                      <div className="h-full flex justify-center items-center">
                        <FaSortAmountUpAlt className="text-2xl text-default-400 pointer-events-none" />
                      </div>
                    }
                    errors={errors}
                  />

                  <Button
                    type="submit"
                    text={
                      isLoading
                        ? 'Cargando...'
                        : almuerzosTotales?.id_almuerzo !== ''
                          ? 'Actualizar Cantidad'
                          : 'Registrar Cantidad'
                    }
                    disabled={isLoading || !editAmount || almuerzosFecha.id_almuerzos_fecha === ''}
                  />

                  {
                    (almuerzosTotales?.id_almuerzo !== '' && !editAmount) && (
                      <Button
                        type="button"
                        text='Editar cantidad de almuerzos'
                        disabled={false}
                        onClick={() => { setEditAmount(true) }}
                      />
                    )
                  }

                  {
                    (almuerzosTotales?.id_almuerzo !== '' && editAmount) && (
                      <ButtonLitUpBorders
                        type="button"
                        text='Cancelar'
                        disabled={isLoading}
                        onClick={() => { setEditAmount(false) }}
                      />
                    )
                  }
                </div>
              )
            : (
                <div className='w-full flex flex-col justify-center items-center gap-5'>
                  <Skeleton className="flex w-full h-[60px] rounded-xl"/>
                  <Skeleton className="flex w-full h-[60px] rounded-xl"/>
                </div>
              )
        }
      </form>
      <Realistic onInit={onInitHandler} />
    </div>
  )
}
