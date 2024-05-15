import { Aside } from '@/components/Aside'

export default function EmployeeLayout ({
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
