import { redirect } from 'next/navigation'
import { ReserveLunch } from './_components/ReserveLunch'
import getNextDate from '@/libs/nextDate'
import { TitleAnimated } from '@/components/TitleAnimated'
import { type Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Reservas'
  }
}

export default async function ReservationPage () {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const employeeEmails = await getEmployeeEmails()
  const isEmployee = employeeEmails.includes(data?.user?.email ?? '')

  if (!data.user) redirect('/')
  if (isEmployee) redirect('/profile/employee/home')

  const { nextDate, nextFullDate } = getNextDate()

  return (
    <div className='container mx-auto py-[90px] px-6'>
      <TitleAnimated
        text1='Reservar mi'
        text2='Almuerzo'
        textSize='text-4xl lg:text-[42px]'
      />
      <p className='w-full z-10 -mt-2 text-center text-p-light dark:text-p-dark'>Puedes reservar tu almuerzo con anticipo si cuentas con el saldo suficiente.</p>
      <ReserveLunch
        nextDate={nextDate}
        nextFullDate={nextFullDate}
      />
    </div>
  )
}
