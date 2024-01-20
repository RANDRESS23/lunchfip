'use client'

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react'

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
      <h2 className='text-xl mb-3 font-semibold dark:text-gray-400 text-gray-800/90 tracking-tighter text-center'>
        {title}
      </h2>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>FECHA - ULTIMO</TableColumn>
          <TableColumn>CANTIDAD</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell>{dateFormated}</TableCell>
            <TableCell>{cantidad}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
