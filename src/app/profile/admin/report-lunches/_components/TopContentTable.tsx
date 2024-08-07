import { ChevronDownIcon } from '../icons/ChevronDownIcon'
import { SearchIcon } from '../icons/SearchIcon'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, DatePicker, Spinner } from '@nextui-org/react'
import { useCallback } from 'react'
import { parseDate, type DateValue } from '@internationalized/date'
import { I18nProvider } from '@react-aria/i18n'
import { cn } from '@/libs/utils'
import { PDFGenerator } from '@/components/PDFGenerator'
import { type EstudianteAlmuerzo } from '@/types/estudiantes'
import { useAlmuerzosTotales } from '@/hooks/useAlmuerzosTotales'
import { useAlmuerzosReservados } from '@/hooks/useAlmuerzosReservados'
import { useAlmuerzosEntregados } from '@/hooks/useAlmuerzosEntregados'
import { format } from '@formkit/tempo'

const STATUS_OPTIONS = [
  { name: 'Sin Entregar', uid: 'Activo' },
  { name: 'Entregado', uid: 'Inactivo' }
]

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

interface TopContentTableProps {
  estudiantesCount: number
  filterValue: string
  statusFilter: any
  visibleColumns: any
  fecha: DateValue
  loadingEstudiantesAlmuerzos: boolean
  totalEstudiantesAlmuerzos: EstudianteAlmuerzo[]
  loadingTotalEstudiantesAlmuerzos: boolean
  setVisibleColumns: (value: any) => void
  setStatusFilter: (value: any) => void
  setFilterValue: (value: string) => void
  setPage: (page: number) => void
  setRowsPerPage: (rowsPerPage: number) => void
  setFecha: (fecha: DateValue) => void
}

