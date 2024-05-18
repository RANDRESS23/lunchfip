import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type Empleado } from '@/types/empleados'
import { useEmpleadoStore } from '@/store/empleados'

export const useEmailsEmpleados = () => {
  const empleados = useEmpleadoStore(state => state.empleados)
  const setEmpleados = useEmpleadoStore(state => state.setEmpleados)
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

  return { empleados, setEmpleados, emailsEmpleados, loadingEmailsEmpleados }
}
