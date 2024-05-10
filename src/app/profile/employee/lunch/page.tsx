import { redirect } from 'next/navigation'
import { DefineLunches } from './_components/DefineLunches'
import { TablesDefineLunches } from './_components/TablesDefineLunches'
import getNextDate from '@/libs/nextDate'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { type Metadata } from 'next'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Definir Almuerzos'
  }
}

export default async function LunchPage () {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const employeeEmails = await getEmployeeEmails()
  const isEmployee = employeeEmails.includes(data?.user?.email ?? '')

  if (!data.user) redirect('/')
  if (!isEmployee) redirect('/profile/student/home')

  const { nextDate, nextFullDate } = getNextDate()

  return (
    <div className='lg:ml-[290px] pt-24 pb-7 pr-9 flex gap-28 h-screen'>
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
