import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type Almuerzos } from '@/types/almuerzos'
import { useAlmuerzosStore } from '@/store/almuerzos'

export const useAlmuerzosTotales = ({ nextDate }: { nextDate: string }) => {
  const almuerzosTotales = useAlmuerzosStore(state => state.almuerzosTotales)
  const setAlmuerzosTotales = useAlmuerzosStore(state => state.setAlmuerzosTotales)
  const [loadingAlmuerzosTotales, setLoadingAlmuerzosTotales] = useState(false)

  useEffect(() => {
    const getAlmuerzosTotales = async () => {
      try {
        setLoadingAlmuerzosTotales(true)

        const response = await api.get(`/almuerzos/${nextDate}`)

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
  }, [])

  return { almuerzosTotales, loadingAlmuerzosTotales }
}
