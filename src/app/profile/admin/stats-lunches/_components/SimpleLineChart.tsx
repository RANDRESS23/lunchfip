'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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

interface SimpleLineChartProps {
  text1: string
  text2: string
  data: Array<{ name: string, cantidad: number }>
}

export const SimpleLineChart = ({ text1, text2, data }: SimpleLineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="90%">
      <LineChart
        width={100}
        height={100}
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tickLine={false} style={{ fontSize: '15px' }} />
        <YAxis style={{ fontSize: '15px' }} />
        <Tooltip content={<CustomTooltip text1={text1} text2={text2} />} />
        <Legend />
        <Line type="monotone" dataKey="cantidad" stroke="#00aaff" />
      </LineChart>
    </ResponsiveContainer>
  )
}
