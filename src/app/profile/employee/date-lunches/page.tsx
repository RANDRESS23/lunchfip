import { redirect } from 'next/navigation'
import { TitleAnimated } from '@/components/TitleAnimated'
import { type Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { getAdminEmails } from '@/services/getAdminEmails'
import { DefineDateLunches } from './_components/DefineDateLunches'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Definir Próxima Fecha Almuerzos'
  }
}

export default async function ReservePage () {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const employeeEmails = await getEmployeeEmails()
  const adminEmails = await getAdminEmails()
  const isEmployee = employeeEmails.includes(data?.user?.email ?? '')
  const isAdmin = adminEmails.includes(data?.user?.email ?? '')

  if (!data.user) return redirect('/')
  if (isAdmin) return redirect('/profile/admin/home')
  if (!isEmployee) return redirect('/profile/student/home')

  return (
    <div className='lg:ml-[290px] pt-24 pb-10 h-screen relative pr-9 font-inter-sans bg-grid-small-black dark:bg-grid-small-white flex flex-col items-center'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <TitleAnimated
        text1='Definir Próxima'
        text2='Fecha'
        isTextLeft
      />
      <p className='w-full z-10 -mt-3 mb-8 text-p-light dark:text-p-dark'>En esta sección podrás definir la próxima fecha donde se habilitará el servicio de almuerzos. Tienes que tener en cuenta si el día seleccionado habrá clases o simplemente es un día festivo, para así mismo elegir bien la fecha del servicio de almuerzos y que no hayan complicaciones.</p>
      <DefineDateLunches />
    </div>
  )
}
