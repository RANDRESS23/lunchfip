import { SearchIcon } from '../icons/SearchIcon'
import { ChevronDownIcon } from '../icons/ChevronDownIcon'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from '@nextui-org/react'
import { useCallback } from 'react'

const STATUS_OPTIONS = [
  { name: 'Activo', uid: 'Activo' },
  { name: 'Inactivo', uid: 'Inactivo' }
]

const COLUMNS = [
  { name: 'USUARIO', uid: 'usuario', sortable: true },
  { name: 'NOMBRE', uid: 'nombre', sortable: true },
  { name: 'DOCUMENTO', uid: 'documento', sortable: true },
  { name: 'CORREO', uid: 'correo', sortable: true },
  { name: 'CELULAR', uid: 'celular' },
  { name: 'ESTADO', uid: 'estado', sortable: true },
  { name: 'ACCIONES', uid: 'acciones' }
]

interface TopContentTableProps {
  empleadosCount: number
  filterValue: string
  statusFilter: any
  visibleColumns: any
  setVisibleColumns: (value: any) => void
  setStatusFilter: (value: any) => void
  setFilterValue: (value: string) => void
  setPage: (page: number) => void
  setRowsPerPage: (rowsPerPage: number) => void
}

export const TopContentTable = ({ empleadosCount, filterValue, statusFilter, visibleColumns, setVisibleColumns, setStatusFilter, setFilterValue, setPage, setRowsPerPage }: TopContentTableProps) => {
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <div className='relative overflow-hidden p-[1px] rounded-xl w-full sm:max-w-[44%]'>
          <Input
            isClearable
            className="w-full"
            placeholder="Buscar por nombre..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => { onClear() }}
            onValueChange={onSearchChange}
          />
          <span
            className={
              'absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#00aaff_0%,#ff3366_50%,#00aaff_100%)] -z-10 animate-[spin_2s_linear_infinite]'
            }
          />
        </div>
        <div className="flex gap-3">
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
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
            <DropdownTrigger className="hidden sm:flex">
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
        <span className="text-default-400 text-small">Total {empleadosCount} empleados registrados</span>
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
