import { redirect } from 'next/navigation'
import { StudentInfo } from './_components/StudentInfo'
import { createClient } from '@/utils/supabase/server'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'

export default async function InfoPage () {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const employeeEmails = await getEmployeeEmails()
  const isEmployee = employeeEmails.includes(data?.user?.email ?? '')

  if (isEmployee) redirect('/profile/employee/home')

  return (
    <div className='h-screen pt-20 pb-8 px-5'>
      <StudentInfo />
    </div>
  )
}
