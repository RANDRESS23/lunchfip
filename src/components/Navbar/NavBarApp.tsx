'use client'

import { useEffect, useState } from 'react'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu } from '@nextui-org/react'
import Link from 'next/link.js'
import { ThemeSwitcher } from '../ThemeSwitcher'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { NavBarContentCenter } from './NavBarContentCenter'
import { menuItems, menuItemsEmployee, menuItemsStudent } from '@/constants/itemsNavBar'
import { ButtonsCard } from '../ui/tailwindcss-buttons'
import { cn } from '@/libs/utils'
import { NavBarMobile } from './NavBarMobile'
import { createClient } from '@/utils/supabase/client'

interface NavBarAppProps {
  user: any
}

export const NavBarApp = ({ user }: NavBarAppProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSignOutButton, setShowSignOutButton] = useState(false)
  const router = useRouter()

  const supabase = createClient()

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/sign-in')
  }

  const pathname = usePathname()

  useEffect(() => {
    if (user) setShowSignOutButton(true)
    else setShowSignOutButton(false)
  }, [user])

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen} className='fixed font-inter-sans' isBordered id='navBar'>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link
            href='/'
            className='flex justify-center items-center'
          >
            <Image
              src='/svgs/logo-lunchfip-dark.svg'
              alt='logo lunchfip'
              width={130}
              height={130}
              className='hidden dark:flex'
            />
            <Image
              src='/svgs/logo-lunchfip-light.svg'
              alt='logo lunchfip'
              width={130}
              height={130}
              className='flex dark:hidden'
            />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {
        (!pathname.includes('/profile/employee') && pathname.includes('/profile/student'))
          ? <NavBarContentCenter
              items={menuItemsStudent}
              pathname={pathname}
              id='itemsNavBarStudent'
            />
          : (!pathname.includes('/profile/employee') && !pathname.includes('/profile/student'))
              ? <NavBarContentCenter
                  items={menuItems}
                  pathname={pathname}
                  id='itemsNavBar'
                />
              : null
      }
      <NavbarContent justify="end" className='gap-2'>
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        {
          showSignOutButton
            ? (
                <NavbarItem className="hidden lg:flex">
                    <ButtonsCard>
                      <button className="relative inline-flex h-10 overflow-hidden rounded-lg p-[1px]" onClick={signOut}>
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00aaff_0%,#ff3366_50%,#00aaff_100%)]" />
                        <span className={cn(
                          'inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-white dark:bg-black px-3 py-1 text-sm font-medium hover:text-black dark:hover:text-white backdrop-blur-3xl transition-all',
                          pathname === '/sign-up' ? 'text-black dark:text-white' : 'text-nav-link-light dark:text-nav-link-dark')}
                        >
                          Cerrar Sesión
                        </span>
                      </button>
                    </ButtonsCard>
                </NavbarItem>
              )
            : (
                <>
                  <NavbarItem className="hidden lg:flex">
                    <Link
                      href="/sign-in"
                      className={cn(
                        'flex text-sm h-full w-full px-3 py-2.5 rounded-lg hover:text-black hover:bg-[#f3f2f2] dark:hover:bg-[#3f3f4666] dark:hover:text-white transition-all duration-500',
                        pathname === '/sign-in' ? 'text-black dark:text-white' : 'text-nav-link-light dark:text-nav-link-dark'
                      )}
                    >
                      Iniciar Sesión
                    </Link>
                  </NavbarItem>
                  <NavbarItem className="hidden lg:flex">
                    <ButtonsCard>
                      <Link href="/sign-up" className="relative inline-flex h-10 overflow-hidden rounded-lg p-[1px]">
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00aaff_0%,#ff3366_50%,#00aaff_100%)]" />
                        <span className={cn(
                          'inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-white dark:bg-black px-3 py-1 text-sm font-medium hover:text-black dark:hover:text-white backdrop-blur-3xl transition-all',
                          pathname === '/sign-up' ? 'text-black dark:text-white' : 'text-nav-link-light dark:text-nav-link-dark')}
                        >
                          Registrarse
                        </span>
                      </Link>
                    </ButtonsCard>
                  </NavbarItem>
                </>
              )
        }
      </NavbarContent>
      <NavbarMenu>
        {
          (!pathname.includes('/profile/employee') && pathname.includes('/profile/student'))
            ? <NavBarMobile
                items={menuItemsStudent}
                pathname={pathname}
                setIsMenuOpen={setIsMenuOpen}
                isMenuItemsGeneral={false}
              />
            : (pathname.includes('/profile/employee') && !pathname.includes('/profile/student'))
                ? <NavBarMobile
                    items={menuItemsEmployee}
                    pathname={pathname}
                    setIsMenuOpen={setIsMenuOpen}
                    isMenuItemsGeneral={false}
                  />
                : <NavBarMobile
                    items={menuItems}
                    pathname={pathname}
                    setIsMenuOpen={setIsMenuOpen}
                    isMenuItemsGeneral={true}
                  />
        }
      </NavbarMenu>
    </Navbar>
  )
}
