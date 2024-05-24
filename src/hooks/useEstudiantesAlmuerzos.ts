import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { useEstudianteStore } from '@/store/estudiantes'
import { type EstudianteAlmuerzo } from '@/types/estudiantes'

export const useEstudiantesAlmuerzos = ({ fecha, page, rows }: { fecha: string, page: string, rows: string }) => {
  const todayDate = new Date(fecha)
  todayDate.setDate(todayDate.getDate() + 1)

  const estudiantesAlmuerzos = useEstudianteStore(state => state.estudiantesAlmuerzos)
  const setEstudiantesAlmuerzos = useEstudianteStore(state => state.setEstudiantesAlmuerzos)
  const estudiantesAlmuerzosCount = useEstudianteStore(state => state.estudiantesAlmuerzosCount)
  const setEstudiantesAlmuerzosCount = useEstudianteStore(state => state.setEstudiantesAlmuerzosCount)
  const [loadingEstudiantesAlmuerzos, setLoadingEstudiantesAlmuerzos] = useState(false)

  useEffect(() => {
    const getEstudiantesAlmuerzos = async () => {
      try {
        setLoadingEstudiantesAlmuerzos(true)

        const response = await api.get(`/estudiantes/almuerzos/${todayDate.toString()}/?page=${page}&rows=${rows}`)

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

  return { estudiantesAlmuerzos, estudiantesAlmuerzosCount, loadingEstudiantesAlmuerzos, setEstudiantesAlmuerzos }
}
