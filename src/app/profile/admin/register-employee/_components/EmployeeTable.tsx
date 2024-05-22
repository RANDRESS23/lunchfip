'use client'

import { useMemo, useState } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, User, useDisclosure, Spinner, type Selection, type SortDescriptor, Chip, Pagination } from '@nextui-org/react'
import { EditIcon } from '../icons/EditIcon'
import { useEmpleados } from '@/hooks/useEmpleados'
import { ModalEditEmployee } from './ModalEditEmployee'
import { type Empleado } from '@/types/empleados'
import { useEmpleado } from '@/hooks/useEmpleado'
import { createClient } from '@supabase/supabase-js'
import { toast } from 'sonner'
import { useConfetti } from '@/hooks/useConfetti'
import Realistic from 'react-canvas-confetti/dist/presets/realistic'
import api from '@/libs/api'
import { cn } from '@/libs/utils'
import { BsToggle2Off, BsToggle2On } from 'react-icons/bs'
import { TopContentTable } from './TopContentTable'

interface EmployeeTableProps {
  supabaseUrl: string
  serviceRolKey: string
}

const COLUMNS = [
  { name: 'USUARIO', uid: 'usuario', sortable: true },
  { name: 'NOMBRE', uid: 'nombre', sortable: true },
  { name: 'DOCUMENTO', uid: 'documento', sortable: true },
  { name: 'CORREO', uid: 'correo', sortable: true },
  { name: 'CELULAR', uid: 'celular' },
  { name: 'ESTADO', uid: 'estado', sortable: true },
  { name: 'ACCIONES', uid: 'acciones' }
]

const STATUS_OPTIONS = [
  { name: 'Activo', uid: 'Activo' },
  { name: 'Inactivo', uid: 'Inactivo' }
]

const INITIAL_VISIBLE_COLUMNS = ['usuario', 'nombre', 'documento', 'estado', 'acciones']

