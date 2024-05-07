'use client'

import { useEffect } from 'react'
import { cn } from '@/libs/utils'
import { NavbarContent, NavbarItem } from '@nextui-org/react'
import { useTheme } from 'next-themes'
import Link from 'next/link.js'

interface NavBarContentCenterProps {
  items: Array<{ title: string, href: string }>
  pathname: string
  id: string
}

export const NavBarContentCenter = ({ items, pathname, id }: NavBarContentCenterProps) => {
  const { theme } = useTheme()

  useEffect(() => {
    const $boxNavBar = document.createElement('div')
    $boxNavBar.id = 'boxNavBar'

    if (theme === 'dark') $boxNavBar.style.backgroundColor = '#3f3f4666'
    if (theme === 'light') $boxNavBar.style.backgroundColor = '#e6e6e6'

    $boxNavBar.style.position = 'absolute'
    $boxNavBar.style.width = 'var(--box--width)'
    $boxNavBar.style.height = 'var(--box--height)'
    $boxNavBar.style.top = 'var(--box--top)'
    $boxNavBar.style.left = 'var(--box--left)'
    $boxNavBar.style.borderRadius = '10px'
    $boxNavBar.style.transitionDuration = '500ms'
    $boxNavBar.style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)'
    $boxNavBar.style.transitionProperty = 'all'
    $boxNavBar.style.opacity = '0'
    $boxNavBar.style.zIndex = '-10'
    $boxNavBar.style.backdropFilter = 'blur(16px)'

    const $itemsNavBar = document.querySelectorAll('#itemsNavBar')
    const $itemsNavBarStudent = document.querySelectorAll('#itemsNavBarStudent')

    const totalItemsNavBar = [...Array.from($itemsNavBar), ...Array.from($itemsNavBarStudent)]

    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
    const $navBar = document.querySelector('#navBar') as HTMLElement
    $navBar.appendChild($boxNavBar)

    totalItemsNavBar.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const { width, height, left, top } = item.getBoundingClientRect()
        const { left: leftNavBar } = $navBar.getBoundingClientRect()

        $boxNavBar.style.setProperty('--box--left', `${left - leftNavBar}px`)
        $boxNavBar.style.setProperty('--box--top', `${top}px`)
        $boxNavBar.style.setProperty('--box--width', `${width}px`)
        $boxNavBar.style.setProperty('--box--height', `${height}px`)

        $boxNavBar.style.opacity = '1'
        $boxNavBar.style.visibility = 'visible'
      })

      item.addEventListener('mouseleave', () => {
        $boxNavBar.style.opacity = '0'
        $boxNavBar.style.visibility = 'hidden'
      })
    })

    return () => {
      totalItemsNavBar.forEach(item => {
        item.removeEventListener('mouseenter', () => {})
        item.removeEventListener('mouseleave', () => {})
      })

      $navBar.removeChild($boxNavBar)
    }
  }, [])

  useEffect(() => {
    const $boxNavBar = document.getElementById('boxNavBar')

    if ($boxNavBar !== null && theme === 'dark') $boxNavBar.style.backgroundColor = '#3f3f4666'

    if ($boxNavBar !== null && theme === 'light') $boxNavBar.style.backgroundColor = '#e6e6e6'
  }, [theme])

  return (
    <NavbarContent className="relative hidden sm:flex -gap-4" justify="center">
      {
        items.map(({ title, href }, index) => (
          <NavbarItem
            key={`${title}-${index}`}
            isActive={pathname === href}
            className='flex text-sm'
            id={id}
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
