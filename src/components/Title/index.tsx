'use client'

import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

interface TitleProps {
  title: string
  numberBgGradient: string
}

export const Title = ({ title, numberBgGradient }: TitleProps) => {
  const { theme } = useTheme()
  const [themeFocus, setThemeFocus] = useState('')

  useEffect(() => {
    if (theme !== undefined) setThemeFocus(theme)
  }, [theme])

  return (
    <span className={cn(
      'block relative before:[-webkit-background-clip:text] before:[-webkit-text-fill-color:transparent] before:absolute before:top-0 before:left-0 before:z-0',
      themeFocus === 'dark' ? 'before:bg-gradient-text-dark' : 'before:bg-gradient-text-light',
      `before:content-["${title}"]`
    )}>
      <span className={cn(
        'relative bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]',
        `bg-gradient-${numberBgGradient} animate-color-cycle-${numberBgGradient}`
      )}>
        {title}
      </span>
    </span>
  )
}
