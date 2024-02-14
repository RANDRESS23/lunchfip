import { currentUser, auth } from '@clerk/nextjs'
import { type Empleado } from '@/types/empleados'
import { redirect } from 'next/navigation'
import { StudentInfo } from './_components/StudentInfo'

const URL_LOCALHOST = 'http://localhost:3000'

const getEmployeeEmails = async ({ baseURL }: { baseURL: string }) => {
  let employeeEmails: string[] = []

  try {
    const response = await fetch(`${baseURL}/api/empleados`)
    const data = await response.json()

    const emails: string[] = data.map((empleado: Empleado) => empleado.correo)

    employeeEmails = emails
  } catch (error) {
    console.log(error)
  }

  return employeeEmails
}

export default async function InfoPage () {
  const auth2 = auth()
  const baseURL = auth2.sessionClaims?.azp ?? URL_LOCALHOST
  const user = await currentUser()
  const employeeEmails = await getEmployeeEmails({ baseURL })
  const isEmployee = user !== null && employeeEmails.includes(user.emailAddresses[0].emailAddress)

  if (isEmployee) redirect('/profile/employee/home')

  return (
    <div className='h-screen pt-20 pb-8 px-5'>
      <StudentInfo />
    </div>
  )
}
