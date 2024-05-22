import api from '@/libs/api'
import { type Empleado } from '@/types/empleados'

export const getEmployeeEmails = async () => {
  let employeeEmails: string[] = []

  try {
    const response = await api.get(`/empleados/?page=${1}&rows=${10}`)
    const emails: string[] = response.data.totalEmpleados.map((empleado: Empleado) => empleado.correo)

    employeeEmails = emails
  } catch (error) {
    console.log(error)
  }

  return employeeEmails
}
