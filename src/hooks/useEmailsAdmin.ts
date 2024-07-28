import { useState, useEffect } from 'react'
import api from '@/libs/api'

/* ➡ Hook para manejar los emails de los administradores */
export const useEmailsAdmin = () => {
  const [emailsAdmin, setEmailsAdmin] = useState<string[]>([])
  const [loadingEmailsAdmin, setLoadingEmailsAdmin] = useState(false)

  useEffect(() => {
    const getEmailsAdmin = async () => {
      try {
        setLoadingEmailsAdmin(true)

        const response = await api.get('/administradores')

        setEmailsAdmin(response?.data?.emailsAdministradores as string[])
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingEmailsAdmin(false)
      }
    }

    getEmailsAdmin()
  }, [])

  return { emailsAdmin, loadingEmailsAdmin }
}
