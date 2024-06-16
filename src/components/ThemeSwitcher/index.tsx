'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { MdWbSunny } from 'react-icons/md'
import { TbMoonFilled } from 'react-icons/tb'

/* ➡ Componente que renderiza el switch para cambiar el tema del aplicativo (light | dark) */
export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div>
      {
        theme === 'dark'
          ? (
              <button onClick={() => { setTheme('light') }} className='text-2xl flex justify-center items-center'>
                <MdWbSunny />
              </button>
            )
          : (
              <button onClick={() => { setTheme('dark') }} className='text-2xl flex justify-center items-center'>
                <TbMoonFilled />
              </button>
            )
      }
    </div>
  )
}
