import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type AlmuerzosReservados } from '@/types/almuerzos'
import { useAlmuerzosStore } from '@/store/almuerzos'

export const useAlmuerzosReservados = ({ nextDate }: { nextDate: string }) => {
  const almuerzosReservados = useAlmuerzosStore(state => state.almuerzosReservados)
  const setAlmuerzosReservados = useAlmuerzosStore(state => state.setAlmuerzosReservados)
  const [loadingAlmuerzosReservados, setLoadingAlmuerzosReservados] = useState(false)

  useEffect(() => {
    const getAlmuerzosReservados = async () => {
      try {
        setLoadingAlmuerzosReservados(true)

        const response = await api.get(`/almuerzos/${nextDate}`)

        if (response.data === null) return

        const idAlmuerzo = response.data.id_almuerzo

        const response2 = await api.get(`/almuerzos/reservas/${idAlmuerzo}`)
        const almuerzosReservados = response2.data

        setAlmuerzosReservados(almuerzosReservados as AlmuerzosReservados)
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingAlmuerzosReservados(false)
      }
    }

    getAlmuerzosReservados()
  }, [])

  return { almuerzosReservados, loadingAlmuerzosReservados }
}
