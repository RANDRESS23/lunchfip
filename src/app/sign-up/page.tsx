import { type Metadata } from 'next'
import { FormSignUp } from './_components/FormSignUp'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { getAdminEmails } from '@/services/getAdminEmails'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Registrarse'
  }
}

/* ➡ Este componente es el que se renderiza en la pagina "Registrarse" del aplicativo */
export default async function Page () {
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
    <div className='container py-20 mx-auto'>
      <FormSignUp />
    </div>
  )
}
