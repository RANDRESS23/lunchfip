'use client'

import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'

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
  data: Array<{ name: string, cantidad: number }>
}

export const SimpleAreaChart = ({ text1, text2, data }: SimpleAreaChartProps) => {
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
