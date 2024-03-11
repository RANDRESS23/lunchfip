'use client'

import { Tabs, Tab, Card, CardBody } from '@nextui-org/react'
import { ScannerQRCode } from './ScannerQRCode'
import { FormDeliver } from './FormDeliver'

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
            <FormDeliver />
          </CardBody>
        </Card>
      </Tab>
    </Tabs>
  )
}
