'use client'

import { Tabs, Tab, Card, CardBody } from '@nextui-org/react'
import { ScannerQRCode } from './ScannerQRCode'
import { FormDeliver } from './FormDeliver'

export const TabSections = () => {
  return (
    <Tabs aria-label="Options" className='w-full my-5'>
      <Tab key="escanear" title="Escanear" className='w-full'>
        <Card className='py-5'>
          <CardBody>
            <ScannerQRCode />
          </CardBody>
        </Card>
      </Tab>
      <Tab key="digitar" title="Digitar" className='flex justify-center items-center'>
        <FormDeliver />
      </Tab>
    </Tabs>
  )
}
