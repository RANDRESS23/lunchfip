import { redirect } from 'next/navigation'
import { TabSections } from './_components/TabSections'
import { TitleAnimated } from '@/components/TitleAnimated'
import { type Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { getAdminEmails } from '@/services/getAdminEmails'
import Image from 'next/image'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'LunchFip | Recargar Saldo'
  }
}

export default async function RechargePage () {
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
        text1='Recargar'
        text2='Saldo'
        isTextLeft
      />
      <p className='w-full z-10 -mt-3 mb-5 text-p-light dark:text-p-dark'>En esta sección podrás recargar el saldo al estudiante escaneando su código QR personal o mediante la digitalización de su número de documento.</p>
      <div className='w-full flex gap-10'>
        <div className='w-3/6'>
          <TabSections />
        </div>
        <div className='w-3/6 relative z-10'>
          <Image
            src='https://res.cloudinary.com/dje4ke8hw/image/upload/v1716431225/svgs/recharge-balance-gif-dark_wxdcid.gif'
            alt='logo lunchfip'
            width={200}
            height={200}
            className='hidden dark:flex w-96'
          />
          <Image
            src='https://res.cloudinary.com/dje4ke8hw/image/upload/v1716431191/svgs/recharge-balance-gif-light_ob3ekz.gif'
            alt='logo lunchfip'
            width={200}
            height={200}
            className='flex dark:hidden w-96'
          />
        </div>
      </div>
    </div>
  )
}
