import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { useEstudianteStore } from '@/store/estudiantes'
import { type Estudiante } from '@/types/estudiantes'

export const useEstudiantes = ({ page, rows }: { page: string, rows: string }) => {
  const estudiantes = useEstudianteStore(state => state.estudiantes)
  const setEstudiantes = useEstudianteStore(state => state.setEstudiantes)
  const totalEstudiantes = useEstudianteStore(state => state.totalEstudiantes)
  const setTotalEstudiantes = useEstudianteStore(state => state.setTotalEstudiantes)
  const estudiantesCount = useEstudianteStore(state => state.estudiantesCount)
  const setEstudiantesCount = useEstudianteStore(state => state.setEstudiantesCount)
  const [loadingEstudiantes, setLoadingEstudiantes] = useState(false)
  const [loadingTotalEstudiantes, setLoadingTotalEstudiantes] = useState(false)

  useEffect(() => {
    const getEstudiantes = async () => {
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

    getEstudiantes()
  }, [page, rows])

  useEffect(() => {
    const getTotalEstudiantes = async () => {
      try {
        setLoadingTotalEstudiantes(true)

        const response = await api.get('/estudiantes/total')

        setTotalEstudiantes(response.data.totalEstudiantes as Estudiante[])
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingTotalEstudiantes(false)
      }
    }

    getTotalEstudiantes()
  }, [])

  return { estudiantes, estudiantesCount, loadingEstudiantes, totalEstudiantes, loadingTotalEstudiantes, setEstudiantes }
}
