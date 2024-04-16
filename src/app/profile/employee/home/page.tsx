import { currentUser, auth } from '@clerk/nextjs'
import { type Empleado } from '@/types/empleados'
import { redirect } from 'next/navigation'
import { BgParticles } from './_components/BgParticles'
import { WelcomeEmployee } from './_components/WelcomeEmployee'
import { type Metadata } from 'next'

const URL_LOCALHOST = 'http://localhost:3000'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Inicio'
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

export default async function HomePage () {
  const auth2 = auth()
  const baseURL = auth2.sessionClaims?.azp ?? URL_LOCALHOST
  const user = await currentUser()
  const employeeEmails = await getEmployeeEmails({ baseURL })
  const isEmployee = user !== null && employeeEmails.includes(user.emailAddresses[0].emailAddress)

  if (!isEmployee) redirect('/profile/student/home')

  return (
    <div className='lg:ml-[290px] h-screen relative px-9 pr-9 font-inter-sans flex flex-col items-center justify-center'>
      <BgParticles />
      <WelcomeEmployee />
    </div>
  )
}
