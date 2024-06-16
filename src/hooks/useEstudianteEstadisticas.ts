import api from '@/libs/api'
import { useState, useEffect } from 'react'

interface useEstudianteEstadisticasProps {
  idEstudiante: string
}

/* ➡ Hook para manejar los datos de las estadisticas de los estudiantes */
export const useEstudianteEstadisticas = ({ idEstudiante }: useEstudianteEstadisticasProps) => {
  const [studentStats, setStudentStats] = useState<Record<string, string | number>>({})
  const [loadingStudentStats, setLoadingStudentStats] = useState(false)

  useEffect(() => {
    const getStudentStats = async () => {
      try {
        setLoadingStudentStats(true)

        const response = await api.get(`/estudiantes/estadisticas/${idEstudiante}`)

        const { message: _, ...stats }: Record<string, string | number> = response.data

        setStudentStats(stats)
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingStudentStats(false)
      }
    }

    getStudentStats()
  }, [idEstudiante])

  return {
    cantidadReservas: studentStats.cantidadReservas,
    cantidadReclamados: studentStats.cantidadReclamados,
    cantidadSinReclamar: studentStats.cantidadSinReclamar,
    cantidadRecargas: studentStats.cantidadRecargas,
    fechaUltimaReserva: studentStats.fechaUltimaReserva,
    fechaUltimoReclamo: studentStats.fechaUltimoReclamo,
    fechaUltimaRecarga: studentStats.fechaUltimaRecarga,
    loadingStudentStats
  }
}

export default useEstudianteEstadisticas
