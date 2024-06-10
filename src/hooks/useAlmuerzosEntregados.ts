import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type AlmuerzosEntregados } from '@/types/almuerzos'
import { useAlmuerzosStore } from '@/store/almuerzos'
import { format } from '@formkit/tempo'

export const useAlmuerzosEntregados = ({ nextDate }: { nextDate: string }) => {
  const fechaAux = new Date(nextDate?.toString() ?? new Date().toString())
  const fechaAux2 = new Date(fechaAux.setDate(fechaAux.getDate() + 1))
  const fecha = format(fechaAux2, 'YYYY-MM-DD')

  const almuerzosEntregados = useAlmuerzosStore(state => state.almuerzosEntregados)
  const setAlmuerzosEntregados = useAlmuerzosStore(state => state.setAlmuerzosEntregados)
  const [loadingAlmuerzosEntregados, setLoadingAlmuerzosEntregados] = useState(false)

  useEffect(() => {
    const getAlmuerzosEntregados = async () => {
      try {
        setLoadingAlmuerzosEntregados(true)

        const response = await api.get(`/almuerzos/${fecha}`)

        if (response.data === null) return

        const idAlmuerzo = response.data.id_almuerzo

        const response2 = await api.get(`/almuerzos/entregas/${idAlmuerzo}`)
        const almuerzosEntregados = response2.data

        setAlmuerzosEntregados(almuerzosEntregados as AlmuerzosEntregados)
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingAlmuerzosEntregados(false)
      }
    }

    getAlmuerzosEntregados()
  }, [nextDate])

  return { almuerzosEntregados, loadingAlmuerzosEntregados, setAlmuerzosEntregados }
}
