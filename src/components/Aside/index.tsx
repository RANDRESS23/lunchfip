import { BiSolidBookContent as DashboardIcon } from 'react-icons/bi'
import { FaUsersRectangle as MemebersIcon } from 'react-icons/fa6'
import { PiNotePencilFill } from 'react-icons/pi'
import {
  RiPieChartBoxLine as PosttestStatisticIcon,
  RiPieChartBoxFill as PretestStatisticIcon
} from 'react-icons/ri'
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
                href="/profile/employee/reserve"
                icon={
                  <PiNotePencilFill className="text-2xl dark:text-gray-400 text-gray-600" />
                }
                title="Reservar Almuerzo"
              />
              <ItemList
                href="/profile/admin/dashboard/statistics/pre-test"
                icon={
                  <PretestStatisticIcon className="text-2xl dark:text-gray-400 text-gray-600" />
                }
                title="Inst: Pre-Test"
              />
              <ItemList
                href="/profile/admin/dashboard/statistics/post-test"
                icon={
                  <PosttestStatisticIcon className="text-2xl dark:text-gray-400 text-gray-600" />
                }
                title="Inst: Post-Test"
              />
              <ItemList
                href="/profile/admin/dashboard/page-content"
                icon={
                  <DashboardIcon className="text-2xl dark:text-gray-400 text-gray-600" />
                }
                title="Contenido"
              />
              <ItemList
                href="/profile/admin/dashboard/teamMembers"
                icon={
                  <MemebersIcon className="text-2xl dark:text-gray-400 text-gray-600" />
                }
                title="Miembros Equipo"
              />
            </ul>
            {/* <div className="space-y-2 pt-2">
              <ItemList
                href="/profile/admin/dashboard/help"
                Icon={HelpIcon}
                title="Ayuda"
              />
            </div> */}
          </div>
        </div>
      </div>
    </aside>
  )
}
