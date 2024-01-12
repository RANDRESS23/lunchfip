import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type Programa } from '@/types/programas'

export default function useProgramas () {
  const [programas, setProgramas] = useState<Programa[]>([])
  const [loadingProgramas, setLoadingProgramas] = useState(false)

  useEffect(() => {
    const getProgramas = async () => {
      try {
        setLoadingProgramas(true)

        const response = await api.get('/programas')
        setProgramas(response.data as Programa[])
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingProgramas(false)
      }
    }

    getProgramas()
  }, [])

  return { programas, loadingProgramas }
}
