import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { useEstudianteStore } from '@/store/estudiantes'
import { type Estudiante } from '@/types/estudiantes'

export const useEstudiantes = ({ page, rows }: { page: string, rows: string }) => {
  const estudiantes = useEstudianteStore(state => state.estudiantes)
  const setEstudiantes = useEstudianteStore(state => state.setEstudiantes)
  const estudiantesCount = useEstudianteStore(state => state.estudiantesCount)
  const setEstudiantesCount = useEstudianteStore(state => state.setEstudiantesCount)
  const [loadingEstudiantes, setLoadingEstudiantes] = useState(false)

  useEffect(() => {
    const getEmailsEmpleados = async () => {
      try {
        setLoadingEstudiantes(true)

        const response = await api.get(`/estudiantes/?page=${page}&rows=${rows}`)

        setEstudiantes(response.data.estudiantes as Estudiante[])
        setEstudiantesCount(response.data.estudiantesCount as number)
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingEstudiantes(false)
      }
    }

    getEmailsEmpleados()
  }, [page])

  return { estudiantes, estudiantesCount, loadingEstudiantes, setEstudiantes }
}
