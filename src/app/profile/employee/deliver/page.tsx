import { redirect } from 'next/navigation'
import { TabSections } from './_components/TabSections'
import { TitleAnimated } from '@/components/TitleAnimated'
import { type Metadata } from 'next'
import getNextDate from '@/libs/nextDate'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { getAdminEmails } from '@/services/getAdminEmails'
import { LunchesDeliveriedStats } from '@/components/LunchesStats/LunchesDeliveriedStats'
import Image from 'next/image'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Entregar Almuerzo'
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

  const { nextDate, nextFullDate, isValidHourToDelivery, isValidHourToDeliveryStats } = getNextDate()

  return (
    <div className='lg:ml-[290px] pt-24 pb-10 h-screen relative pr-9 font-inter-sans bg-grid-small-black dark:bg-grid-small-white flex flex-col items-center'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <TitleAnimated
        text1='Entregar'
        text2='Almuerzo'
        isTextLeft
      />
      <p className='w-full z-10 -mt-3 mb-5 text-p-light dark:text-p-dark'>Entregar almuerzo a estudiante mediante su códigos QR personal o número de documento.</p>
      <div className='w-full flex gap-6'>
        {
          isValidHourToDelivery
            ? (
                <>
                  <div className='w-2/5'>
                    <TabSections />
                  </div>
                  <div className='w-3/5'>
                    <LunchesDeliveriedStats
                      nextDate={nextDate}
                      nextFullDate={nextFullDate}
                    />
                  </div>
                </>
              )
            : (
                <div className='relative w-full z-10'>
                  {
                    isValidHourToDeliveryStats
                      ? (
                          <>
                            <p className='w-full italic text-center text-color-secondary'>⚠ ¡El tiempo de servicio para entregar almuerzos ha finalizado, gracias por utilizar LunchFip!. ⚠</p>
                            <p className='w-full mt-2 mb-7 italic text-center text-color-secondary'>Horario de servicio de entrega de almuerzos: Lunes a Viernes de 11:00 a.m hasta las 02:00 p.m</p>
                            <LunchesDeliveriedStats
                              nextDate={nextDate}
                              nextFullDate={nextFullDate}
                            />
                          </>
                        )
                      : (
                          <div className='w-full flex flex-col justify-center items-center'>
                            <p className='w-full italic text-center text-color-secondary'>⚠ ¡No se encuentra habilitado el servicio para entregar almuerzos, tienes que esperar el horario disponile!. ⚠</p>
                            <p className='w-full mt-2 mb-7 italic text-center text-color-secondary'>Horario de servicio de entrega de almuerzos: Lunes a Viernes de 11:00 a.m hasta las 02:00 p.m</p>
                            <Image
                              src='https://res.cloudinary.com/dje4ke8hw/image/upload/v1716430605/svgs/lunch-time-gif-dark_svixq5.gif'
                              alt='logo lunchfip'
                              width={200}
                              height={200}
                              className='hidden dark:flex w-80'
                            />
                            <Image
                              src='https://res.cloudinary.com/dje4ke8hw/image/upload/v1716430630/svgs/lunch-time-gif-light_zjzd3p.gif'
                              alt='logo lunchfip'
                              width={200}
                              height={200}
                              className='flex dark:hidden w-80'
                            />
                          </div>
                        )
                  }
                </div>
              )
        }
      </div>
    </div>
  )
}
