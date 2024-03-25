'use client'

import { useClerk } from '@clerk/nextjs'
import { NavbarMenuItem, Divider } from '@nextui-org/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface NavBarMobileProps {
  items: Array<{ title: string, href: string }>
  pathname: string
  setIsMenuOpen: (value: boolean) => void
  isMenuItemsGeneral: boolean
}

export const NavBarMobile = (
  { items, pathname, setIsMenuOpen, isMenuItemsGeneral }: NavBarMobileProps
) => {
  const { signOut } = useClerk()
  const router = useRouter()

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
                              await signOut(() => { router.push('/') })
                            }}
                          >
                            Cerrar Sesión
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
