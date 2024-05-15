import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type Administrador } from '@/types/administradores'

export const useEmailsAdmin = () => {
  const [emailsAdmin, setEmailsAdmin] = useState<string[]>([])
  const [loadingEmailsAdmin, setLoadingEmailsAdmin] = useState(false)

  useEffect(() => {
    const getEmailsAdmin = async () => {
      try {
        setLoadingEmailsAdmin(true)

        const response = await api.get('/administradores')
        const emails: string[] = response.data.map((admin: Administrador) => admin.correo)

        setEmailsAdmin(emails)
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
