import { createClient } from '@/utils/supabase/server'
import { NavBarApp } from './NavBarApp'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { getAdminEmails } from '@/services/getAdminEmails'

/* ➡ Componente que renderiza el NavBar del aplicativo */
export const NavBar = async () => {
  const supabase = createClient()
  const employeeEmails = await getEmployeeEmails()
  const adminEmails = await getAdminEmails()

  const { data } = await supabase.auth.getUser()

  const isEmployee = employeeEmails.includes(data?.user?.email ?? '')
  const isAdmin = adminEmails.includes(data?.user?.email ?? '')

  return (
    <NavBarApp
      user={data.user}
      isEmployee={isEmployee}
      isAdmin={isAdmin}
    />
  )
}
