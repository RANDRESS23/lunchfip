'use client'

import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'

const data = [
  {
    name: '27/05',
    cantidad: 400
  },
  {
    name: '28/05',
    cantidad: 500
  },
  {
    name: '29/05',
    cantidad: 300
  },
  {
    name: '30/05',
    cantidad: 300
  },
  {
    name: '31/05',
    cantidad: 400
  },
  {
    name: '01/06',
    cantidad: 400
  },
  {
    name: '02/06',
    cantidad: 500
  }
]

const CustomTooltip = ({ active, payload, label, text1, text2 }: any) => {
  if (active && payload?.length) {
    return (
      <div className="flex flex-col justify-start items-start bg-white dark:bg-black p-3 rounded-lg">
        <p className="font-semibold text-sm">{`${label} : ${payload[0].value}`}</p>
        <p className="text-neutral-800 dark:text-neutral-200 text-sm">{text1}</p>
        <p className="text-neutral-500 dark:text-neutral-400 text-xs">{`${text2} ${label}`}</p>
      </div>
    )
  }

  return null
}

interface SimpleAreaChartProps {
  text1: string
  text2: string
}

export const SimpleAreaChart = ({ text1, text2 }: SimpleAreaChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="90%">
      <AreaChart
        width={100}
        height={100}
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tickLine={false} style={{ fontSize: '15px' }} />
        <YAxis style={{ fontSize: '15px' }} />
        <Tooltip content={<CustomTooltip text1={text1} text2={text2} />} />
        <Legend />
        <Area dataKey="cantidad" fill="#00aaff" stroke="#005b88" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
