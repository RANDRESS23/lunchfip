import { redirect } from 'next/navigation'
import { TabSections } from './_components/TabSections'
import { TitleAnimated } from '@/components/TitleAnimated'
import { type Metadata } from 'next'
import getNextDate from '@/libs/nextDate'
import { TablesDefineLunches } from '@/components/TablesLunch/TablesDefineLunches'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { getAdminEmails } from '@/services/getAdminEmails'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Recargar Saldo'
  }
}

export default async function RechargePage () {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const employeeEmails = await getEmployeeEmails()
  const adminEmails = await getAdminEmails()
  const isEmployee = employeeEmails.includes(data?.user?.email ?? '')
  const isAdmin = adminEmails.includes(data?.user?.email ?? '')

  if (!data.user) return redirect('/')
  if (isAdmin) return redirect('/profile/admin/home')
  if (!isEmployee) return redirect('/profile/student/home')

  const { nextDate, nextFullDate } = getNextDate()

  return (
    <div className='lg:ml-[290px] pt-24 pb-10 h-screen relative pr-9 font-inter-sans bg-grid-small-black dark:bg-grid-small-white flex flex-col items-center'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <TitleAnimated
        text1='Recargar'
        text2='Saldo'
        isTextLeft
      />
      <p className='w-full z-10 -mt-3 mb-5 text-p-light dark:text-p-dark'>Recargar saldo a estudiante mediante su códigos QR personal o número de documento.</p>
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
