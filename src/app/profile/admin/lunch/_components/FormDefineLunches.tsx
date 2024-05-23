'use client'

import { useEffect, useState } from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '@/libs/api'
import { Input } from '@/components/Input'
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

interface FormDefineLunchesProps {
  nextDate: Date
  nextFullDate: string
}

export const FormDefineLunches = ({ nextDate, nextFullDate }: FormDefineLunchesProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const { setAlmuerzosReservados } = useAlmuerzosReservados({ nextDate: nextDate.toString() })
  const { setAlmuerzosEntregados } = useAlmuerzosEntregados({ nextDate: nextDate.toString() })
  const { almuerzosTotales, loadingAlmuerzosTotales, setAlmuerzosTotales } = useAlmuerzosTotales({ nextDate: nextDate.toString() })
  const [editAmount, setEditAmount] = useState(true)
  const { onInitHandler, onShoot } = useConfetti()

  useEffect(() => {
    setEditAmount(almuerzosTotales?.id_almuerzo === '')
  }, [almuerzosTotales])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      total_almuerzos: '',
      nextDate: new Date()
    },
    resolver: zodResolver(totalLunchesSchema)
  })

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

          toast.success(`¡Cantidad de almuerzos actualizada exitosamente para la fecha ${nextFullDate}!`)
          onShoot()
        }
      } else {
        const response = await api.post('/almuerzos', {
          total_almuerzos: data.total_almuerzos,
          nextDate
        })

        if (response.status === 201) {
          const { almuerzosTotales, almuerzosReservados, almuerzosEntregados } = response.data

          setAlmuerzosTotales(almuerzosTotales as Almuerzos)
          setAlmuerzosReservados(almuerzosReservados as AlmuerzosReservados)
          setAlmuerzosEntregados(almuerzosEntregados as AlmuerzosEntregados)

          toast.success(`¡Cantidad de almuerzos asignada exitosamente para la fecha ${nextFullDate}!`)
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
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className='lg:max-w-sm w-11/12 flex flex-col font-inter-sans'>
        <div className='mb-3'>
          {
            almuerzosTotales?.id_almuerzo !== '' && !editAmount
              ? (
                  <p className='w-full z-10 -mt-3 mb-6 text-p-light dark:text-p-dark italic text-center'>
                    Ya se registró la cantidad de almuerzos para el día <span className='font-semibold'>{nextFullDate}</span>
                  </p>
                )
              : (
                  <p className='w-full z-10 -mt-3 mb-6 text-p-light dark:text-p-dark italic text-center'>
                    Registrar la cantidad de almuerzos para el día <span className='font-semibold'>{nextFullDate}</span>
                  </p>
                )
          }
        </div>

        {
          !loadingAlmuerzosTotales
            ? (
                <div className='flex flex-col justify-center items-center gap-5'>
                  <Input
                    type="number"
                    label="Cantidad de Almuerzos"
                    isRequired
                    name="total_almuerzos"
                    value={almuerzosTotales?.id_almuerzo !== '' ? almuerzosTotales?.total_almuerzos.toString() : ''}
                    disabled={isLoading || !editAmount}
                    register={register}
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
                    disabled={isLoading || !editAmount}
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
                <div className='flex flex-col justify-center items-center gap-5'>
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
