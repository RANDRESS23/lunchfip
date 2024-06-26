import { redirect } from 'next/navigation'
import { StudentInfo } from './_components/StudentInfo'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { TitleAnimated } from '@/components/TitleAnimated'
import { TabSections } from './_components/TabSections'
import { type Metadata } from 'next'
import { getAdminEmails } from '@/services/getAdminEmails'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Información De Perfil'
  }
}

export default async function InfoPage () {
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
        text2='Perfil'
        textSize='text-4xl lg:text-[42px]'
        isTextRowMobile
      />
      <p className='w-full z-10 -mt-2 text-center text-p-light dark:text-p-dark'>Puedes visualizar tu perfil y tu código QR personal, además de actualizar tus datos cuando desees.</p>
      <StudentInfo />
      <TabSections />
    </div>
  )
}
