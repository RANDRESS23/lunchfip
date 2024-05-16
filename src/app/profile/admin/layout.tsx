import { Aside } from '@/components/Aside'
import { menuItemsAdmin } from '@/constants/itemsNavBar'

export default function AdminLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      <Aside items={menuItemsAdmin} />
      {children}
    </main>
  )
}
