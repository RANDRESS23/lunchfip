'use client'

import { cn } from '@/libs/utils'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

interface SubTitleProps {
  description: string
}

export const SubTitle = ({ description }: SubTitleProps) => {
  const { theme } = useTheme()
  const [themeFocus, setThemeFocus] = useState('')

  useEffect(() => {
    if (theme !== undefined) setThemeFocus(theme)
  }, [theme])

  return (
    <p className={cn(
      'text-lg text-center container flex justify-center items-center flex-wrap italic lg:max-w-2xl',
      themeFocus === 'dark' ? 'text-[#888888]' : 'text-[#666666]'
    )}>
      {description}
    </p>
  )
}
