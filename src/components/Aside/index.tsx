import { FaMoneyBill1Wave } from 'react-icons/fa6'
import { PiNotePencilFill } from 'react-icons/pi'
import { IoFastFoodSharp } from 'react-icons/io5'
import { GiBowlOfRice } from 'react-icons/gi'
import { ItemList } from './ItemList'

export const Aside = () => {
  return (
    <aside
      id="sidebar"
      className="fixed hidden h-full top-0 left-0 mt-[65px] lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75"
      aria-label="Sidebar"
    >
      <div className="relative flex-1 flex flex-col min-h-0 border-r-small border-gray-300 dark:border-gray-500/20 pt-0">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 divide-y space-y-1">
            <ul className="space-y-2 pb-2">
              <ItemList
                href="/profile/employee/lunch"
                icon={
                  <IoFastFoodSharp className="text-2xl dark:text-gray-400 text-gray-600" />
                }
                title="Definir Almuerzos"
              />
              <ItemList
                href="/profile/employee/reserve"
                icon={
                  <PiNotePencilFill className="text-2xl dark:text-gray-400 text-gray-600" />
                }
                title="Reservar Almuerzo"
              />
              <ItemList
                href="/profile/employee/deliver"
                icon={
                  <GiBowlOfRice className="text-2xl dark:text-gray-400 text-gray-600" />
                }
                title="Entregar Almuerzo"
              />
              <ItemList
                href="/profile/employee/recharge"
                icon={
                  <FaMoneyBill1Wave className="text-2xl dark:text-gray-400 text-gray-600" />
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
