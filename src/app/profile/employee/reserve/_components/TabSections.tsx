'use client'

import { Tabs, Tab, Card, CardBody } from '@nextui-org/react'
import { ScannerQRCode } from './ScannerQRCode'

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
          <CardBody>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </CardBody>
        </Card>
      </Tab>
    </Tabs>
  )
}