export const EmployeeTable = ({ supabaseUrl, serviceRolKey }: EmployeeTableProps) => {
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filterValue, setFilterValue] = useState('')
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS))
  const [statusFilter, setStatusFilter] = useState<Selection>('all')
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'nombre',
    direction: 'ascending'
  })
  const { empleados, empleadosCount, setEmpleados, loadingEmpleados } = useEmpleados({ page: page.toString(), rows: rowsPerPage.toString() })
  const { setEmpleado } = useEmpleado()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onInitHandler, onShoot } = useConfetti()

  const handleOpen = (empleado: Empleado) => {
    setEmpleado(empleado)
    onOpen()
  }

  const handleChangeState = (estado: string, idEmpleado: string, primerNombre: string, primerApellido: string) => {
    if (estado === 'Activo') {
      toast(`¿Estás seguro que deseas deshabilitar al empleado "${primerNombre} ${primerApellido}?"`, {
        action: {
          label: 'Deshabilitar',
          onClick: () => { handleChangeStateEmployee(idEmpleado, '876600h', 'Inactivo') }
        }
      })
    } else {
      toast(`¿Estás seguro que deseas habilitar al empleado "${primerNombre} ${primerApellido}?"`, {
        action: {
          label: 'Habilitar',
          onClick: () => { handleChangeStateEmployee(idEmpleado, '0h', 'Activo') }
        }
      })
    }
  }

  const handleChangeStateEmployee = async (idEmpleado: string, banDuration: string, newState: string) => {
    try {
      const supabase = createClient(supabaseUrl, serviceRolKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })

      const { error } = await supabase.auth.admin.updateUserById(idEmpleado, {
        ban_duration: banDuration
      })

      if (error) {
        console.log({ error })

        return toast.error(`¡Ocurrió un error al ${newState === 'Inactivo' ? 'deshabilitar' : 'habilitar'} la cuenta del empleado!.`)
      }

      const response = await api.patch('/empleados/estado', { id_empleado: idEmpleado, estadoNuevo: newState })

      if (response.status === 200) {
        const empleadoUpdated = empleados.map((empleado) => {
          if (empleado.id_empleado === idEmpleado) {
            return { ...empleado, estado: newState }
          }

          return empleado
        })

        setEmpleados(empleadoUpdated)
        onShoot()
        toast.success(`¡Empleado ${newState === 'Inactivo' ? 'deshabilitado' : 'habilitado'} exitosamente!`)
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
    let filteredUsers = [...empleados]

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) => {
        const fullName = `${user.primer_nombre} ${user.segundo_nombre} ${user.primer_apellido} ${user.segundo_apellido}`

        return fullName.toLowerCase().includes(filterValue.toLowerCase())
      })
    }
    if (statusFilter !== 'all' && Array.from(statusFilter).length !== STATUS_OPTIONS.length) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.estado)
      )
    }

    return filteredUsers
  }, [empleados, filterValue, statusFilter])

  const pages = useMemo(() => {
    return empleadosCount ? Math.ceil(filteredItems.length / rowsPerPage) : 0
  }, [filteredItems, rowsPerPage])

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = useMemo(() => {
    return [...items].sort((a: Empleado, b: Empleado) => {
      const first = a[sortDescriptor.column as keyof Empleado]
      const second = b[sortDescriptor.column as keyof Empleado]
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, items])

  return (
    <section className='w-full'>
      <Table
        isStriped
        aria-label="Tabla de empleados registrados en LunchFip"
        isHeaderSticky
        shadow='md'
        topContent={<TopContentTable empleadosCount={empleadosCount} filterValue={filterValue} statusFilter={statusFilter} visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} setStatusFilter={setStatusFilter} setFilterValue={setFilterValue} setPage={setPage} setRowsPerPage={setRowsPerPage} />}
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
        }
      >
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
        <TableBody items={sortedItems} emptyContent={'No hay empleados registrados en LunchFip.'} isLoading={loadingEmpleados} loadingContent={<Spinner label="Cargando..." />}>
          {sortedItems.filter((item) => item.id_empleado !== '').map((item) => (
            <TableRow key={item.id_empleado}>
              {(columnKey) => {
                if (columnKey === 'usuario') {
                  return (
                    <TableCell className='text-center'>
                      <User
                        avatarProps={{ radius: 'lg', src: item.sexo === 'Masculino' ? 'https://res.cloudinary.com/dje4ke8hw/image/upload/v1715980427/svgs/male-icon_hmnyeh.svg' : 'https://res.cloudinary.com/dje4ke8hw/image/upload/v1715980438/svgs/female-icon_zktpzk.svg' }}
                        description={item.correo}
                        name={`${item.primer_nombre} ${item.primer_apellido}`}
                      >
                        <span className='italic'>{item.correo}</span>
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
                        <p className="text-bold text-sm capitalize text-default-400 italic">Cédula de Ciudadanía</p>
                      </div>
                    </TableCell>
                  )
                }

                if (columnKey === 'correo') {
                  return (
                    <TableCell className='text-center italic'>{item.correo}</TableCell>
                  )
                }

                if (columnKey === 'celular') {
                  return (
                    <TableCell className='text-center italic'>{item.celular}</TableCell>
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
                        {
                          item.estado === 'Activo' && (
                            <Tooltip content="Editar Empleado">
                              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => { handleOpen(item) }}>
                                <EditIcon />
                              </span>
                            </Tooltip>
                          )
                        }
                        <Tooltip color={item.estado === 'Activo' ? 'success' : 'danger'} content={item.estado === 'Activo' ? 'Deshabilitar Estudiante' : 'Habilitar Estudiante'} >
                          <span
                            className={cn(
                              'text-lg cursor-pointer active:opacity-50',
                              item.estado === 'Activo' ? 'text-success' : 'text-danger'
                            )}
                            onClick={() => { handleChangeState(item.estado, item.id_empleado, item.primer_nombre, item.primer_apellido) }}
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
      <ModalEditEmployee
        isOpen={isOpen}
        onClose={onClose}
        supabaseUrl={supabaseUrl}
        serviceRolKey={serviceRolKey}
      />
      <Realistic onInit={onInitHandler} />
    </section>
  )
}
