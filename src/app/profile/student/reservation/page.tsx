import { redirect } from 'next/navigation'
import { ReserveLunch } from './_components/ReserveLunch'
import getNextDate from '@/libs/nextDate'
import { TitleAnimated } from '@/components/TitleAnimated'
import { type Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { getAdminEmails } from '@/services/getAdminEmails'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Reservas'
  }
}

export default async function ReservationPage () {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const employeeEmails = await getEmployeeEmails()
  const adminEmails = await getAdminEmails()
  const isEmployee = employeeEmails.includes(data?.user?.email ?? '')
  const isAdmin = adminEmails.includes(data?.user?.email ?? '')

  if (!data.user) return redirect('/')
  if (isEmployee) return redirect('/profile/employee/home')
  if (isAdmin) return redirect('/profile/admin/home')

  const { isValidHourToReserve, isValidHourToDelivery, isValidHourToDeliveryStats } = getNextDate()

  return (
    <div className='container mx-auto py-[90px] px-6 font-inter-sans'>
      <TitleAnimated
        text1='Reservar mi'
        text2='Almuerzo'
        textSize='text-4xl lg:text-[42px]'
      />
      <p className='w-full z-10 -mt-2 text-center text-p-light dark:text-p-dark'>Puedes reservar tu almuerzo con anticipo si cuentas con el saldo suficiente, o por otro lado, visualizar tu código QR de reserva.</p>
      <ReserveLunch
        isValidHourToReserve={isValidHourToReserve}
        isValidHourToDelivery={isValidHourToDelivery}
        isValidHourToDeliveryStats={isValidHourToDeliveryStats}
      />
    </div>
  )
}
