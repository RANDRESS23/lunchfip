import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type Facultad } from '@/types/facultades'

export default function useFacultades () {
  const [facultades, setFacultades] = useState<Facultad[]>([])
  const [loadingFacultades, setLoadingFacultades] = useState(false)

  useEffect(() => {
    const getFacultades = async () => {
      try {
        setLoadingFacultades(true)

        const response = await api.get('/facultades')
        setFacultades(response.data as Facultad[])
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingFacultades(false)
      }
    }

    getFacultades()
  }, [])

  return { facultades, loadingFacultades }
}
