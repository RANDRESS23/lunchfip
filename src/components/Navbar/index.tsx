import { createClient } from '@/utils/supabase/server'
import { NavBarApp } from './NavBarApp'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'

export const NavBar = async () => {
  const supabase = createClient()
  const employeeEmails = await getEmployeeEmails()

  const { data } = await supabase.auth.getUser()

  const isEmployee = employeeEmails.includes(data?.user?.email ?? '')

  return (
    <NavBarApp user={data.user} isEmployee={isEmployee} />
  )
}
