import { redirect } from 'next/navigation'
import { DefineLunches } from './_components/DefineLunches'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { type Metadata } from 'next'
import { getAdminEmails } from '@/services/getAdminEmails'
import { TitleAnimated } from '@/components/TitleAnimated'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Definir Almuerzos'
  }
}

export default async function LunchPage () {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const employeeEmails = await getEmployeeEmails()
  const adminEmails = await getAdminEmails()
  const isEmployee = employeeEmails.includes(data?.user?.email ?? '')
  const isAdmin = adminEmails.includes(data?.user?.email ?? '')

  if (!data.user) return redirect('/')
  if (isEmployee) return redirect('/profile/employee/home')
  if (!isAdmin) return redirect('/profile/student/home')

  return (
    <div className='lg:ml-[290px] pt-24 pb-10 h-screen relative px-9 font-inter-sans bg-grid-small-black dark:bg-grid-small-white flex flex-col items-center'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <TitleAnimated
        text1='Definir'
        text2='Almuerzos'
        isTextLeft
        isTextRowMobile
      />
      <p className='w-full z-10 -mt-3 mb-7 text-p-light dark:text-p-dark text-center lg:text-left'>En esta sección podrás definir la cantidad de almuerzos para los días hábiles del servicio de alimentación, así como también modificar dicha cantidad de almuerzos.</p>
      <DefineLunches />
    </div>
  )
}
