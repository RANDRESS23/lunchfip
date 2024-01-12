'use client'

import { cn } from '@/libs/utils'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

export const Title = () => {
  const { theme } = useTheme()
  const [themeFocus, setThemeFocus] = useState('')

  useEffect(() => {
    if (theme !== undefined) setThemeFocus(theme)
  }, [theme])

  return (
    <>
      <span className={cn(
        'block relative before:[-webkit-background-clip:text] before:[-webkit-text-fill-color:transparent] before:absolute before:content-["Reserva."] before:top-0 before:left-0 before:z-0',
        themeFocus === 'light' ? 'before:bg-gradient-text-light' : 'before:bg-gradient-text-dark'
      )}>
        <span className='relative bg-gradient-1 bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] animate-color-cycle-1'>Reserva.</span>
      </span>
      <span className={cn(
        'block relative before:[-webkit-background-clip:text] before:[-webkit-text-fill-color:transparent] before:absolute before:content-["Escanea."] before:top-0 before:left-0 before:z-0',
        themeFocus === 'light' ? 'before:bg-gradient-text-light' : 'before:bg-gradient-text-dark'
      )}>
        <span className='relative bg-gradient-2 bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] animate-color-cycle-2'>Escanea.</span>
      </span>
      <span className={cn(
        'block relative before:[-webkit-background-clip:text] before:[-webkit-text-fill-color:transparent] before:absolute before:content-["Disfruta."] before:top-0 before:left-0 before:z-',
        themeFocus === 'light' ? 'before:bg-gradient-text-light' : 'before:bg-gradient-text-dark'
      )}>
        <span className='relative bg-gradient-3 bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] animate-color-cycle-3'>Disfruta.</span>
      </span>
    </>
  )
}
