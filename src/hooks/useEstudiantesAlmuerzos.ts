import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { useEstudianteStore } from '@/store/estudiantes'
import { type EstudianteAlmuerzo } from '@/types/estudiantes'
import { format } from '@formkit/tempo'

/* ➡ Hook para manejar los datos de los almuerzos de los estudiantes */
export const useEstudiantesAlmuerzos = ({ fecha, page, rows }: { fecha: string, page: string, rows: string }) => {
  const fechaAux = new Date(fecha ?? new Date().toString())
  const fechaAux2 = new Date(fechaAux.setDate(fechaAux.getDate() + 1))
  const fechaFinal = format(fechaAux2, 'YYYY-MM-DD')

  const estudiantesAlmuerzos = useEstudianteStore(state => state.estudiantesAlmuerzos)
  const setEstudiantesAlmuerzos = useEstudianteStore(state => state.setEstudiantesAlmuerzos)
  const totalEstudiantesAlmuerzos = useEstudianteStore(state => state.totalEstudiantesAlmuerzos)
  const setTotalEstudiantesAlmuerzos = useEstudianteStore(state => state.setTotalEstudiantesAlmuerzos)
  const estudiantesAlmuerzosCount = useEstudianteStore(state => state.estudiantesAlmuerzosCount)
  const setEstudiantesAlmuerzosCount = useEstudianteStore(state => state.setEstudiantesAlmuerzosCount)
  const [loadingEstudiantesAlmuerzos, setLoadingEstudiantesAlmuerzos] = useState(false)
  const [loadingTotalEstudiantesAlmuerzos, setLoadingTotalEstudiantesAlmuerzos] = useState(false)

  useEffect(() => {
    const getEstudiantesAlmuerzos = async () => {
      try {
        setLoadingEstudiantesAlmuerzos(true)

        const response = await api.get(`/estudiantes/almuerzos/${fechaFinal}/?page=${page}&rows=${rows}`)

        setEstudiantesAlmuerzos(response.data.estudiantesAlmuerzos as EstudianteAlmuerzo[])
        setEstudiantesAlmuerzosCount(response.data.estudiantesAlmuerzosCount as number)
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingEstudiantesAlmuerzos(false)
      }
    }

    getEstudiantesAlmuerzos()
  }, [page, rows, fecha])

  useEffect(() => {
    const getTotalEstudiantesAlmuerzos = async () => {
      try {
        setLoadingTotalEstudiantesAlmuerzos(true)

        const response = await api.get(`/estudiantes/almuerzos/total/${fechaFinal}`)

        setTotalEstudiantesAlmuerzos(response.data.totalEstudiantesAlmuerzos as EstudianteAlmuerzo[])
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingTotalEstudiantesAlmuerzos(false)
      }
    }

    getTotalEstudiantesAlmuerzos()
  }, [fecha])

  return { estudiantesAlmuerzos, estudiantesAlmuerzosCount, loadingEstudiantesAlmuerzos, loadingTotalEstudiantesAlmuerzos, totalEstudiantesAlmuerzos, setEstudiantesAlmuerzos }
}
