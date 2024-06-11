'use client'

import { useAlmuerzosFecha } from '@/hooks/useAlmuerzosFecha'
import { useAlmuerzosTotales } from '@/hooks/useAlmuerzosTotales'
import { useConfetti } from '@/hooks/useConfetti'
import { ALMUERZOS_FECHA_INITIAL_VALUES } from '@/initial-values/almuerzos'
import api from '@/libs/api'
import { useState } from 'react'
import Realistic from 'react-canvas-confetti/dist/presets/realistic'
import { toast } from 'sonner'

export const ButtonFinishService = () => {
  const [loading, setLoading] = useState(false)
  const { almuerzosFecha, setAlmuerzosFecha } = useAlmuerzosFecha()
  const { almuerzosTotales } = useAlmuerzosTotales({ nextDate: almuerzosFecha.fecha.toString() })

  const { onInitHandler, onShoot } = useConfetti()

  const handleConfirm = () => {
    toast('¿Deseas finalizar el servicio de almuerzos del día?', {
      action: {
        label: 'Finalizar',
        onClick: () => {
          handleFinishService()
        }
      }
    })
  }

  const handleFinishService = async () => {
    try {
      setLoading(true)

      const response = await api.post('/almuerzos/estado', {
        id_almuerzo: almuerzosTotales.id_almuerzo
      })

      if (response.status === 201) {
        onShoot()
        setAlmuerzosFecha(ALMUERZOS_FECHA_INITIAL_VALUES)
        toast.success('¡Servicio de Almuerzos finalizada exitosamente!')
      }
    } catch (error: any) {
      if (error.response.data !== undefined) {
        const { message } = error.response.data

        toast.error(message as string)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center'>
      <button className="py-3 mt-5 animate-shimmer items-center justify-center rounded-xl border border-black dark:border-white bg-[linear-gradient(110deg,#f2f3f3,45%,#aaaeb4,55%,#f2f3f3)] dark:bg-[linear-gradient(110deg,#000103,45%,#637494,55%,#000103)] bg-[length:200%_100%] px-10 font-medium text-black dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 hover:px-14 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleConfirm} disabled={loading || almuerzosFecha.id_almuerzos_fecha === ''}>
        {loading ? 'Cargando...' : 'Finalizar Jornada De Servicio'}
      </button>
      <Realistic onInit={onInitHandler} />
    </div>
  )
}
