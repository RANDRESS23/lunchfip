import { Footer } from '@/components/Footer'
import { BecauseSection } from '@/components/Home/BecauseSection'
import { HomeSection } from '@/components/Home/HomeSection'
import { getAdminEmails } from '@/services/getAdminEmails'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

/* ➡ Este componente es el que se renderiza en la pagina principal del aplicativo */
export default async function Home () {
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
    <>
      <main className='w-4/5 mx-auto'>
        <HomeSection />
        <BecauseSection />
      </main>
      <Footer />
    </>
  )
}
