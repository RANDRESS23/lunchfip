import { useState, useEffect } from 'react'
import api from '@/libs/api'

/* ➡ Hook para manejar los emails de los empleados */
export const useEmailsEmployee = () => {
  const [emailsEmployee, setEmailsEmployee] = useState<string[]>([])
  const [loadingEmailsEmployee, setLoadingEmailsEmployee] = useState(false)

  useEffect(() => {
    const getEmailsEmployee = async () => {
      try {
        setLoadingEmailsEmployee(true)

        const response = await api.get('/empleados/emails')

        setEmailsEmployee(response?.data?.emailsEmpleados as string[])
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingEmailsEmployee(false)
      }
    }

    getEmailsEmployee()
  }, [])

  return { emailsEmployee, loadingEmailsEmployee }
}
