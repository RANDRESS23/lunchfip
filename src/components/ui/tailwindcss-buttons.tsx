'use client'

import { cn } from '@/libs/utils'

export const ButtonsCard = ({
  children,
  className,
  onClick
}: {
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'w-full overflow-hidden relative flex items-center justify-center',
        className
      )}
    >
      <div className="absolute inset-0" />
      <div className="relative z-40 w-full">{children}</div>
    </div>
  )
}
