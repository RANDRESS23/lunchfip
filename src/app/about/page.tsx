import { getAdminEmails } from '@/services/getAdminEmails'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { createClient } from '@/utils/supabase/server'
import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AboutUsSection } from './_components/AboutUsSection'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Nosotros'
  }
}

/* ➡ Este componente es el que se renderiza en la pagina "nosotros" del aplicativo */
export default async function AboutPage () {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()

  const employeeEmails = await getEmployeeEmails()
  const adminEmails = await getAdminEmails()

  if (data.user) {
    const isEmployee = employeeEmails.includes(data?.user?.email ?? '')
    const isAdmin = adminEmails.includes(data?.user?.email ?? '')

    if (isEmployee) return redirect('/profile/employee/home')
    else if (isAdmin) return redirect('/profile/admin/home')
    else return redirect('/profile/student/home')
  }

  return (
    <main className='w-4/5 lg:w-3/5 mx-auto py-[110px] px-5 bg-grid-small-black dark:bg-grid-small-white'>
      <AboutUsSection />
    </main>
  )
}
