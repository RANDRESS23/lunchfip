import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type AlmuerzosFecha } from '@/types/almuerzos'
import { useAlmuerzosStore } from '@/store/almuerzos'

/* ➡ Hook para manejar los datos de los almuerzos dependiendo de la fecha */
export const useAlmuerzosFecha = () => {
  const almuerzosFecha = useAlmuerzosStore(state => state.almuerzosFecha)
  const setAlmuerzosFecha = useAlmuerzosStore(state => state.setAlmuerzosFecha)
  const [loadingAlmuerzosFecha, setLoadingAlmuerzosFecha] = useState(false)

  useEffect(() => {
    const getAlmuerzosFecha = async () => {
      try {
        setLoadingAlmuerzosFecha(true)

        const response = await api.get('/almuerzos/fecha')

        if (response.data === null) return

        setAlmuerzosFecha(response.data.almuerzosFecha as AlmuerzosFecha)
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingAlmuerzosFecha(false)
      }
    }

    getAlmuerzosFecha()
  }, [])

  return { almuerzosFecha, loadingAlmuerzosFecha, setAlmuerzosFecha }
}
