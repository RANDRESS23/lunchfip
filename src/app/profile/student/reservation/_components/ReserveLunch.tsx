'use client'

import { Button } from '@/components/Button'
import { useEstudiante } from '@/hooks/useEstudiante'

interface ReserveLunchProps {
  nextDate: Date
  nextFullDate: string
}

export const ReserveLunch = ({ nextDate, nextFullDate }: ReserveLunchProps) => {
  const { estudiante } = useEstudiante()

  const saldoString = estudiante.saldo.toString()
  const saldoParsed = saldoString.slice(0, saldoString.length - 3)
  const saldoParsed2 = saldoString.slice(saldoString.length - 3)
  const saldoParsed3 = saldoParsed !== '' ? `$ ${saldoParsed}.${saldoParsed2}` : '$ 0'

  return (
    <div className='flex flex-col items-center justify-center mt-10'>
      <h2 className='text-2xl font-semibold mb-5'>Mi Saldo</h2>
      <div className='px-20 py-12 bg-clip-text animate-color-cycle-4 rounded-lg'>
        <span className='text-2xl font-semibold'>{saldoParsed3}</span>
      </div>
      <h2 className='text-2xl font-semibold mt-12 text-center'>¿Deseas Reservar Almuerzo?</h2>
      <span>Para el día: {nextFullDate}</span>
      <Button
        type="button"
        text='Reservar'
        disabled={false}
      />
    </div>
  )
}
