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
          'text-base font-semibold rounded-lg hover:text-sushi-500 hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center p-2 group',
          pathname === href && 'bg-gray-100 dark:bg-slate-800'
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
