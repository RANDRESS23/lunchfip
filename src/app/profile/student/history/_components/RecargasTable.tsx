'use client'

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Pagination } from '@nextui-org/react'
import { useMemo, useState } from 'react'
import { useEstudiante } from '@/hooks/useEstudiante'
import { useEstudianteHistorial } from '@/hooks/useEstudianteHistorial'

const COLUMNS = [
  { name: 'N°', uid: 'numero', sortable: true },
  { name: 'FECHA RECARGA', uid: 'fecha_recarga', sortable: true },
  { name: 'HORA RECARGA', uid: 'hora_recarga', sortable: true },
  { name: 'SALDO RECARGADO', uid: 'saldo_recargado', sortable: true }
]

const ROWS_PER_PAGE = 25

export const RecargasTable = () => {
  const [page, setPage] = useState(1)
  const { estudiante } = useEstudiante()
  const { estudianteHistorialRecargas, estudianteHistorialRecargasCount, loadingEstudianteHistorial } = useEstudianteHistorial({ idEstudiante: estudiante.id_estudiante, page: page.toString(), rows: ROWS_PER_PAGE.toString() })

  const pages = useMemo(() => {
    return estudianteHistorialRecargasCount ? Math.ceil(estudianteHistorialRecargas.length / ROWS_PER_PAGE) : 0
  }, [estudianteHistorialRecargas, ROWS_PER_PAGE])

  const items = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE
    const end = start + ROWS_PER_PAGE

    return estudianteHistorialRecargas.slice(start, end)
  }, [page, estudianteHistorialRecargas, ROWS_PER_PAGE])

  return (
    <section className='w-full'>
      <Table
      isStriped
      aria-label="Tabla de historial de recargas en LunchFip"
      isHeaderSticky
      shadow='md'
      bottomContent={
        pages > 0
          ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={(page) => { setPage(page) }}
                />
              </div>
            )
          : null
      }>
        <TableHeader columns={COLUMNS}>
          {(column) => (
            <TableColumn
              key={column.uid}
              allowsSorting={column.sortable}
              className='text-center bg-[#f3f2f2] dark:bg-[#3f3f4666] text-black dark:text-white transition-all'
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent={'No hay recargas registradas en LunchFip.'} isLoading={loadingEstudianteHistorial} loadingContent={<Spinner label="Cargando..." />}>
          {items.filter((item) => item.id_recarga !== '').map((item, index) => (
            <TableRow key={item.id_recarga}>
              {(columnKey) => {
                const saldoString = item.saldo_recargado.toString()
                const saldoParsed = saldoString.slice(0, saldoString.length - 3)
                const saldoParsed2 = saldoString.slice(saldoString.length - 3)
                const saldoParsed3 = saldoParsed !== '' ? `$ ${saldoParsed}.${saldoParsed2}` : '$ 0'

                if (columnKey === 'numero') {
                  return (
                    <TableCell className='text-center italic'>{index + 1}</TableCell>
                  )
                }

                if (columnKey === 'fecha_recarga') {
                  return (
                    <TableCell className='text-center italic'>{item.fecha_recarga}</TableCell>
                  )
                }

                if (columnKey === 'hora_recarga') {
                  return (
                    <TableCell className='text-center'>
                      <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize italic">{item.hora_recarga}</p>
                        <p className="text-bold text-sm capitalize text-default-400 italic">{item.fecha_recarga}</p>
                      </div>
                    </TableCell>
                  )
                }

                if (columnKey === 'saldo_recargado') {
                  return (
                    <TableCell className='text-center italic'>{saldoParsed3}</TableCell>
                  )
                }

                return <TableCell>{''}</TableCell>
              }}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}
