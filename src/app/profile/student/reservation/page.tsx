import { currentUser, auth } from '@clerk/nextjs'
import { type Empleado } from '@/types/empleados'
import { redirect } from 'next/navigation'
import { ReserveLunch } from './_components/ReserveLunch'
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

export default async function ReservationPage () {
  const auth2 = auth()
  const baseURL = auth2.sessionClaims?.azp ?? URL_LOCALHOST
  const user = await currentUser()
  const employeeEmails = await getEmployeeEmails({ baseURL })
  const isEmployee = user !== null && employeeEmails.includes(user.emailAddresses[0].emailAddress)

  if (isEmployee) redirect('/profile/employee/home')

  const { nextDate, nextFullDate } = getNextDate()

  return (
    <div className='h-screen pt-20 pb-8 px-5'>
      <h1 className='flex items-center justify-center flex-wrap text-4xl font-extrabold tracking-tighter gap-2'>
        Reservas de
        <span className='relative bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] animate-color-cycle-5'>Almuerzos</span>
      </h1>
      <ReserveLunch
        nextDate={nextDate}
        nextFullDate={nextFullDate}
      />
    </div>
  )
}
