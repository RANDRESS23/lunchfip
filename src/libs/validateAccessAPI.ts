import { getAdminEmails } from '@/services/getAdminEmails'
import { getEmployeeEmails } from '@/services/getEmployeeEmails'
import { createClient } from '@/utils/supabase/server'

export const validateAccessAPI = async () => {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const employeeEmails = await getEmployeeEmails()
  const adminEmails = await getAdminEmails()

  const isEmployee = employeeEmails.includes(data?.user?.email ?? '')
  const isAdmin = adminEmails.includes(data?.user?.email ?? '')

  return !isAdmin && !isEmployee
}
