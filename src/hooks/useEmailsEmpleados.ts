import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type Empleado } from '@/types/empleados'

export const useEmailsEmpleados = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [emailsEmpleados, setEmailsEmpleados] = useState<string[]>([])
  const [loadingEmailsEmpleados, setLoadingEmailsEmpleados] = useState(false)

  useEffect(() => {
    const getEmailsEmpleados = async () => {
      try {
        setLoadingEmailsEmpleados(true)

        const response = await api.get('/empleados')
        const emails: string[] = response.data.map((empleado: Empleado) => empleado.correo)

        setEmpleados(response.data as Empleado[])
        setEmailsEmpleados(emails)
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingEmailsEmpleados(false)
      }
    }

    getEmailsEmpleados()
  }, [])

  return { empleados, emailsEmpleados, loadingEmailsEmpleados }
}
