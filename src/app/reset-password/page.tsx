import { type Metadata } from 'next'
import { FormResetPassword } from './_components/FormResetPassword'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { redirect } from 'next/navigation'
import { getAdminEmails } from '@/services/getAdminEmails'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Cambio de contraseña'
  }
}

/* ➡ Este componente es el que se renderiza en la pagina "Reestablecer contraseña" del aplicativo */
export default async function ForgotPassword ({
  searchParams
}: {
  searchParams: { token: string }
}) {
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

  if (!searchParams.token) redirect('/sign-in')

  return (
    <div className='container py-20 mx-auto'>
      <FormResetPassword token={searchParams.token} />
    </div>
  )
}
