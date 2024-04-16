import { currentUser, auth } from '@clerk/nextjs'
import { type Empleado } from '@/types/empleados'
import { redirect } from 'next/navigation'
import { TabSections } from './_components/TabSections'
import { TitleAnimated } from '@/components/TitleAnimated'
import { type Metadata } from 'next'
import getNextDate from '@/libs/nextDate'
import { TablesDefineLunches } from '@/components/TablesLunch/TablesDefineLunches'

const URL_LOCALHOST = 'http://localhost:3000'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Entregar Almuerzo'
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

export default async function ReservePage () {
  const auth2 = auth()
  const baseURL = auth2.sessionClaims?.azp ?? URL_LOCALHOST
  const user = await currentUser()
  const employeeEmails = await getEmployeeEmails({ baseURL })
  const isEmployee = user !== null && employeeEmails.includes(user.emailAddresses[0].emailAddress)

  if (!isEmployee) redirect('/profile/student/home')

  const { nextDate, nextFullDate } = getNextDate()

  return (
    <div className='lg:ml-[290px] pt-24 pb-10 h-screen relative pr-9 font-inter-sans bg-grid-small-black dark:bg-grid-small-white flex flex-col items-center'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <TitleAnimated
        text1='Entregar'
        text2='Almuerzo'
        isTextLeft
      />
      <p className='w-full z-10 -mt-3 mb-5 text-p-light dark:text-p-dark'>Entregar almuerzo a estudiante mediante su códigos QR personal o número de documento.</p>
      <div className='w-full flex gap-10'>
        <div className='w-3/5'>
          <TabSections />
        </div>
        <div className='w-2/5'>
          <TablesDefineLunches
            nextDate={nextDate}
            nextFullDate={nextFullDate}
          />
        </div>
      </div>
    </div>
  )
}
