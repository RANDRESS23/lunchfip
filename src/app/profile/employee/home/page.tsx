import { redirect } from 'next/navigation'
import { BgParticles } from './_components/BgParticles'
import { WelcomeEmployee } from './_components/WelcomeEmployee'
import { type Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Inicio'
  }
}

export default async function HomePage () {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const employeeEmails = await getEmployeeEmails()
  const isEmployee = employeeEmails.includes(data?.user?.email ?? '')

  if (!data.user) redirect('/')
  if (!isEmployee) redirect('/profile/student/home')

  return (
    <div className='lg:ml-[290px] h-screen relative px-9 pr-9 font-inter-sans flex flex-col items-center justify-center'>
      <BgParticles />
      <WelcomeEmployee />
    </div>
  )
}
