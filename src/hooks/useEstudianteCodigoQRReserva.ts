import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { useEstudianteStore } from '@/store/estudiantes'
import { type Estudiante } from '@/types/estudiantes'

/* ➡ Hook para manejar el codigo QR de reserva del estudiante */
export const useEstudianteCodigoQRReserva = ({ estudiante, idAlmuerzo }: { estudiante: Estudiante, idAlmuerzo: string }) => {
  const codigoQRReserva = useEstudianteStore(state => state.codigoQRReserva)
  const setCodigoQRReserva = useEstudianteStore(state => state.setCodigoQRReserva)
  const [loadingCodigoQRReserva, setLoadingCodigoQRReserva] = useState(false)

  useEffect(() => {
    const getCodigoQRReserva = async () => {
      try {
        setLoadingCodigoQRReserva(true)

        if (!estudiante.id_estudiante || !idAlmuerzo) return

        const response = await api.post('/estudiantes/codigo-qr-reserva', {
          id_estudiante: estudiante.id_estudiante,
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
  }, [estudiante, idAlmuerzo])

  return { codigoQRReserva, loadingCodigoQRReserva }
}
