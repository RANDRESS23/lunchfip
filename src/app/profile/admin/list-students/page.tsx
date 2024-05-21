import { redirect } from 'next/navigation'
import { type Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { getAdminEmails } from '@/services/getAdminEmails'
import { TitleAnimated } from '@/components/TitleAnimated'
import { StudentsTable } from './_components/StudentsTable'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Lista De Estudiantes'
  }
}

export default async function ListStudentsPage () {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const employeeEmails = await getEmployeeEmails()
  const adminEmails = await getAdminEmails()
  const isEmployee = employeeEmails.includes(data?.user?.email ?? '')
  const isAdmin = adminEmails.includes(data?.user?.email ?? '')

  if (!data.user) return redirect('/')
  if (isEmployee) return redirect('/profile/employee/home')
  if (!isAdmin) return redirect('/profile/student/home')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const serviceRolKey = process.env.SERVICE_ROL_KEY ?? ''

  return (
    <div className='lg:ml-[290px] pt-24 pb-10 h-screen relative pr-9 font-inter-sans bg-grid-small-black dark:bg-grid-small-white flex flex-col items-center'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <TitleAnimated
        text1='Lista de Estudiantes'
        text2='Registrados'
        isTextLeft
      />
      <p className='w-full z-10 -mt-3 mb-7 text-p-light dark:text-p-dark'>En esta sección podrás visualizar a los estudiantes registrados dentro de LunchFip, así como también cambiar sus estados de <span className='italic'>{'"Activo"'}</span> a <span className='italic'>{'"Inactivo"'}</span> o viceversa.</p>
      <StudentsTable
        supabaseUrl={supabaseUrl}
        serviceRolKey={serviceRolKey}
      />
    </div>
  )
}
