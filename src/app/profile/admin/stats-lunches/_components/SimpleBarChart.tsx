'use client'

import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Rectangle, BarChart, Bar } from 'recharts'

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

interface SimpleBarChartProps {
  text1: string
  text2: string
  data: Array<{ name: string, cantidad: number }>
}

export const SimpleBarChart = ({ text1, text2, data }: SimpleBarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart
        width={100}
        height={100}
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tickLine={false} style={{ fontSize: '15px' }} />
        <YAxis style={{ fontSize: '15px' }} />
        <Tooltip content={<CustomTooltip text1={text1} text2={text2} />} />
        <Legend />
        <Bar dataKey="cantidad" fill="#00aaff" activeBar={<Rectangle fill="#ff3366" stroke="#ee2c5c" />} />
      </BarChart>
    </ResponsiveContainer>
  )
}
