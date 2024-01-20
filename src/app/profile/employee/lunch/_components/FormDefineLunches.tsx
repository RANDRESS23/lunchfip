'use client'

import { useState } from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '@/libs/api'
import { Input } from '@/components/Input'
import { FaSortAmountUpAlt } from 'react-icons/fa'
import { Button } from '@/components/Button'
import { toast } from 'sonner'
import { totalLunchesSchema } from '@/app/api/almuerzos/schema'
import { useAlmuerzosStore } from '@/store/almuerzos'
import { type Almuerzos, type AlmuerzosEntregados, type AlmuerzosReservados } from '@/types/almuerzos'
import { useAlmuerzosTotales } from '@/hooks/useAlmuerzosTotales'

interface FormDefineLunchesProps {
  nextDate: Date
  nextFullDate: string
}

export const FormDefineLunches = ({ nextDate, nextFullDate }: FormDefineLunchesProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [editAmount, setEditAmount] = useState(true)
  const setAlmuerzosTotales = useAlmuerzosStore(state => state.setAlmuerzosTotales)
  const setAlmuerzosReservados = useAlmuerzosStore(state => state.setAlmuerzosReservados)
  const setAlmuerzosEntregados = useAlmuerzosStore(state => state.setAlmuerzosEntregados)
  const { almuerzosTotales, loadingAlmuerzosTotales } = useAlmuerzosTotales({ nextDate: nextDate.toString() })

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
    setIsLoading(true)

    try {
      if (almuerzosTotales?.id_almuerzo !== '') {
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
          setEditAmount(false)
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
          setEditAmount(false)
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
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className='lg:max-w-sm w-11/12 flex flex-col gap-5 mt-10'>
        <div className='mb-3'>
          {
            almuerzosTotales?.id_almuerzo !== '' && !editAmount
              ? (
                  <h2 className='flex items-center flex-wrap text-xl font-semibold dark:text-gray-400 text-gray-800/90 tracking-tighter'>
                    Ya se registró la cantidad de almuerzos para el día {nextFullDate}
                  </h2>
                )
              : (
                  <h2 className='flex items-center flex-wrap text-xl font-semibold dark:text-gray-400 text-gray-800/90 tracking-tighter'>
                    Registrar la cantidad de almuerzos para el día {nextFullDate}
                  </h2>
                )
          }
        </div>

        <Input
          type="number"
          label="Cantidad de Almuerzos"
          isRequired
          name="total_almuerzos"
          size="lg"
          value={almuerzosTotales?.id_almuerzo !== '' ? almuerzosTotales?.total_almuerzos.toString() : ''}
          disabled={(isLoading || almuerzosTotales?.id_almuerzo !== '' || loadingAlmuerzosTotales) && !editAmount}
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
          text={almuerzosTotales?.id_almuerzo !== '' ? 'Actualizar' : 'Registrar'}
          disabled={(isLoading || almuerzosTotales?.id_almuerzo !== '' || loadingAlmuerzosTotales) && !editAmount}
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
      </form>
    </div>
  )
}
