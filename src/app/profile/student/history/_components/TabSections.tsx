'use client'

import { Tabs, Tab } from '@nextui-org/react'
import { ReservasTable } from './ReservasTable'
import { RecargasTable } from './RecargasTable'

export const TabSections = () => {
  return (
    <Tabs aria-label="Options" variant='underlined' className='w-full font-inter-sans my-5 flex justify-center items-center'>
      <Tab key="reservas" title="Reservas" className='w-full'>
        <ReservasTable />
      </Tab>
      <Tab key="recargas" title="Recargas" className='w-full'>
        <RecargasTable />
      </Tab>
    </Tabs>
  )
}
