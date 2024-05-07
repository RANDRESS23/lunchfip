import { currentUser, auth } from '@clerk/nextjs'
import { type Empleado } from '@/types/empleados'
import { redirect } from 'next/navigation'
import { ReserveLunch } from './_components/ReserveLunch'
import getNextDate from '@/libs/nextDate'
import { TitleAnimated } from '@/components/TitleAnimated'
import { type Metadata } from 'next'

const URL_LOCALHOST = 'http://localhost:3000'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Reservas'
  }
}

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
    <div className='container mx-auto py-[90px] px-6'>
      <TitleAnimated
        text1='Reservar mi'
        text2='Almuerzo'
        textSize='text-4xl lg:text-5xl'
      />
      <p className='w-full z-10 -mt-2 text-center text-p-light dark:text-p-dark'>Puedes reservar tu almuerzo con anticipo si cuentas con el saldo suficiente.</p>
      <ReserveLunch
        nextDate={nextDate}
        nextFullDate={nextFullDate}
      />
    </div>
  )
}
