import { Aside } from '@/components/Aside'

export default function AdminLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      <Aside />
      {children}
    </main>
  )
}
