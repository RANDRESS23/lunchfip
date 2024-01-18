'use client'

import { useState } from 'react'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Button, Divider } from '@nextui-org/react'
// import { AcmeLogo } from './AcmeLogo.jsx'
import Link from 'next/link.js'
import { ThemeSwitcher } from '../ThemeSwitcher'
import { useClerk, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isSignedIn, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  const menuItems = [
    {
      title: 'Iniciar Sesión',
      href: '/sign-in'
    },
    {
      title: 'Registrarse',
      href: '/sign-up'
    }
  ]
  console.log({ user, isSignedIn, isLoaded })

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen} className='fixed' isBordered>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="sm:hidden"
        />
        <NavbarBrand>
          {/* <AcmeLogo /> */}
          <p className="font-bold text-inherit">ACME</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
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
                    href="/sign-up"
                    variant="flat"
                    onClick={async () => { await signOut(() => { router.push('/') }) }}
                  >
                    Sign Out
                  </Button>
                </NavbarItem>
              )
            : (
                <>
                  <NavbarItem className="hidden lg:flex">
                    <Link href="/sign-in">Login</Link>
                  </NavbarItem>
                  <NavbarItem className="hidden lg:flex">
                    <Button as={Link} color="primary" href="/sign-up" variant="flat">
                      Sign Up
                    </Button>
                  </NavbarItem>
                </>
              )
        }
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map(({ title, href }, index) => (
          <NavbarMenuItem key={`${title}-${index}`}>
            <Link
              className="w-full"
              href={href}
              onClick={() => { setIsMenuOpen(false) }}
            >
              {title}
            </Link>
            <Divider className='mt-2' />
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}
