import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type Almuerzos } from '@/types/almuerzos'
import { useAlmuerzosStore } from '@/store/almuerzos'
import { format } from '@formkit/tempo'

export const useAlmuerzosTotales = ({ nextDate }: { nextDate: string }) => {
  const fechaAux = new Date(nextDate?.toString() ?? new Date().toString())
  const fechaAux2 = new Date(fechaAux.setDate(fechaAux.getDate() + 1))
  const fecha = format(fechaAux2, 'YYYY-MM-DD')

  const almuerzosTotales = useAlmuerzosStore(state => state.almuerzosTotales)
  const setAlmuerzosTotales = useAlmuerzosStore(state => state.setAlmuerzosTotales)
  const [loadingAlmuerzosTotales, setLoadingAlmuerzosTotales] = useState(false)

  useEffect(() => {
    const getAlmuerzosTotales = async () => {
      try {
        setLoadingAlmuerzosTotales(true)

        const response = await api.get(`/almuerzos/${fecha}`)

        if (response.data === null) return

        const almuerzosTotales: Almuerzos = response.data

        setAlmuerzosTotales(almuerzosTotales)
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingAlmuerzosTotales(false)
      }
    }

    getAlmuerzosTotales()
  }, [nextDate])

  return { almuerzosTotales, loadingAlmuerzosTotales, setAlmuerzosTotales }
}
