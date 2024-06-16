import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type AlmuerzosEstadisticas } from '@/types/almuerzos'
import { useAlmuerzosStore } from '@/store/almuerzos'
import { format } from '@formkit/tempo'

/* ➡ Hook para manejar los datos de las estadisticas de los almuerzos */
export const useAlmuerzosEstadisticas = ({ fechaInicio, fechaFin }: { fechaInicio: string, fechaFin: string }) => {
  const fechaAux = new Date(fechaInicio ?? new Date().toString())
  const fechaAux2 = new Date(fechaAux.setDate(fechaAux.getDate() + 1))
  const fechaInicioFinal = format(fechaAux2, 'YYYY-MM-DD')

  const fechaAux3 = new Date(fechaFin ?? new Date().toString())
  const fechaAux4 = new Date(fechaAux3.setDate(fechaAux3.getDate() + 1))
  const fechaFinFinal = format(fechaAux4, 'YYYY-MM-DD')

  const almuerzosEstadisticas = useAlmuerzosStore(state => state.almuerzosEstadisticas)
  const setAlmuerzosEstadisticas = useAlmuerzosStore(state => state.setAlmuerzosEstadisticas)
  const [loadingAlmuerzosEstadisticas, setLoadingAlmuerzosEstadisticas] = useState(false)

  useEffect(() => {
    const getAlmuerzosEstadisticas = async () => {
      try {
        setLoadingAlmuerzosEstadisticas(true)

        const response = await api.get(`/almuerzos/estadisticas/${fechaInicioFinal}/${fechaFinFinal}`)

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
