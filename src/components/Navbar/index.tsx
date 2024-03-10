'use client'

import { useState } from 'react'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Button, Divider } from '@nextui-org/react'
// import { AcmeLogo } from './AcmeLogo.jsx'
import Link from 'next/link.js'
import { ThemeSwitcher } from '../ThemeSwitcher'
import { useClerk, useUser } from '@clerk/nextjs'
import { useRouter, usePathname } from 'next/navigation'

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isSignedIn } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    {
      title: 'Inicio',
      href: '/'
    }
  ]

  const menuItemsStudent = [
    {
      title: 'Inicio',
      href: '/profile/student/home'
    },
    {
      title: 'Reservas',
      href: '/profile/student/reservation'
    },
    {
      title: 'Perfil',
      href: '/profile/student/info'
    }
  ]

  const menuItemsEmployee = [
    {
      title: 'Definir Almuerzos',
      href: '/profile/employee/lunch'
    },
    {
      title: 'Reservar Almuerzo',
      href: '/profile/employee/reserve'
    },
    {
      title: 'Entregar Almuerzo',
      href: '/profile/employee/deliver'
    },
    {
      title: 'Recargar Saldo',
      href: '/profile/employee/recharge'
    }
  ]

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen} className='fixed' isBordered>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="sm:hidden"
        />
        <NavbarBrand>
          {/* <AcmeLogo /> */}
          <Link
            color="foreground"
            className='font-bold'
            href='/'
          >
            LUNCHFIP
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {
        (!pathname.includes('/profile/employee') && pathname.includes('/profile/student'))
          ? (
              <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {
                  menuItemsStudent.map(({ title, href }, index) => (
                    <NavbarItem
                      key={`${title}-${index}`}
                      isActive={pathname === href}
                    >
                      <Link color="foreground" href={href}>
                        {title}
                      </Link>
                    </NavbarItem>
                  ))
                }
              </NavbarContent>
            )
          : (!pathname.includes('/profile/employee') && !pathname.includes('/profile/student'))
              ? (
                  <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    {
                      menuItems.map(({ title, href }, index) => (
                        <NavbarItem
                          key={`${title}-${index}`}
                          isActive={pathname === href}
                        >
                          <Link color="foreground" href={href}>
                            {title}
                          </Link>
                        </NavbarItem>
                      ))
                    }
                  </NavbarContent>
                )
              : null
      }
      <NavbarContent justify="end">
        <NavbarItem className='bg-blue'>
          <ThemeSwitcher />
        </NavbarItem>
        {
          isSignedIn ?? false
            ? (
                <NavbarItem className="hidden lg:flex">
                  <Button
                    color="primary"
                    variant="flat"
                    onClick={async () => { await signOut(() => { router.push('/') }) }}
                  >
                    Cerrar Sesión
                  </Button>
                </NavbarItem>
              )
            : (
                <>
                  <NavbarItem className="hidden lg:flex">
                    <Link href="/sign-in">Iniciar Sesión</Link>
                  </NavbarItem>
                  <NavbarItem className="hidden lg:flex">
                    <Button as={Link} color="primary" href="/sign-up" variant="flat">
                      Registrarse
                    </Button>
                  </NavbarItem>
                </>
              )
        }
      </NavbarContent>
      <NavbarMenu>
        {
          (!pathname.includes('/profile/employee') && pathname.includes('/profile/student'))
            ? (
                <>
                  {
                    menuItemsStudent.map(({ title, href }, index) => (
                      <NavbarMenuItem isActive={pathname === href} key={`${title}-${index}`}>
                        <Link
                          className="w-full"
                          href={href}
                          onClick={() => { setIsMenuOpen(false) }}
                        >
                          {title}
                        </Link>
                        <Divider className='mt-2' />

                        {
                          index === menuItemsStudent.length - 1 && (
                            <>
                              <button
                                className='mt-2 text-primary font-normal'
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
                        }
                      </NavbarMenuItem>
                    ))
                  }
                </>
              )
            : (pathname.includes('/profile/employee') && !pathname.includes('/profile/student'))
                ? (
                    <>
                      {
                        menuItemsEmployee.map(({ title, href }, index) => (
                          <NavbarMenuItem isActive={pathname === href} key={`${title}-${index}`}>
                            <Link
                              className="w-full"
                              href={href}
                              onClick={() => { setIsMenuOpen(false) }}
                            >
                              {title}
                            </Link>
                            <Divider className='mt-2' />

                            {
                              index === menuItemsEmployee.length - 1 && (
                                <>
                                  <button
                                    className='mt-2 text-primary font-normal'
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
                            }
                          </NavbarMenuItem>
                        ))
                      }
                    </>
                  )
                : (
                    <>
                      {
                        menuItems.map(({ title, href }, index) => (
                          <NavbarMenuItem isActive={pathname === href} key={`${title}-${index}`}>
                            <Link
                              className="w-full"
                              href={href}
                              onClick={() => { setIsMenuOpen(false) }}
                            >
                              {title}
                            </Link>
                            <Divider className='mt-2' />

                            {
                              index === menuItems.length - 1 && (
                                <>
                                  <Link
                                    className="w-full text-primary font-normal"
                                    href='/sign-in'
                                    onClick={() => { setIsMenuOpen(false) }}
                                  >
                                    Iniciar Sesión
                                  </Link>
                                  <Divider className='mt-2' />

                                  <Link
                                    className="w-full text-secondary font-normal"
                                    href='/sign-up'
                                    onClick={() => { setIsMenuOpen(false) }}
                                  >
                                    Registrarse
                                  </Link>
                                  <Divider className='mt-2' />
                                </>
                              )
                            }
                          </NavbarMenuItem>
                        ))
                      }
                    </>
                  )
        }
      </NavbarMenu>
    </Navbar>
  )
}
