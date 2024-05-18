'use client'

import { createClient } from '@/utils/supabase/client'
import { NavbarMenuItem, Divider } from '@nextui-org/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useEstudiante } from '@/hooks/useEstudiante'
import { useEmpleado } from '@/hooks/useEmpleado'
import { ESTUDIANTE_INITIAL_VALUES } from '@/initial-values/estudiante'
import { EMPLEADO_INITIAL_VALUES } from '@/initial-values/empleado'
import { useState } from 'react'

interface NavBarMobileProps {
  items: Array<{ title: string, href: string }>
  pathname: string
  setIsMenuOpen: (value: boolean) => void
  isMenuItemsGeneral: boolean
}

export const NavBarMobile = (
  { items, pathname, setIsMenuOpen, isMenuItemsGeneral }: NavBarMobileProps
) => {
  const [isSignOut, setIsSignOut] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { setEstudiante } = useEstudiante()
  const { setEmpleado } = useEmpleado()

  const signOut = async () => {
    await supabase.auth.signOut()

    setIsSignOut(true)
    setEstudiante(ESTUDIANTE_INITIAL_VALUES)
    setEmpleado(EMPLEADO_INITIAL_VALUES)

    toast.success('¡Cierre de sesión exitosamente!')
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <>
      {
        items.map(({ title, href }, index) => (
          <NavbarMenuItem isActive={pathname === href} key={`${title}-${index}`} className='w-full flex flex-col'>
            <Link
              className="w-full py-1"
              href={href}
              onClick={() => { setIsMenuOpen(false) }}
            >
              {title}
            </Link>
            <Divider className='mt-2' />

            {
              index === items.length - 1
                ? !isMenuItemsGeneral
                    ? (
                        <>
                          <button
                            className='mt-2 text-color-secondary font-normal text-left py-1'
                            onClick={async () => {
                              setIsMenuOpen(false)
                              signOut()
                            }}
                            disabled={isSignOut}
                          >
                            {isSignOut ? 'Cerrando...' : 'Cerrar Sesión'}
                          </button>
                          <Divider className='mt-2' />
                        </>
                      )
                    : (
                        <>
                          <Link
                            className="w-full text-color-primary font-normal mt-2 py-1"
                            href='/sign-in'
                            onClick={() => { setIsMenuOpen(false) }}
                          >
                            Iniciar Sesión
                          </Link>
                          <Divider className='mt-2' />

                          <Link
                            className="w-full text-color-secondary font-normal mt-2 py-1"
                            href='/sign-up'
                            onClick={() => { setIsMenuOpen(false) }}
                          >
                            Registrarse
                          </Link>
                          <Divider className='mt-2' />
                        </>
                      )
                : null
            }
          </NavbarMenuItem>
        ))
      }
    </>
  )
}
