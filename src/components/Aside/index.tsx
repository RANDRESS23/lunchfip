'use client'

import { FaMoneyBill1Wave } from 'react-icons/fa6'
import { PiNotePencilFill } from 'react-icons/pi'
import { IoFastFoodSharp } from 'react-icons/io5'
import { GiBowlOfRice } from 'react-icons/gi'
import { ItemList } from './ItemList'
import { cn } from '@/libs/utils'
import { usePathname } from 'next/navigation'

export const Aside = () => {
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
              <ItemList
                href="/profile/employee/lunch"
                icon={
                  <IoFastFoodSharp
                    className={cn(
                      'text-2xl',
                      pathname === '/profile/employee/lunch' ? 'text-black dark:text-white' : 'text-nav-link-light dark:text-nav-link-dark'
                    )}
                  />
                }
                title="Definir Almuerzos"
              />
              <ItemList
                href="/profile/employee/reserve"
                icon={
                  <PiNotePencilFill
                    className={cn(
                      'text-2xl',
                      pathname === '/profile/employee/reserve' ? 'text-black dark:text-white' : 'text-nav-link-light dark:text-nav-link-dark'
                    )}
                  />
                }
                title="Reservar Almuerzo"
              />
              <ItemList
                href="/profile/employee/deliver"
                icon={
                  <GiBowlOfRice
                    className={cn(
                      'text-2xl',
                      pathname === '/profile/employee/deliver' ? 'text-black dark:text-white' : 'text-nav-link-light dark:text-nav-link-dark'
                    )}
                  />
                }
                title="Entregar Almuerzo"
              />
              <ItemList
                href="/profile/employee/recharge"
                icon={
                  <FaMoneyBill1Wave
                    className={cn(
                      'text-2xl',
                      pathname === '/profile/employee/recharge' ? 'text-black dark:text-white' : 'text-nav-link-light dark:text-nav-link-dark'
                    )}
                  />
                }
                title="Recargar Saldo"
              />
            </ul>
          </div>
        </div>
      </div>
    </aside>
  )
}
