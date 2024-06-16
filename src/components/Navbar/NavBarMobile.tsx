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
import { useAdministrador } from '@/hooks/useAdministrador'
import { ADMINISTRADOR_INITIAL_VALUES } from '@/initial-values/administrador'

interface NavBarMobileProps {
  items: Array<{ title: string, href: string, icon?: any }>
  pathname: string
  setIsMenuOpen: (value: boolean) => void
  isMenuItemsGeneral: boolean
}

/* ➡ Componente que renderiza el NavBar para entornos móviles */
export const NavBarMobile = (
  { items, pathname, setIsMenuOpen, isMenuItemsGeneral }: NavBarMobileProps
) => {
  const [isSignOut, setIsSignOut] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { setEstudiante } = useEstudiante()
  const { setEmpleado } = useEmpleado()
  const { setAdministrador } = useAdministrador()

  const signOut = async () => {
    try {
      setIsSignOut(true)

      await supabase.auth.signOut()

      setEstudiante(ESTUDIANTE_INITIAL_VALUES)
      setEmpleado(EMPLEADO_INITIAL_VALUES)
      setAdministrador(ADMINISTRADOR_INITIAL_VALUES)

      toast.success('¡Cierre de sesión exitosamente!')
      router.push('/sign-in')
      router.refresh()
    } catch (error) {
      console.log({ error })
    } finally {
      setIsSignOut(false)
    }
  }

  return (
    <>
      {
        items.map((item, index) => (
          <NavbarMenuItem isActive={pathname === item.href} key={`${item.title}-${index}`} className='w-full flex flex-col'>
            <Link
              className="w-full flex py-1"
              href={item.href}
              onClick={() => { setIsMenuOpen(false) }}
            >
              {
                (pathname.includes('/profile/admin') || pathname.includes('/profile/employee'))
                  ? (
                      <>
                        {item.icon(pathname)}
                        <span
                          className='ml-3'
                        >
                          {item.title}
                        </span>
                      </>
                    )
                  : item.title
              }
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
