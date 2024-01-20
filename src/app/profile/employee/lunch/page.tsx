import { currentUser, auth } from '@clerk/nextjs'
import { type Empleado } from '@/types/empleados'
import { redirect } from 'next/navigation'
import { DefineLunches } from './_components/DefineLunches'
import { TablesDefineLunches } from './_components/TablesDefineLunches'
import getNextDate from '@/libs/nextDate'

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

export default async function LunchPage () {
  const auth2 = auth()
  const baseURL = auth2.sessionClaims?.azp ?? URL_LOCALHOST
  const user = await currentUser()
  const employeeEmails = await getEmployeeEmails({ baseURL })
  const isEmployee = user !== null && employeeEmails.includes(user.emailAddresses[0].emailAddress)

  if (!isEmployee) redirect('/profile/student/home')

  const { nextDate, nextFullDate } = getNextDate()

  return (
    <div className='lg:ml-[290px] pt-24 pb-7 mr-8 flex gap-28 h-screen'>
      <DefineLunches
        nextDate={nextDate}
        nextFullDate={nextFullDate}
      />
      <TablesDefineLunches
        nextDate={nextDate}
      />
    </div>
  )
}
