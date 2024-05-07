import { HomeSection } from '@/components/Title/HomeSection'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home () {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()

  const employeeEmails = await getEmployeeEmails()

  if (data.user) {
    const isEmployee = employeeEmails.includes(data?.user?.email ?? '')

    if (isEmployee) redirect('/profile/employee/home')
    else return redirect('/profile/student/home')
  }

  return (
    <main className='w-4/5 mx-auto'>
      <HomeSection />
    </main>
  )
}
