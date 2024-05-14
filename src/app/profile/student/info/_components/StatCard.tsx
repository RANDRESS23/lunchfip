import { Skeleton } from '@nextui-org/react'

interface StatCardProps {
  label: string
  value: string | number
  loading: boolean
}

export const StatCard = ({ label, value, loading }: StatCardProps) => {
  return (
    <>
      {
        !loading
          ? (
              <div className="w-52 relative bg-grid-black dark:bg-grid-white flex flex-col justify-center items-center gap-3 p-5 border border-black dark:border-white rounded-lg">
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_0.5%,black)] rounded-lg" />
                <span className="text-lg text-center italic font-semibold z-10">{label}</span>
                <span className="text-2xl text-center italic font-semibold z-10">{value}</span>
              </div>
            )
          : (
              <Skeleton className="flex w-[190px] h-[145px] rounded-lg"/>
            )
      }
    </>
  )
}
