'use client'

import { TitleAnimated } from '@/components/TitleAnimated'
import { useAdministrador } from '@/hooks/useAdministrador'

export const WelcomeAdmin = () => {
  const { administrador } = useAdministrador()

  const firstName = `${administrador.primer_nombre[0]?.toUpperCase() ?? ''}${administrador.primer_nombre?.slice(1) ?? ''}`
  const lastName = `${administrador.primer_apellido[0]?.toUpperCase() ?? ''}${administrador.primer_apellido?.slice(1) ?? ''}`

  return (
    <div>
      <TitleAnimated
        text1='Bienvenido a LunchFip'
        text2={`${firstName} ${lastName}`}
        textSize='text-4xl lg:text-5xl'
        isTextCol
      />
    </div>
  )
}
