import { type Metadata } from 'next'
import { FormSignIn } from './_components/FormSignIn'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Iniciar Sesión'
  }
}

export default async function SignInPage () {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()

  const employeeEmails = await getEmployeeEmails()

  if (data.user) {
    const isEmployee = employeeEmails.includes(data?.user?.email ?? '')

    if (isEmployee) redirect('/profile/employee/home')
    else return redirect('/profile/student/home')
  }

  return (
    <div className='container py-20 mx-auto'>
      <FormSignIn />
    </div>
  )
}
