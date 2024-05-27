import { redirect } from 'next/navigation'
import { type Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { getAdminEmails } from '@/services/getAdminEmails'
import { TitleAnimated } from '@/components/TitleAnimated'
import { DashBoardSection } from './_components/DashBoardSection'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Estadísticas Almuerzos'
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
        text1='Estadísticas de'
        text2='Almuerzos'
        isTextLeft
      />
      <p className='w-full z-10 -mt-3 mb-9 text-p-light dark:text-p-dark'>En esta sección podrás visualizar diferentes estadísticas referente a los almuerzos. Esta información la encontrarás en gráficas minimalistas para que te ayuden a una mejor comprensión de las estadísticas.</p>
      {/*
        - Gráfica de cuantos almuerzos se definieron en el rango de fecha seleccionado
        - Gráfica de cuantos almuerzos se reservaron en total en el rango de fecha seleccionado
        - Gráfica de cuantos almuerzos reservados fueron presencialmente en el rango de fecha seleccionado
        - Gráfica de cuantos almuerzos reservados fueron virtualmente en el rango de fecha seleccionado
        - Gráfica de cuantos almuerzos se entregaron en el rango de fecha seleccionado
        - Gráfica de cuantos almuerzos se faltaron por entregar en el rango de fecha seleccionado
        - Gráfica de cuantos recargas se hicieron en el rango de fecha seleccionado
      */}
      <DashBoardSection />
    </div>
  )
}
