'use client'

import Link from 'next/link'
import { cn } from '@/libs/utils'
import { usePathname } from 'next/navigation'

interface ItemListProps {
  href: string
  icon: React.ReactElement
  title: string
}

export const ItemList = ({ href, icon, title }: ItemListProps) => {
  const pathname = usePathname()

  return (
    <li>
      <Link
        href={href}
        className={cn(
          'text-sm font-semibold rounded-lg hover:text-sushi-500 hover:bg-[#f3f2f2] dark:hover:bg-[#3f3f4666] flex items-center p-2 group hover:text-black dark:hover:text-white transition-all',
          pathname === href ? 'text-black dark:text-white bg-[#f3f2f2] dark:bg-[#3f3f4666]' : 'text-nav-link-light dark:text-nav-link-dark'
        )}
      >
        {icon}
        <span
          className={cn('ml-3 flex-1 whitespace-nowrap')}
        >
          {title}
        </span>
      </Link>
    </li>
  )
}
