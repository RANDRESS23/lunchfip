import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { useEstudianteStore } from '@/store/estudiantes'

export const useEstudianteCodigoQRReserva = ({ idEstudiante, idAlmuerzo }: { idEstudiante: string, idAlmuerzo: string }) => {
  const codigoQRReserva = useEstudianteStore(state => state.codigoQRReserva)
  const setCodigoQRReserva = useEstudianteStore(state => state.setCodigoQRReserva)
  const [loadingCodigoQRReserva, setLoadingCodigoQRReserva] = useState(false)

  useEffect(() => {
    const getCodigoQRReserva = async () => {
      try {
        setLoadingCodigoQRReserva(true)

        const response = await api.post('/estudiantes/codigo-qr-reserva', {
          id_estudiante: idEstudiante,
          id_almuerzo: idAlmuerzo
        })

        if (response.data === null) return

        setCodigoQRReserva(response.data.codigoQRReserva as string)
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingCodigoQRReserva(false)
      }
    }

    getCodigoQRReserva()
  }, [idEstudiante, idAlmuerzo])

  return { codigoQRReserva, loadingCodigoQRReserva }
}
