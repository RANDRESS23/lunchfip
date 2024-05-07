import { createClient } from '@/utils/supabase/server'
import { NavBarApp } from './NavBarApp'

export const NavBar = async () => {
  const supabase = createClient()

  const { data } = await supabase.auth.getUser()

  return (
    <NavBarApp user={data.user} />
  )
}