export const TopContentTable = ({ estudiantesCount, filterValue, statusFilter, visibleColumns, fecha, loadingEstudiantesAlmuerzos, loadingTotalEstudiantesAlmuerzos, totalEstudiantesAlmuerzos, setVisibleColumns, setStatusFilter, setFilterValue, setPage, setRowsPerPage, setFecha }: TopContentTableProps) => {
  const { almuerzosTotales, loadingAlmuerzosTotales } = useAlmuerzosTotales({ nextDate: fecha.toString() })
  const { almuerzosReservados, loadingAlmuerzosReservados } = useAlmuerzosReservados({ nextDate: fecha.toString() })
  const { almuerzosEntregados, loadingAlmuerzosEntregados } = useAlmuerzosEntregados({ nextDate: fecha.toString() })

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value)
      setPage(1)
    } else {
      setFilterValue('')
    }
  }, [])

  const onClear = useCallback(() => {
    setFilterValue('')
    setPage(1)
  }, [])

  const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value))
    setPage(1)
  }, [])

  const handleFecha = (newDate: DateValue) => {
    setFecha(newDate)
  }

  const getNextFullDate = () => {
    const fechaAux = new Date(fecha?.toString() ?? new Date().toString())
    const fechaAux2 = new Date(fechaAux.setDate(fechaAux.getDate() + 1))
    return format(fechaAux2, 'DD/MM/YYYY')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-3 lg:items-end">
        <div className='w-full flex items-center justify-start gap-3 h-full'>
          <div className='relative overflow-hidden p-[1px] rounded-xl w-[30%]'>
            <I18nProvider locale="co-CO">
              <DatePicker
                label="Fecha"
                value={fecha}
                onChange={handleFecha}
                minValue={parseDate('2024-03-13')}
                maxValue={parseDate('2024-07-22')}
                className="w-full"
                granularity="day"
                isDisabled={loadingEstudiantesAlmuerzos}
              />
            </I18nProvider>
            <span
              className={cn(
                'absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#00aaff_0%,#ff3366_50%,#00aaff_100%)] -z-10 animate-[spin_2s_linear_infinite]',
                loadingEstudiantesAlmuerzos ? 'opacity-0' : 'opacity-100'
              )}
            />
          </div>
          <div className='relative overflow-hidden p-[1px] rounded-xl w-[45%]'>
            <Input
              isClearable
              label='Documento'
              className="w-full"
              placeholder="Buscar por número de documento..."
              startContent={<SearchIcon />}
              value={filterValue}
              onClear={() => { onClear() }}
              onValueChange={onSearchChange}
              type='number'
              isDisabled={loadingEstudiantesAlmuerzos}
            />
            <span
              className={cn(
                'absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#00aaff_0%,#ff3366_50%,#00aaff_100%)] -z-10 animate-[spin_2s_linear_infinite]',
                loadingEstudiantesAlmuerzos ? 'opacity-0' : 'opacity-100'
              )}
            />
          </div>
        </div>
        <div className="flex justify-evenly gap-3">
          {
            (loadingTotalEstudiantesAlmuerzos || loadingAlmuerzosTotales || loadingAlmuerzosReservados || loadingAlmuerzosEntregados)
              ? <Spinner color='secondary' />
              : totalEstudiantesAlmuerzos.length !== 0
                ? (
                    <PDFGenerator
                      fileName={`Almuerzos-Registro-${fecha.toString()}-LunchFip`}
                      contactLabel='Tabla Registros de:'
                      contactName={`Almuerzos (${getNextFullDate()})`}
                      invoiceHeader={[
                        {
                          title: '#',
                          style: {
                            width: 10
                          }
                        },
                        {
                          title: 'Documento',
                          style: {
                            width: 30
                          }
                        },
                        {
                          title: 'Nombre Completo',
                          style: {
                            width: 50
                          }
                        },
                        {
                          title: 'Programa',
                          style: {
                            width: 45
                          }
                        },
                        {
                          title: 'Celular',
                          style: {
                            width: 25
                          }
                        },
                        {
                          title: 'Tipo Reserva',
                          style: {
                            width: 30
                          }
                        },
                        {
                          title: 'Hora Reserva',
                          style: {
                            width: 30
                          }
                        },
                        {
                          title: 'Estado Reserva',
                          style: {
                            width: 30
                          }
                        },
                        {
                          title: 'Hora Entrega',
                          style: {
                            width: 30
                          }
                        }
                      ]}
                      invoiceTable={totalEstudiantesAlmuerzos.map((estudiante, index) => [
                        index + 1,
                        estudiante.numero_documento,
                        `${estudiante.primer_nombre[0]?.toUpperCase() ?? ''}${estudiante.primer_nombre?.slice(1) ?? ''} ${estudiante.segundo_nombre[0]?.toUpperCase() ?? ''}${estudiante.segundo_nombre?.slice(1) ?? ''} ${estudiante.primer_apellido[0]?.toUpperCase() ?? ''}${estudiante.primer_apellido?.slice(1) ?? ''} ${estudiante.segundo_apellido[0]?.toUpperCase() ?? ''}${estudiante.segundo_apellido?.slice(1) ?? ''}`,
                        estudiante.programa,
                        estudiante.celular,
                        `${estudiante.reserva_empleado ? 'Presencial' : estudiante.reserva_virtual ? 'Virtual' : 'N/A'}`,
                        `${estudiante.hora_reserva} (${estudiante.fecha_reserva})`,
                        `${estudiante.estado_reserva === 'Activo' ? 'Sin Entregar' : 'Entregado'}`,
                        `${estudiante.hora_entrega} (${estudiante.fecha_entrega})`
                      ])}
                      invoiceLabel='Almuerzos Definidos #: '
                      invoiceNum={almuerzosTotales.total_almuerzos}
                      invoiceInvDate={`Total almuerzos reservados: ${almuerzosReservados.cantidad}`}
                      invoiceInvGenDate={`Total almuerzos entregados: ${almuerzosEntregados.cantidad}`}
                      orientationLandscape
                    />
                  )
                : null
          }
          <Dropdown>
            <DropdownTrigger className="flex">
              <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                Estados
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={statusFilter}
              selectionMode="multiple"
              onSelectionChange={setStatusFilter}
            >
              {STATUS_OPTIONS.map((status) => (
                <DropdownItem key={status.uid} className="capitalize">
                  {status.name.charAt(0).toUpperCase() + status.name.slice(1)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger className="flex">
              <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                Columas
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              onSelectionChange={setVisibleColumns}
            >
              {COLUMNS.map((column) => (
                <DropdownItem key={column.uid} className="capitalize">
                  {column.name.charAt(0).toUpperCase() + column.name.slice(1)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">Total {estudiantesCount} estudiantes encontrados</span>
        <label className="flex items-center text-default-400 text-small">
          Filas por página:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={onRowsPerPageChange}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </label>
      </div>
    </div>
  )
}
