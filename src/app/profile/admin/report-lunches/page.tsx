import { redirect } from 'next/navigation'
import { type Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { getAdminEmails } from '@/services/getAdminEmails'
import { TitleAnimated } from '@/components/TitleAnimated'
import { StudentsTable } from './_components/StudentsTable'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Reporte de Almuerzos'
  }
}

export default async function ReportLunchesPage () {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const employeeEmails = await getEmployeeEmails()
  const adminEmails = await getAdminEmails()
  const isEmployee = employeeEmails.includes(data?.user?.email ?? '')
  const isAdmin = adminEmails.includes(data?.user?.email ?? '')

  if (!data.user) return redirect('/')
  if (isEmployee) return redirect('/profile/employee/home')
  if (!isAdmin) return redirect('/profile/student/home')

  return (
    <div className='lg:ml-[290px] pt-24 pb-10 h-screen relative pr-9 font-inter-sans bg-grid-small-black dark:bg-grid-small-white flex flex-col items-center'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <TitleAnimated
        text1='Reporte de'
        text2='Almuerzos'
        isTextLeft
      />
      <p className='w-full z-10 -mt-3 mb-9 text-p-light dark:text-p-dark'>En esta sección podrás visualizar a los estudiantes que reservaron almuerzo dependiendo de la fecha ingresada, así como también si se les entregó o no el almuerzo correspondiente.</p>
      <StudentsTable />
    </div>
  )
}
