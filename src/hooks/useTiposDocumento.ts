import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { type TiposDocumento } from '@/types/tiposDocumento'

export default function useTiposDocumento () {
  const [tiposDocumento, setTiposDocumento] = useState<TiposDocumento[]>([])
  const [loadingTiposDocumento, setLoadingTiposDocumento] = useState(false)

  useEffect(() => {
    const getTiposDocumento = async () => {
      try {
        setLoadingTiposDocumento(true)

        const response = await api.get('/tipos-documento')
        setTiposDocumento(response.data as TiposDocumento[])
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingTiposDocumento(false)
      }
    }

    getTiposDocumento()
  }, [])

  return { tiposDocumento, loadingTiposDocumento }
}
