'use client'

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Chip, Pagination } from '@nextui-org/react'
import { useMemo, useState } from 'react'
import { useEstudiante } from '@/hooks/useEstudiante'
import { useEstudianteHistorial } from '@/hooks/useEstudianteHistorial'

const COLUMNS = [
  { name: 'N°', uid: 'numero', sortable: true },
  { name: 'TIPO RESERVA', uid: 'tipo_reserva', sortable: true },
  { name: 'FECHA RESERVA', uid: 'fecha_reserva', sortable: true },
  { name: 'HORA RESERVA', uid: 'hora_reserva', sortable: true },
  { name: 'ESTADO RESERVA', uid: 'estado_reserva', sortable: true },
  { name: 'FECHA ENTREGA', uid: 'fecha_entrega', sortable: true },
  { name: 'HORA ENTREGA', uid: 'hora_entrega', sortable: true }
]

const ROWS_PER_PAGE = 25

export const ReservasTable = () => {
  const [page, setPage] = useState(1)
  const { estudiante } = useEstudiante()
  const { estudianteHistorialReservas, estudianteHistorialReservasCount, loadingEstudianteHistorial } = useEstudianteHistorial({ idEstudiante: estudiante.id_estudiante, page: page.toString(), rows: ROWS_PER_PAGE.toString() })

  const pages = useMemo(() => {
    return estudianteHistorialReservasCount ? Math.ceil(estudianteHistorialReservas.length / ROWS_PER_PAGE) : 0
  }, [estudianteHistorialReservas, ROWS_PER_PAGE])

  const items = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE
    const end = start + ROWS_PER_PAGE

    return estudianteHistorialReservas.slice(start, end)
  }, [page, estudianteHistorialReservas, ROWS_PER_PAGE])

  return (
    <section className='w-full'>
      <Table
      isStriped
      aria-label="Tabla de historial de reservas en LunchFip"
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
        <TableBody items={items} emptyContent={'No hay reservas registradas en LunchFip.'} isLoading={loadingEstudianteHistorial} loadingContent={<Spinner label="Cargando..." />}>
          {items.filter((item) => item.fecha_reserva !== '').map((item, index) => (
            <TableRow key={item.fecha_reserva}>
              {(columnKey) => {
                if (columnKey === 'numero') {
                  return (
                    <TableCell className='text-center italic'>{index + 1}</TableCell>
                  )
                }

                if (columnKey === 'tipo_reserva') {
                  return (
                    <TableCell className='text-center'>
                      <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize italic">{item.tipo_reserva}</p>
                        <p className="text-bold text-sm capitalize text-default-400 italic">Reserva</p>
                      </div>
                    </TableCell>
                  )
                }

                if (columnKey === 'fecha_reserva') {
                  return (
                    <TableCell className='text-center italic'>{item.fecha_reserva}</TableCell>
                  )
                }

                if (columnKey === 'hora_reserva') {
                  return (
                    <TableCell className='text-center'>
                      <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize italic">{item.hora_reserva}</p>
                        <p className="text-bold text-sm capitalize text-default-400 italic">{item.fecha_reserva}</p>
                      </div>
                    </TableCell>
                  )
                }

                if (columnKey === 'estado_reserva') {
                  return (
                    <TableCell className='text-center italic'>
                      <Chip className="capitalize" color={item.estado_reserva === 'Activo' ? 'danger' : 'success'} size="sm" variant="flat">
                        {item.estado_reserva === 'Activo' ? 'Sin Entregar' : 'Entregado'}
                      </Chip>
                    </TableCell>
                  )
                }

                if (columnKey === 'fecha_entrega') {
                  return (
                    <TableCell className='text-center italic'>{item.fecha_entrega}</TableCell>
                  )
                }

                if (columnKey === 'hora_entrega') {
                  return (
                    <TableCell className='text-center'>
                      <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize italic">{item.hora_entrega}</p>
                        <p className="text-bold text-sm capitalize text-default-400 italic">{item.fecha_entrega}</p>
                      </div>
                    </TableCell>
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
