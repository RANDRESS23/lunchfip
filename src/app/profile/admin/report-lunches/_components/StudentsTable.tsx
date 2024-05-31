'use client'

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Spinner, Chip, Pagination, type SortDescriptor, type Selection } from '@nextui-org/react'
import { useMemo, useState } from 'react'
import { TopContentTable } from './TopContentTable'
import { type EstudianteAlmuerzo } from '@/types/estudiantes'
import { type DateValue, today, getLocalTimeZone } from '@internationalized/date'
import { useEstudiantesAlmuerzos } from '@/hooks/useEstudiantesAlmuerzos'

const COLUMNS = [
  { name: 'USUARIO', uid: 'usuario', sortable: true },
  { name: 'NOMBRE', uid: 'nombre', sortable: true },
  { name: 'DOCUMENTO', uid: 'documento', sortable: true },
  { name: 'PROGRAMA', uid: 'programa', sortable: true },
  { name: 'TIPO RESERVA', uid: 'tipo_reserva', sortable: true },
  { name: 'HORA RESERVA', uid: 'hora_reserva', sortable: true },
  { name: 'ESTADO RESERVA', uid: 'estado_reserva', sortable: true },
  { name: 'HORA ENTREGA', uid: 'hora_entrega', sortable: true },
  { name: 'CELULAR', uid: 'celular' }
]

const STATUS_OPTIONS = [
  { name: 'Sin Entregar', uid: 'Activo' },
  { name: 'Entregado', uid: 'Inactivo' }
]

const INITIAL_VISIBLE_COLUMNS = ['usuario', 'documento', 'hora_reserva', 'estado_reserva', 'hora_entrega']

export const StudentsTable = () => {
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [fecha, setFecha] = useState<DateValue>(today(getLocalTimeZone()))
  const [filterValue, setFilterValue] = useState('')
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS))
  const [statusFilter, setStatusFilter] = useState<Selection>('all')
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'nombre',
    direction: 'ascending'
  })
  const { estudiantesAlmuerzos, estudiantesAlmuerzosCount, loadingEstudiantesAlmuerzos, loadingTotalEstudiantesAlmuerzos, totalEstudiantesAlmuerzos } = useEstudiantesAlmuerzos({ fecha: fecha.toString(), page: page.toString(), rows: rowsPerPage.toString() })

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return COLUMNS

    return COLUMNS.filter((column) => Array.from(visibleColumns).includes(column.uid))
  }, [visibleColumns])

  const filteredItems = useMemo(() => {
    let filteredUsers = [...estudiantesAlmuerzos]

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) => {
        const document = `${user.numero_documento}`

        return document.includes(filterValue)
      })
    }
    if (statusFilter !== 'all' && Array.from(statusFilter).length !== STATUS_OPTIONS.length) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.estado_reserva)
      )
    }

    return filteredUsers
  }, [estudiantesAlmuerzos, filterValue, statusFilter])

  const pages = useMemo(() => {
    return estudiantesAlmuerzosCount ? Math.ceil(filteredItems.length / rowsPerPage) : 0
  }, [filteredItems, rowsPerPage])

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = useMemo(() => {
    return [...items].sort((a: EstudianteAlmuerzo, b: EstudianteAlmuerzo) => {
      const first = a[sortDescriptor.column as keyof EstudianteAlmuerzo] ?? 0
      const second = b[sortDescriptor.column as keyof EstudianteAlmuerzo] ?? 0
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, items])

  return (
    <section className='w-full'>
      <Table
      isStriped
      aria-label="Tabla de estudiantes registrados en LunchFip"
      isHeaderSticky
      shadow='md'
      topContent={<TopContentTable estudiantesCount={estudiantesAlmuerzosCount} filterValue={filterValue} statusFilter={statusFilter} visibleColumns={visibleColumns} fecha={fecha} totalEstudiantesAlmuerzos={totalEstudiantesAlmuerzos} loadingTotalEstudiantesAlmuerzos={loadingTotalEstudiantesAlmuerzos} setVisibleColumns={setVisibleColumns} setStatusFilter={setStatusFilter} setFilterValue={setFilterValue} setPage={setPage} setRowsPerPage={setRowsPerPage} setFecha={setFecha} loadingEstudiantesAlmuerzos={loadingEstudiantesAlmuerzos} />}
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      topContentPlacement="outside"
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
        <TableHeader columns={headerColumns}>
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
        <TableBody items={sortedItems} emptyContent={'No hay registros para la fecha seleccionada en LunchFip.'} isLoading={loadingEstudiantesAlmuerzos} loadingContent={<Spinner label="Cargando..." />}>
          {sortedItems.filter((item) => item.id_estudiante !== '').map((item) => (
            <TableRow key={item.id_estudiante}>
              {(columnKey) => {
                if (columnKey === 'usuario') {
                  return (
                    <TableCell className='text-center'>
                      <User
                        avatarProps={{ radius: 'lg', src: item.imageUrl }}
                        description={item.correo_institucional}
                        name={`${item.primer_nombre} ${item.primer_apellido}`}
                      >
                        <span className='italic'>{item.correo_institucional}</span>
                      </User>
                    </TableCell>
                  )
                }

                if (columnKey === 'nombre') {
                  return (
                    <TableCell className='text-center'>
                      <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize italic">{`${item.primer_nombre} ${item.segundo_nombre}`}</p>
                        <p className="text-bold text-sm capitalize text-default-400 italic">{`${item.primer_apellido} ${item.segundo_apellido}`}</p>
                      </div>
                    </TableCell>
                  )
                }

                if (columnKey === 'documento') {
                  return (
                    <TableCell className='text-center'>
                      <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize italic">{item.numero_documento}</p>
                        <p className="text-bold text-sm capitalize text-default-400 italic">{item.tipo_documento}</p>
                      </div>
                    </TableCell>
                  )
                }

                if (columnKey === 'programa') {
                  return (
                    <TableCell className='text-center'>
                      <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize italic">{item.programa}</p>
                        <p className="text-bold text-sm capitalize text-default-400 italic">{item.facultad}</p>
                      </div>
                    </TableCell>
                  )
                }

                if (columnKey === 'tipo_reserva') {
                  return (
                    <TableCell className='text-center italic'>
                      {item.reserva_empleado ? 'Presencial' : item.reserva_virtual ? 'Virtual' : 'N/A'}
                    </TableCell>
                  )
                }

                if (columnKey === 'celular') {
                  return (
                    <TableCell className='text-center italic'>{item.celular}</TableCell>
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
