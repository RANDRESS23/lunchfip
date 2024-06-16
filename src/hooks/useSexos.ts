import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type Sexo } from '@/types/sexos'

/* ➡ Hook para manejar los datos de los sexos de los estudiantes */
export const useSexos = () => {
  const [sexos, setSexos] = useState<Sexo[]>([])
  const [loadingSexos, setLoadingSexos] = useState(false)

  useEffect(() => {
    const getSexos = async () => {
      try {
        setLoadingSexos(true)

        const response = await api.get('/sexos')
        setSexos(response.data as Sexo[])
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingSexos(false)
      }
    }

    getSexos()
  }, [])

  return { sexos, loadingSexos }
}
