import { type Metadata } from 'next'
import { FormResetPassword } from './_components/FormResetPassword'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { redirect } from 'next/navigation'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Cambio de contraseña'
  }
}

export default async function ForgotPassword ({
  searchParams
}: {
  searchParams: { token: string }
}) {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()

  const employeeEmails = await getEmployeeEmails()

  if (data.user) {
    const isEmployee = employeeEmails.includes(data?.user?.email ?? '')

    if (isEmployee) redirect('/profile/employee/home')
    else return redirect('/profile/student/home')
  }

  if (!searchParams.token) redirect('/sign-in')

  return (
    <div className='container py-20 mx-auto'>
      <FormResetPassword token={searchParams.token} />
    </div>
  )
}
