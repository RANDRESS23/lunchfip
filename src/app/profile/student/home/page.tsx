import { redirect } from 'next/navigation'
import { BgParticles } from './_components/BgParticles'
import { WelcomeStudent } from './_components/WelcomeStudent'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { getAdminEmails } from '@/services/getAdminEmails'

export default async function HomePage () {
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
    <div className='h-screen relative font-inter-sans flex flex-col items-center justify-center'>
      <BgParticles />
      <WelcomeStudent />
    </div>
  )
}
