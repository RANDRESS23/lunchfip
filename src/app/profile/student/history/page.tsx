import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { TitleAnimated } from '@/components/TitleAnimated'
import { type Metadata } from 'next'
import { getAdminEmails } from '@/services/getAdminEmails'
import { TabSections } from './_components/TabSections'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Historial'
  }
}

export default async function HistoryPage () {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const employeeEmails = await getEmployeeEmails()
  const adminEmails = await getAdminEmails()
  const isEmployee = employeeEmails.includes(data?.user?.email ?? '')
  const isAdmin = adminEmails.includes(data?.user?.email ?? '')

  if (!data.user) return redirect('/')
  if (isEmployee) return redirect('/profile/employee/home')
  if (isAdmin) return redirect('/profile/admin/home')

  return (
    <div className='container md:w-2/4 mx-auto py-[90px] px-6 font-inter-sans'>
      <TitleAnimated
        text1='Mi'
        text2='Historial'
        textSize='text-4xl lg:text-[42px]'
      />
      <p className='w-full z-10 -mt-2 text-center text-p-light dark:text-p-dark'>Puedes visualizar tanto tu historial de las reservas que has realizado, así como también aquellas recargas que hayas hecho.</p>
      <TabSections />
    </div>
  )
}
