import { type Metadata } from 'next'
import { FormForgotPassword } from './_components/FormForgotPassword'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { redirect } from 'next/navigation'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Solicitar cambio de contraseña'
  }
}

/* ➡ Este componente es el que se renderiza en la pagina "¿Olvidaste tu contraseña?" del aplicativo */
export default async function ForgotPassword () {
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
      <FormForgotPassword />
    </div>
  )
}
