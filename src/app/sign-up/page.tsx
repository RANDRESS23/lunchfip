import { type Metadata } from 'next'
import { FormSignUp } from './_components/FormSignUp'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Registrarse'
  }
}

export default async function Page () {
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
      <FormSignUp />
    </div>
  )
}
