interface DashboardCardProps {
  label: string
  amount: number
  description: string
  Icon: React.ReactElement
}

export const DashBoardCard = ({
  label,
  amount,
  description,
  Icon
}: DashboardCardProps) => {
  return (
    <div className="w-80 relative bg-grid-black dark:bg-grid-white border border-black dark:border-white shadow flex flex-col justify-between gap-3 rounded-lg p-5 h-full">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_0.5%,black)] rounded-lg" />
      <section className="flex justify-between gap-2 z-10">
        <p className="text-lg font-semibold">{label}</p>
        <span>{Icon}</span>
      </section>
      <section className="flex z-10">
        <h2 className="text-5xl font-semibold italic">{amount}</h2>
      </section>
      <section className="flex z-10">
        <p className="text-md italic">{description}</p>
      </section>
    </div>
  )
}
