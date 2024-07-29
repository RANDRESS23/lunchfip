import api from '@/libs/api'

/* ➡ Función para obtener los emails de todos los empleados */
export const getEmployeeEmails = async () => {
  let employeeEmails: string[] = []

  try {
    const { data: { emailsEmpleados } } = await api.get('/empleados/emails')

    employeeEmails = emailsEmpleados
  } catch (error) {
    console.log(error)
  }

  return employeeEmails
}
