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
import { useAlmuerzosEntregados } from '@/hooks/useAlmuerzosEntregados'
import { cn } from '@/libs/utils'
import { useEstudianteCodigoQRReserva } from '@/hooks/useEstudianteCodigoQRReserva'
import { ReserveCodeQR } from './ReserveCodeQR'

interface ReserveLunchProps {
  nextDate: Date
  nextFullDate: string
}

export const ReserveLunch = ({ nextDate, nextFullDate }: ReserveLunchProps) => {
  const { estudiante } = useEstudiante()
  const [loadingReservation, setLoadingReservation] = useState(false)
  const { almuerzosTotales } = useAlmuerzosTotales({ nextDate: nextDate.toString() })
  const { almuerzosReservados } = useAlmuerzosReservados({ nextDate: nextDate.toString() })
  const { almuerzosEntregados } = useAlmuerzosEntregados({ nextDate: nextDate.toString() })

  const { codigoQRReserva } = useEstudianteCodigoQRReserva({ idEstudiante: estudiante.id_estudiante, idAlmuerzo: almuerzosTotales.id_almuerzo })

  const saldoString = estudiante.saldo.toString()
  const saldoParsed = saldoString.slice(0, saldoString.length - 3)
  const saldoParsed2 = saldoString.slice(saldoString.length - 3)
  const saldoParsed3 = saldoParsed !== '' ? `$ ${saldoParsed}.${saldoParsed2}` : '$ 0'

  const { onInitHandler, onShoot } = useConfetti()

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
        almuerzosTotales.id_almuerzo === '' && (
          <p className='w-full z-10 mt-14 italic text-center text-color-secondary'>⚠ ¡El administrador no ha definido la cantidad total de almuerzos para reservar, intente más tarde!. ⚠</p>
        )
      }
      <div className={'flex flex-col items-center justify-center'}>
        {
          codigoQRReserva !== '' && (
            <>
              <p className='w-full z-10 mt-14 italic text-center text-color-primary'>✔ ¡Reservaste, puedes visualizar tu código QR de reserva a continuación, presenta este código QR al personal encargado para reclamar tu almuerzo!. ✔</p>
              <ReserveCodeQR
                primerNombre={estudiante.primer_nombre}
                primerApellido={estudiante.primer_apellido}
                codigoQRReserva={codigoQRReserva}
                isAvailableReserve={almuerzosTotales.id_almuerzo !== ''}
              />
            </>
          )
        }
        <div className={cn(
          'flex flex-col md:flex-row items-center justify-center md:gap-10',
          almuerzosTotales.id_almuerzo === '' && '-mt-10',
          codigoQRReserva !== '' && '-mt-24 md:-mt-16'
        )}>
          <AvailableLunchs
            amounthLunch={almuerzosReservados.cantidad - almuerzosEntregados.cantidad}
            nextFullDate={nextFullDate}
            isAvailableReserve={almuerzosTotales.id_almuerzo !== '' && codigoQRReserva === ''}
          />
          <BalanceCard
            nextFullDate={nextFullDate}
            saldoParsed={saldoParsed3}
            loadingReservation={loadingReservation}
            isAvailableReserve={almuerzosTotales.id_almuerzo !== '' && codigoQRReserva === ''}
            saveReservation={saveReservation}
          />
        </div>
      </div>
      <Realistic onInit={onInitHandler} />
    </div>
  )
}
