'use client'

import { cn } from '@/libs/utils'
import { NavbarContent, NavbarItem } from '@nextui-org/react'
import Link from 'next/link.js'

interface NavBarContentCenterProps {
  items: Array<{ title: string, href: string }>
  pathname: string
}

export const NavBarContentCenter = ({ items, pathname }: NavBarContentCenterProps) => {
  return (
    <NavbarContent className="relative hidden sm:flex -gap-4" justify="center">
      {
        items.map(({ title, href }, index) => (
          <NavbarItem
            key={`${title}-${index}`}
            isActive={pathname === href}
            className='flex text-sm'
            id='itemsNavBarStudent'
          >
            <Link
              href={href}
              className={cn(
                'flex h-full w-full px-3 py-2.5 hover:text-black dark:hover:text-white transition-all',
                pathname === href ? 'text-black dark:text-white' : 'text-nav-link-light dark:text-nav-link-dark'
              )}>
              {title}
            </Link>
          </NavbarItem>
        ))
      }
    </NavbarContent>
  )
}
