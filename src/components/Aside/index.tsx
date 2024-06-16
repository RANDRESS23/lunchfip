'use client'

import { ItemList } from './ItemList'
import { usePathname } from 'next/navigation'

interface AsideProps {
  items: Array<Record<string, any>>
}

/* ➡ Componente del aside tanto para el empleado, como para el administrador */
export const Aside = ({ items }: AsideProps) => {
  const pathname = usePathname()

  return (
    <aside
      id="sidebar"
      className="fixed hidden h-full top-0 left-0 mt-[65px] lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75 font-inter-sans"
      aria-label="Sidebar"
    >
      <div className="relative flex-1 flex flex-col min-h-0 border-r-small border-gray-300 dark:border-gray-500/20 pt-0">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 divide-y space-y-1">
            <ul className="space-y-2 pb-2">
              {
                items.map(({ title, href, icon }) => (
                  <ItemList
                    key={href}
                    href={href}
                    icon={icon(pathname)}
                    title={title}
                  />
                ))
              }
            </ul>
          </div>
        </div>
      </div>
    </aside>
  )
}
