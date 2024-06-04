import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type AlmuerzosEstadisticas } from '@/types/almuerzos'
import { useAlmuerzosStore } from '@/store/almuerzos'

export const useAlmuerzosEstadisticas = ({ fechaInicio, fechaFin }: { fechaInicio: string, fechaFin: string }) => {
  const fechaInicioFinal = new Date(fechaInicio)
  const fechaFinFinal = new Date(fechaFin)

  const almuerzosEstadisticas = useAlmuerzosStore(state => state.almuerzosEstadisticas)
  const setAlmuerzosEstadisticas = useAlmuerzosStore(state => state.setAlmuerzosEstadisticas)
  const [loadingAlmuerzosEstadisticas, setLoadingAlmuerzosEstadisticas] = useState(false)

  useEffect(() => {
    const getAlmuerzosEstadisticas = async () => {
      try {
        setLoadingAlmuerzosEstadisticas(true)

        const response = await api.get(`/almuerzos/estadisticas/${fechaInicioFinal.toString()}/${fechaFinFinal.toString()}`)

        if (response.data === null) return

        setAlmuerzosEstadisticas(response.data.almuerzosEstadisticas as AlmuerzosEstadisticas)
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingAlmuerzosEstadisticas(false)
      }
    }

    getAlmuerzosEstadisticas()
  }, [fechaInicio, fechaFin])

  return { almuerzosEstadisticas, loadingAlmuerzosEstadisticas, setAlmuerzosEstadisticas }
}
