import { Aside } from '@/components/Aside'
import { menuItemsEmployee } from '@/constants/itemsNavBar'

export default function EmployeeLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      <Aside items={menuItemsEmployee} />
      {children}
    </main>
  )
}
