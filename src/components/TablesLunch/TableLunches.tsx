'use client'

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react'
import { TitleAnimated } from '../TitleAnimated'

interface TableLunchesProps {
  title: string
  fechaUltimo: Date
  cantidad: number
}

export const TableLunches = ({ title, fechaUltimo, cantidad }: TableLunchesProps) => {
  const dateAux = new Date(fechaUltimo)
  dateAux.setUTCHours(dateAux.getUTCHours() + 5)
  const dateFormated = dateAux.toLocaleString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  })

  return (
    <div>
      <TitleAnimated
        text1='Estadística - '
        text2={title}
        textSize='text-xl'
      />
      <Table aria-label="Example static collection table" shadow='md'>
        <TableHeader>
          <TableColumn className='text-center bg-[#f3f2f2] dark:bg-[#3f3f4666] text-black dark:text-white transition-all'>FECHA - ULTIMO</TableColumn>
          <TableColumn className='text-center bg-[#f3f2f2] dark:bg-[#3f3f4666] text-black dark:text-white transition-all'>CANTIDAD TOTAL</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell className='text-center'>{dateFormated}</TableCell>
            <TableCell className='text-center'>{cantidad}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
