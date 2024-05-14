import api from '@/libs/api'
import { type Empleado } from '@/types/empleados'

export const getEmployeeEmails = async () => {
  let employeeEmails: string[] = []

  try {
    const { data } = await api.get('/empleados')
    const emails: string[] = data.map((empleado: Empleado) => empleado.correo)

    employeeEmails = emails
  } catch (error) {
    console.log(error)
  }

  return employeeEmails
}
