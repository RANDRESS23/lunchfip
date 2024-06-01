'use client'

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, User, Spinner, Chip, Pagination, type SortDescriptor, type Selection } from '@nextui-org/react'
import { toast } from 'sonner'
import { useConfetti } from '@/hooks/useConfetti'
import Realistic from 'react-canvas-confetti/dist/presets/realistic'
import api from '@/libs/api'
import { useEstudiantes } from '@/hooks/useEstudiantes'
import { createClient } from '@supabase/supabase-js'
import { BsToggle2Off, BsToggle2On } from 'react-icons/bs'
import { cn } from '@/libs/utils'
import { useMemo, useState } from 'react'
import { TopContentTable } from './TopContentTable'
import { type Estudiante } from '@/types/estudiantes'

interface StudentsTableProps {
  supabaseUrl: string
  serviceRolKey: string
}

const COLUMNS = [
  { name: 'USUARIO', uid: 'usuario', sortable: true },
  { name: 'NOMBRE', uid: 'nombre', sortable: true },
  { name: 'DOCUMENTO', uid: 'documento', sortable: true },
  { name: 'PROGRAMA', uid: 'programa', sortable: true },
  { name: 'CELULAR', uid: 'celular' },
  { name: 'SALDO', uid: 'saldo', sortable: true },
  { name: 'ESTADO', uid: 'estado', sortable: true },
  { name: 'ACCIONES', uid: 'acciones' }
]

const STATUS_OPTIONS = [
  { name: 'Activo', uid: 'Activo' },
  { name: 'Inactivo', uid: 'Inactivo' }
]

const INITIAL_VISIBLE_COLUMNS = ['usuario', 'nombre', 'documento', 'estado', 'acciones']

