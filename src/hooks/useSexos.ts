import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { type Sexos } from '@/types/sexos'

export default function useSexos () {
  const [sexos, setSexos] = useState<Sexos[]>([])
  const [loadingSexos, setLoadingSexos] = useState(false)

  useEffect(() => {
    const getSexos = async () => {
      try {
        setLoadingSexos(true)

        const response = await api.get('/sexos')
        setSexos(response.data as Sexos[])
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
