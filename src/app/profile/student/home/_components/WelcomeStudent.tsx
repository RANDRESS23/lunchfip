'use client'

import { TitleAnimated } from '@/components/TitleAnimated'
import { useEstudiante } from '@/hooks/useEstudiante'

export const WelcomeStudent = () => {
  const { estudiante } = useEstudiante()

  const firstName = `${estudiante.primer_nombre[0]?.toUpperCase() ?? ''}${estudiante.primer_nombre?.slice(1) ?? ''}`
  const lastName = `${estudiante.primer_apellido[0]?.toUpperCase() ?? ''}${estudiante.primer_apellido?.slice(1) ?? ''}`

  return (
    <div>
      <TitleAnimated
        text1='Bienvenido a LunchFip'
        text2={`${firstName} ${lastName}`}
        textSize='text-4xl lg:text-5xl'
      />
    </div>
  )
}
