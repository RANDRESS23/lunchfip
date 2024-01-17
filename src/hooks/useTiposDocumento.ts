import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type TipoDocumento } from '@/types/tiposDocumento'

export default function useTiposDocumento () {
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([])
  const [loadingTiposDocumento, setLoadingTiposDocumento] = useState(false)

  useEffect(() => {
    const getTiposDocumento = async () => {
      try {
        setLoadingTiposDocumento(true)

        const response = await api.get('/tipos-documento')
        setTiposDocumento(response.data as TipoDocumento[])
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
