'use client'

import { TitleAnimated } from '@/components/TitleAnimated'
import { useEmpleado } from '@/hooks/useEmpleado'

export const WelcomeEmployee = () => {
  const { empleado } = useEmpleado()

  const firstName = `${empleado.primer_nombre[0]?.toUpperCase() ?? ''}${empleado.primer_nombre?.slice(1) ?? ''}`
  const lastName = `${empleado.primer_apellido[0]?.toUpperCase() ?? ''}${empleado.primer_apellido?.slice(1) ?? ''}`

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