export const StudentsTable = ({ supabaseUrl, serviceRolKey }: StudentsTableProps) => {
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filterValue, setFilterValue] = useState('')
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS))
  const [statusFilter, setStatusFilter] = useState<Selection>('all')
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'nombre',
    direction: 'ascending'
  })
  const { estudiantes, estudiantesCount, setEstudiantes, loadingEstudiantes, totalEstudiantes, loadingTotalEstudiantes } = useEstudiantes({ page: page.toString(), rows: rowsPerPage.toString() })
  const { onInitHandler, onShoot } = useConfetti()

  const handleChangeState = (estado: string, idEstudiante: string, primerNombre: string, primerApellido: string) => {
    if (estado === 'Activo') {
      toast(`¿Estás seguro que deseas deshabilitar al estudiante "${primerNombre} ${primerApellido}?"`, {
        action: {
          label: 'Deshabilitar',
          onClick: () => { handleChangeStateStudent(idEstudiante, '876600h', 'Inactivo') }
        }
      })
    } else {
      toast(`¿Estás seguro que deseas habilitar al estudiante "${primerNombre} ${primerApellido}?"`, {
        action: {
          label: 'Habilitar',
          onClick: () => { handleChangeStateStudent(idEstudiante, '0h', 'Activo') }
        }
      })
    }
  }

  const handleChangeStateStudent = async (idEstudiante: string, banDuration: string, newState: string) => {
    try {
      const supabase = createClient(supabaseUrl, serviceRolKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })

      const { error } = await supabase.auth.admin.updateUserById(idEstudiante, {
        ban_duration: banDuration
      })

      if (error) {
        console.log({ error })

        return toast.error(`¡Ocurrió un error al ${newState === 'Inactivo' ? 'deshabilitar' : 'habilitar'} la cuenta del estudiante!.`)
      }

      const response = await api.patch('/estudiantes/estado', { id_estudiante: idEstudiante, estadoNuevo: newState })

      if (response.status === 200) {
        const estudiantesUpdated = estudiantes.map((estudiante) => {
          if (estudiante.id_estudiante === idEstudiante) {
            return { ...estudiante, estado: newState }
          }

          return estudiante
        })

        setEstudiantes(estudiantesUpdated)
        onShoot()
        toast.success(`¡Estudiante ${newState === 'Inactivo' ? 'deshabilitado' : 'habilitado'} exitosamente!`)
      }
    } catch (error: any) {
      if (error.response?.data !== undefined) {
        const errorsMessages = Object.values(error.response.data as Record<string, string>)
        let errorsMessagesString = ''

        errorsMessages.forEach((message: any) => {
          errorsMessagesString += `${message} ${'\n'}`
        })

        return toast.error(errorsMessagesString)
      }

      console.error({ error })
    }
  }

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return COLUMNS

    return COLUMNS.filter((column) => Array.from(visibleColumns).includes(column.uid))
  }, [visibleColumns])

  const filteredItems = useMemo(() => {
    let filteredUsers = [...estudiantes]

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) => {
        const document = `${user.numero_documento}`

        return document.includes(filterValue)
      })
    }
    if (statusFilter !== 'all' && Array.from(statusFilter).length !== STATUS_OPTIONS.length) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.estado)
      )
    }

    return filteredUsers
  }, [estudiantes, filterValue, statusFilter])

  const pages = useMemo(() => {
    return estudiantesCount ? Math.ceil(filteredItems.length / rowsPerPage) : 0
  }, [filteredItems, rowsPerPage])

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = useMemo(() => {
    return [...items].sort((a: Estudiante, b: Estudiante) => {
      const first = a[sortDescriptor.column as keyof Estudiante] as number
      const second = b[sortDescriptor.column as keyof Estudiante] as number
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
      topContent={<TopContentTable estudiantesCount={estudiantesCount} filterValue={filterValue} statusFilter={statusFilter} visibleColumns={visibleColumns} totalEstudiantes={totalEstudiantes} loadingTotalEstudiantes={loadingTotalEstudiantes} setVisibleColumns={setVisibleColumns} setStatusFilter={setStatusFilter} setFilterValue={setFilterValue} setPage={setPage} setRowsPerPage={setRowsPerPage} loadingEstudiantes={loadingEstudiantes} />}
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
        <TableBody items={sortedItems} emptyContent={'No hay estudiantes registrados en LunchFip.'} isLoading={loadingEstudiantes} loadingContent={<Spinner label="Cargando..." />}>
          {sortedItems.filter((item) => item.id_estudiante !== '').map((item) => (
            <TableRow key={item.id_estudiante}>
              {(columnKey) => {
                const saldoString = item.saldo.toString()
                const saldoParsed = saldoString.slice(0, saldoString.length - 3)
                const saldoParsed2 = saldoString.slice(saldoString.length - 3)
                const saldoParsed3 = saldoParsed !== '' ? `$ ${saldoParsed}.${saldoParsed2}` : '$ 0'

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

                if (columnKey === 'celular') {
                  return (
                    <TableCell className='text-center italic'>{item.celular}</TableCell>
                  )
                }

                if (columnKey === 'saldo') {
                  return (
                    <TableCell className='text-center italic'>{saldoParsed3}</TableCell>
                  )
                }

                if (columnKey === 'estado') {
                  return (
                    <TableCell className='text-center italic'>
                      <Chip className="capitalize" color={item.estado === 'Activo' ? 'success' : 'danger'} size="sm" variant="flat">
                        {item.estado}
                      </Chip>
                    </TableCell>
                  )
                }

                if (columnKey === 'acciones') {
                  return (
                    <TableCell className='text-center'>
                      <div className="relative flex items-center justify-center gap-2">
                        <Tooltip color={item.estado === 'Activo' ? 'success' : 'danger'} content={item.estado === 'Activo' ? 'Deshabilitar Estudiante' : 'Habilitar Estudiante'} >
                          <span
                            className={cn(
                              'text-lg cursor-pointer active:opacity-50',
                              item.estado === 'Activo' ? 'text-success' : 'text-danger'
                            )}
                            onClick={() => { handleChangeState(item.estado, item.id_estudiante, item.primer_nombre, item.primer_apellido) }}
                          >
                            {
                              item.estado === 'Activo'
                                ? <BsToggle2On className='text-3xl' />
                                : <BsToggle2Off className='text-3xl' />
                            }
                          </span>
                        </Tooltip>
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
      <Realistic onInit={onInitHandler} />
    </section>
  )
}
