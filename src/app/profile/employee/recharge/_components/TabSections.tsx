'use client'

import { Tabs, Tab, Card, CardBody } from '@nextui-org/react'
import { ScannerQRCode } from './ScannerQRCode'
import { FormRecharge } from './FormRecharge'

export const TabSections = () => {
  return (
    <Tabs aria-label="Options" variant='underlined' className='w-full my-5'>
      <Tab key="escanear" title="Escanear" className='w-full'>
        <Card className='py-5'>
          <CardBody>
            <ScannerQRCode />
          </CardBody>
        </Card>
      </Tab>
      <Tab key="digitar" title="Digitar" className='flex justify-center items-center'>
        <FormRecharge />
      </Tab>
    </Tabs>
  )
}
