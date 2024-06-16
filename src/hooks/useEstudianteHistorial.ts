import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { useEstudianteStore } from '@/store/estudiantes'
import { type EstudianteHistorialRecargas, type EstudianteHistorialReservas } from '@/types/estudiantes'

/* ➡ Hook para manejar los datos del historial de reservas y recargas del estudiante */
export const useEstudianteHistorial = ({ idEstudiante, page, rows }: { idEstudiante: string, page: string, rows: string }) => {
  const estudianteHistorialReservas = useEstudianteStore(state => state.estudianteHistorialReservas)
  const setEstudianteHistorialReservas = useEstudianteStore(state => state.setEstudianteHistorialReservas)
  const estudianteHistorialReservasCount = useEstudianteStore(state => state.estudianteHistorialReservasCount)
  const setEstudianteHistorialReservasCount = useEstudianteStore(state => state.setEstudianteHistorialReservasCount)
  const estudianteHistorialRecargas = useEstudianteStore(state => state.estudianteHistorialRecargas)
  const setEstudianteHistorialRecargas = useEstudianteStore(state => state.setEstudianteHistorialRecargas)
  const estudianteHistorialRecargasCount = useEstudianteStore(state => state.estudianteHistorialRecargasCount)
  const setEstudianteHistorialRecargasCount = useEstudianteStore(state => state.setEstudianteHistorialRecargasCount)
  const [loadingEstudianteHistorial, setLoadingEstudianteHistorial] = useState(false)

  useEffect(() => {
    const getEstudiantes = async () => {
      try {
        setLoadingEstudianteHistorial(true)

        const response = await api.get(`/estudiantes/historial/${idEstudiante}/?page=${page}&rows=${rows}`)

        setEstudianteHistorialReservas(response.data.estudianteHistorialReservas as EstudianteHistorialReservas[])
        setEstudianteHistorialReservasCount(response.data.estudianteHistorialReservasCount as number)
        setEstudianteHistorialRecargas(response.data.estudianteHistorialRecargas as EstudianteHistorialRecargas[])
        setEstudianteHistorialRecargasCount(response.data.estudianteHistorialRecargasCount as number)
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingEstudianteHistorial(false)
      }
    }

    getEstudiantes()
  }, [idEstudiante, page, rows])

  return { estudianteHistorialReservas, estudianteHistorialReservasCount, estudianteHistorialRecargas, estudianteHistorialRecargasCount, loadingEstudianteHistorial }
}
