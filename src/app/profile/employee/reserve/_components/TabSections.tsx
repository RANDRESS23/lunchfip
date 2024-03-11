'use client'

import { Tabs, Tab, Card, CardBody } from '@nextui-org/react'
import { ScannerQRCode } from './ScannerQRCode'
import { FormReserve } from './FormReserve'

export const TabSections = () => {
  return (
    <Tabs aria-label="Options" className='w-full mt-5'>
      <Tab key="escanear" title="Escanear">
        <Card className='py-10'>
          <CardBody>
            <ScannerQRCode />
          </CardBody>
        </Card>
      </Tab>
      <Tab key="digitar" title="Digitar">
        <Card>
          <CardBody className='flex justify-center items-center py-10'>
            <FormReserve />
          </CardBody>
        </Card>
      </Tab>
    </Tabs>
  )
}
