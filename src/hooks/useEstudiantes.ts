import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { useEstudianteStore } from '@/store/estudiantes'
import { type Estudiante } from '@/types/estudiantes'

export const useEstudiantes = () => {
  const estudiantes = useEstudianteStore(state => state.estudiantes)
  const setEstudiantes = useEstudianteStore(state => state.setEstudiantes)
  const [loadingEstudiantes, setLoadingEstudiantes] = useState(false)

  useEffect(() => {
    const getEmailsEmpleados = async () => {
      try {
        setLoadingEstudiantes(true)

        const response = await api.get('/estudiantes')

        setEstudiantes(response.data as Estudiante[])
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingEstudiantes(false)
      }
    }

    getEmailsEmpleados()
  }, [])

  return { estudiantes, setEstudiantes, loadingEstudiantes }
}
