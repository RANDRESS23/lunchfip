'use client'

import { useEstudiante } from '@/hooks/useEstudiante'
import { BalanceCard } from './BalanceCard'
import { useState } from 'react'
import { useConfetti } from '@/hooks/useConfetti'
import Realistic from 'react-canvas-confetti/dist/presets/realistic'
import api from '@/libs/api'
import { toast } from 'sonner'
import { useAlmuerzosTotales } from '@/hooks/useAlmuerzosTotales'
import { AvailableLunchs } from './AvailableLunchs'
import { useAlmuerzosReservados } from '@/hooks/useAlmuerzosReservados'
import { cn } from '@/libs/utils'
import { useEstudianteCodigoQRReserva } from '@/hooks/useEstudianteCodigoQRReserva'
import { ReserveCodeQR } from './ReserveCodeQR'
import { type AlmuerzosReservados } from '@/types/almuerzos'
import { useAlmuerzosFecha } from '@/hooks/useAlmuerzosFecha'
import { format } from '@formkit/tempo'

interface ReserveLunchProps {
  isValidHourToReserve: boolean
  isValidHourToDelivery: boolean
  isValidHourToDeliveryStats: boolean
}

export const ReserveLunch = ({ isValidHourToReserve, isValidHourToDelivery, isValidHourToDeliveryStats }: ReserveLunchProps) => {
  const { estudiante, setEstudiante } = useEstudiante()
  const { almuerzosFecha } = useAlmuerzosFecha()
  const { almuerzosTotales } = useAlmuerzosTotales({ nextDate: almuerzosFecha.fecha.toString() })
  const { almuerzosReservados, setAlmuerzosReservados } = useAlmuerzosReservados({ nextDate: almuerzosFecha.fecha.toString() })
  const { codigoQRReserva } = useEstudianteCodigoQRReserva({ estudiante, idAlmuerzo: almuerzosTotales.id_almuerzo })
  const [loadingReservation, setLoadingReservation] = useState(false)

  const saldoString = estudiante.saldo.toString()
  const saldoParsed = saldoString.slice(0, saldoString.length - 3)
  const saldoParsed2 = saldoString.slice(saldoString.length - 3)
  const saldoParsed3 = saldoParsed !== '' ? `$ ${saldoParsed}.${saldoParsed2}` : '$ 0'

  const { onInitHandler, onShoot } = useConfetti()

  const getNextFullDate = () => {
    if (almuerzosFecha.id_almuerzos_fecha !== '') {
      const fechaAux = new Date(almuerzosFecha.fecha?.toString() ?? new Date().toString())
      const fechaAux2 = new Date(fechaAux.setDate(fechaAux.getDate() + 1))
      return format(fechaAux2, 'full')
    }
  }

  const confirmReservation = () => {
    if (estudiante.saldo < 1500) return toast.error('¡No cuentas con el saldo suficiente para reservar tu almuerzo!.')

    toast(`¿Estás seguro que deseas reservar el almuerzos para el día "${getNextFullDate()}?"`, {
      action: {
        label: 'Reservar',
        onClick: () => { saveReservation() }
      }
    })
  }

  const saveReservation = async () => {
    try {
      setLoadingReservation(true)

      const response = await api.post('/almuerzos/reservas', {
        id_estudiante: estudiante.id_estudiante,
        id_almuerzo: almuerzosTotales.id_almuerzo
      })

      if (response.status === 201) {
        onShoot()
        toast.success('¡Reserva realizada exitosamente!')
        setEstudiante({ ...estudiante, saldo: estudiante.saldo - 1500 })
        setAlmuerzosReservados(response.data.almuerzosReservados as AlmuerzosReservados)
      }
    } catch (error: any) {
      if (error.response.data !== undefined) {
        const { message } = error.response.data

        toast.error(message as string)
      }
    } finally {
      setLoadingReservation(false)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center -mt-7'>
      {
        isValidHourToDeliveryStats && (
          <p className='w-full z-10 mt-14 mb-5 italic text-center text-color-secondary'>⚠ ¡Servicio no disponible, podrás reservar tu almuerzo si cuentas con el saldo suficiente a partir de las 05:00 p.m.!. ⚠</p>
        )
      }
      {
        (almuerzosTotales.id_almuerzo !== '') && (almuerzosTotales.total_almuerzos - almuerzosReservados.cantidad === 0) && (codigoQRReserva === '') && isValidHourToReserve && (
          <p className='w-full z-10 mt-14 italic text-center text-color-secondary'>⚠ ¡Mala suerte, se agotaron los almuerzos disponibles para reservar, atento para la próxima vez!. ⚠</p>
        )
      }
      {
        (codigoQRReserva === '') && isValidHourToDelivery && (
          <p className='w-full z-10 mt-14 italic text-center text-color-secondary'>⚠ ¡Mala suerte, no alcanzaste a reservar tu almuerzo, atento para la próxima vez!. ⚠</p>
        )
      }
      {
        (almuerzosTotales.id_almuerzo === '') && isValidHourToReserve && (
          <p className='w-full z-10 mt-14 italic text-center text-color-secondary'>⚠ ¡El administrador no ha definido la cantidad total de almuerzos para reservar, intente más tarde!. ⚠</p>
        )
      }
      <div className='w-full flex flex-col items-center justify-center'>
        {
          (codigoQRReserva !== '') && (isValidHourToReserve || isValidHourToDelivery) && (
            <ReserveCodeQR
              primerNombre={estudiante.primer_nombre}
              primerApellido={estudiante.primer_apellido}
              codigoQRReserva={codigoQRReserva}
            />
          )
        }
        <div className={cn(
          'flex flex-col md:flex-row items-center justify-center md:gap-10',
          almuerzosTotales.id_almuerzo === '' && '-mt-10',
          codigoQRReserva !== '' && 'mt-0 md:-mt-10'
        )}>
          <AvailableLunchs
            amounthLunch={isValidHourToReserve ? almuerzosTotales.total_almuerzos - almuerzosReservados.cantidad : 'N/A'}
            nextFullDate={getNextFullDate()}
            isAvailableReserve={almuerzosTotales.id_almuerzo !== '' && codigoQRReserva === '' && almuerzosTotales.total_almuerzos - almuerzosReservados.cantidad !== 0 && isValidHourToReserve}
          />
          <BalanceCard
            nextFullDate={getNextFullDate()}
            saldoParsed={saldoParsed3}
            loadingReservation={loadingReservation}
            isAvailableReserve={almuerzosTotales.id_almuerzo !== '' && codigoQRReserva === '' && almuerzosTotales.total_almuerzos - almuerzosReservados.cantidad !== 0 && isValidHourToReserve}
            saveReservation={confirmReservation}
          />
        </div>
      </div>
      <Realistic onInit={onInitHandler} />
    </div>
  )
}
