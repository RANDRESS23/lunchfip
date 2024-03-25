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
        className
      )}
    >
      <div className="relative z-40">{children}</div>
    </div>
  )
}
