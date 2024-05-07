'use client'

import { Button } from '@/components/Button'
import { useEstudiante } from '@/hooks/useEstudiante'
import { BalanceCard } from './BalanceCard'
import { useState } from 'react'
import { useConfetti } from '@/hooks/useConfetti'
import Realistic from 'react-canvas-confetti/dist/presets/realistic'
import api from '@/libs/api'

interface ReserveLunchProps {
  nextDate: Date
  nextFullDate: string
}

export const ReserveLunch = ({ nextDate, nextFullDate }: ReserveLunchProps) => {
  const { estudiante } = useEstudiante()
  const [loadingReservation, setLoadingReservation] = useState(false)

  const saldoString = estudiante.saldo.toString()
  const saldoParsed = saldoString.slice(0, saldoString.length - 3)
  const saldoParsed2 = saldoString.slice(saldoString.length - 3)
  const saldoParsed3 = saldoParsed !== '' ? `$ ${saldoParsed}.${saldoParsed2}` : '$ 0'

  const { onInitHandler, onShoot } = useConfetti()

  const saveReservation = async () => {
    // try {
    //   setLoadingReservation(true)

    //   // -> arreglar despues de agregar la opcion de reserva virtual

    //   const response = await api.post('/almuerzos/reservas', {
    //     id_empleado: empleado.id_empleado,
    //     id_estudiante: estudiante.id_estudiante,
    //     id_almuerzo: almuerzosTotales.id_almuerzo
    //   })

    //   if (response.status === 201) {
    //     const { almuerzosReservados } = response.data

    //     setAlmuerzosReservados(almuerzosReservados as AlmuerzosReservados)

    //     onShoot()
    //     toast.success('¡Reserva realizada exitosamente!')

    //     if (reset !== undefined) reset()
    //     onClose()
    //   }
    // } catch (error: any) {
    //   if (error.response.data !== undefined) {
    //     const { message } = error.response.data

    //     toast.error(message as string)
    //   }
    // } finally {
    //   setLoadingReservation(false)
    // }
  }

  return (
    <div className='flex flex-col items-center justify-center -mt-7'>
      <BalanceCard
        nextFullDate={nextFullDate}
        saldoParsed={saldoParsed3}
        loadingReservation={loadingReservation}
        saveReservation={saveReservation}
      />
      <Realistic onInit={onInitHandler} />
    </div>
  )
}
