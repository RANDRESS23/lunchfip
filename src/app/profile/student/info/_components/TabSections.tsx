'use client'

import { Tabs, Tab } from '@nextui-org/react'
import { CodigoQR } from './CodigoQR'
import { StudentStats } from './StudentStats'

export const TabSections = () => {
  return (
    <Tabs aria-label="Options" variant='underlined' className='w-full font-inter-sans my-5 flex justify-center items-center'>
      <Tab key="estadisticas" title="Estadísticas" className='w-full'>
        <StudentStats />
      </Tab>
      <Tab key="datos" title="Datos" className='flex justify-center items-center'>
        {/* <FormReserve /> */}
      </Tab>
      <Tab key="codigo" title="Códgio QR" className='flex justify-center items-center'>
        <CodigoQR />
      </Tab>
    </Tabs>
  )
}
