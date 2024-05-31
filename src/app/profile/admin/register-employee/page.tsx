import { redirect } from 'next/navigation'
import { type Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { getAdminEmails } from '@/services/getAdminEmails'
import { TitleAnimated } from '@/components/TitleAnimated'
import { EmployeeTable } from './_components/EmployeeTable'
import { RegisterEmployee } from './_components/RegisterEmployee'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Registrar Empleado'
  }
}

export default async function RegisterEmployeePage () {
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
    <div className='lg:ml-[290px] pt-24 pb-10 relative pr-9 font-inter-sans bg-grid-small-black dark:bg-grid-small-white flex flex-col items-center'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <TitleAnimated
        text1='Registrar'
        text2='Empleado'
        isTextLeft
      />
      <p className='w-full z-10 -mt-3 mb-9 text-p-light dark:text-p-dark'>En esta sección podrás registrar un nuevo empleado, modificar la información de los empleados ya registrados, o simplemente eliminar la cuenta de algún empleado.</p>
      <RegisterEmployee
        supabaseUrl={supabaseUrl}
        serviceRolKey={serviceRolKey}
      />
      <EmployeeTable
        supabaseUrl={supabaseUrl}
        serviceRolKey={serviceRolKey}
      />
    </div>
  )
}
