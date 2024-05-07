'use client'

import { SparklesCore } from '@/components/ui/sparkles'
import { useTheme } from 'next-themes'

export const BgParticles = () => {
  const { theme } = useTheme()

  return (
    <div className="w-full absolute inset-0 h-screen -z-10">
      <SparklesCore
        id="tsparticlesfullpage"
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="w-full h-full"
        particleColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
      />
    </div>
  )
}
