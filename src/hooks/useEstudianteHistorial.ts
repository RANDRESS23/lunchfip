import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { useEstudianteStore } from '@/store/estudiantes'
import { type EstudianteHistorialReservas } from '@/types/estudiantes'

export const useEstudianteHistorial = ({ idEstudiante, page, rows }: { idEstudiante: string, page: string, rows: string }) => {
  const estudianteHistorialReservas = useEstudianteStore(state => state.estudianteHistorialReservas)
  const setEstudianteHistorialReservas = useEstudianteStore(state => state.setEstudianteHistorialReservas)
  const estudianteHistorialReservasCount = useEstudianteStore(state => state.estudianteHistorialReservasCount)
  const setEstudianteHistorialReservasCount = useEstudianteStore(state => state.setEstudianteHistorialReservasCount)
  const [loadingEstudianteHistorial, setLoadingEstudianteHistorial] = useState(false)

  useEffect(() => {
    const getEstudiantes = async () => {
      try {
        setLoadingEstudianteHistorial(true)

        const response = await api.get(`/estudiantes/historial/${idEstudiante}/?page=${page}&rows=${rows}`)

        setEstudianteHistorialReservas(response.data.estudianteHistorialReservas as EstudianteHistorialReservas[])
        setEstudianteHistorialReservasCount(response.data.estudianteHistorialReservasCount as number)
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingEstudianteHistorial(false)
      }
    }

    getEstudiantes()
  }, [idEstudiante, page, rows])

  return { estudianteHistorialReservas, estudianteHistorialReservasCount, loadingEstudianteHistorial }
}
