'use client'

import { Tabs, Tab } from '@nextui-org/react'
import { SimpleLineChart } from './SimpleLineChart'
import { SimpleBarChart } from './SimpleBarChart'
import { SimpleAreaChart } from './SimpleAreaChart'

interface TabChartsProps {
  text1: string
  text2: string
  data: Array<{ name: string, cantidad: number }>
}

export const TabCharts = ({ text1, text2, data }: TabChartsProps) => {
  return (
    <Tabs aria-label="Options" variant='underlined' className='w-full font-inter-sans'>
      <Tab key="lineas" title="D. Lineas" className='w-full h-full flex flex-col'>
        <SimpleLineChart
          text1={text1}
          text2={text2}
          data={data}
        />
      </Tab>
      <Tab key="barras" title="D. Barras" className='w-full h-full flex flex-col'>
        <SimpleBarChart
          text1={text1}
          text2={text2}
          data={data}
        />
      </Tab>
      <Tab key="area" title="D. Área" className='w-full h-full flex flex-col'>
        <SimpleAreaChart
          text1={text1}
          text2={text2}
          data={data}
        />
      </Tab>
    </Tabs>
  )
}
