import { redirect } from 'next/navigation'
import { TabSections } from './_components/TabSections'
import { TitleAnimated } from '@/components/TitleAnimated'
import { LunchesReservedStats } from '@/components/LunchesStats/LunchesReservedStats'
import getNextDate from '@/libs/nextDate'
import { type Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { getAdminEmails } from '@/services/getAdminEmails'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Reservar Almuerzo'
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

  const { nextDate, nextFullDate, isValidHourToReserve } = getNextDate()

  return (
    <div className='lg:ml-[290px] pt-24 pb-10 h-screen relative pr-9 font-inter-sans bg-grid-small-black dark:bg-grid-small-white flex flex-col items-center'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <TitleAnimated
        text1='Reservar'
        text2='Almuerzo'
        isTextLeft
      />
      <p className='w-full z-10 -mt-3 mb-8 text-p-light dark:text-p-dark'>Reservar almuerzo a estudiante mediante su código QR personal o número de documento.</p>
      <div className='w-full flex gap-6'>
        {
          isValidHourToReserve
            ? (
                <>
                  <div className='w-2/5'>
                    <TabSections />
                  </div>
                  <div className='w-3/5'>
                    <LunchesReservedStats
                      nextDate={nextDate}
                      nextFullDate={nextFullDate}
                    />
                  </div>
                </>
              )
            : (
                <div className='relative w-full z-10'>
                  <p className='w-full italic text-center text-color-secondary'>⚠ ¡El tiempo de servicio para reservar almuerzos ha finalizado, gracias por utilizar LunchFip!. ⚠</p>
                  <p className='w-full mt-2 mb-7 italic text-center text-color-secondary'>Horario de servicio de reservas de almuerzos: Día anterior: 05:00 p.m hasta las 11:00 a.m del día actual</p>

                  <LunchesReservedStats
                    nextDate={nextDate}
                    nextFullDate={nextFullDate}
                    isFlex
                  />
                </div>
              )
        }
      </div>
    </div>
  )
}
