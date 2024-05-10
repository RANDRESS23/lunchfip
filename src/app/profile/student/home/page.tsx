import { redirect } from 'next/navigation'
import { BgParticles } from './_components/BgParticles'
import { WelcomeStudent } from './_components/WelcomeStudent'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'

export default async function HomePage () {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const employeeEmails = await getEmployeeEmails()
  const isEmployee = employeeEmails.includes(data?.user?.email ?? '')

  if (!data.user) redirect('/')
  if (isEmployee) redirect('/profile/employee/home')

  return (
    <div className='h-screen relative font-inter-sans flex flex-col items-center justify-center'>
      <BgParticles />
      <WelcomeStudent />
    </div>
  )
}
