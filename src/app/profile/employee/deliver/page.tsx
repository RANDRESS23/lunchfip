import { currentUser, auth } from '@clerk/nextjs'
import { type Empleado } from '@/types/empleados'
import { redirect } from 'next/navigation'
import { TabSections } from './_components/TabSections'

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

export default async function ReservePage () {
  const auth2 = auth()
  const baseURL = auth2.sessionClaims?.azp ?? URL_LOCALHOST
  const user = await currentUser()
  const employeeEmails = await getEmployeeEmails({ baseURL })
  const isEmployee = user !== null && employeeEmails.includes(user.emailAddresses[0].emailAddress)

  if (!isEmployee) redirect('/profile/student/home')

  return (
    <div className='lg:ml-[290px] pt-24 pb-10 h-screen relative pr-9'>
      <h1 className='flex items-center flex-wrap text-4xl font-extrabold tracking-tighter gap-2'>
        Entregar
        <span className='relative bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] animate-color-cycle-5'>Almuerzo</span>
      </h1>
      <TabSections />
    </div>
  )
}
