'use client'

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, User, useDisclosure } from '@nextui-org/react'
import { EditIcon } from '../icons/EditIcon'
import { DeleteIcon } from '../icons/DeleteIcon'
import { useEmailsEmpleados } from '@/hooks/useEmailsEmpleados'
import { ModalEditEmployee } from './ModalEditEmployee'
import { type Empleado } from '@/types/empleados'
import { useEmpleado } from '@/hooks/useEmpleado'

interface EmployeeTableProps {
  supabaseUrl: string
  serviceRolKey: string
}

export const EmployeeTable = ({ supabaseUrl, serviceRolKey }: EmployeeTableProps) => {
  const { empleados } = useEmailsEmpleados()
  const { setEmpleado } = useEmpleado()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleOpen = (empleado: Empleado) => {
    setEmpleado(empleado)
    onOpen()
  }

  return (
    <section className='w-full'>
      <Table isStriped aria-label="Tabla de empleados registrados en LunchFip" shadow='md'>
        <TableHeader>
          <TableColumn className='text-center bg-[#f3f2f2] dark:bg-[#3f3f4666] text-black dark:text-white transition-all'>USUARIO</TableColumn>
          <TableColumn className='text-center bg-[#f3f2f2] dark:bg-[#3f3f4666] text-black dark:text-white transition-all'>NOMBRE</TableColumn>
          <TableColumn className='text-center bg-[#f3f2f2] dark:bg-[#3f3f4666] text-black dark:text-white transition-all'>DOCUMENTO</TableColumn>
          <TableColumn className='text-center bg-[#f3f2f2] dark:bg-[#3f3f4666] text-black dark:text-white transition-all'>CORREO</TableColumn>
          <TableColumn className='text-center bg-[#f3f2f2] dark:bg-[#3f3f4666] text-black dark:text-white transition-all'>CELULAR</TableColumn>
          <TableColumn className='text-center bg-[#f3f2f2] dark:bg-[#3f3f4666] text-black dark:text-white transition-all'>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody items={empleados}>
          {empleados.map((item) => (
            <TableRow key={item.id_empleado}>
              {(columnKey) => {
                if (columnKey === '$.0') {
                  return (
                    <TableCell className='text-center'>
                      <User
                        avatarProps={{ radius: 'lg', src: 'https://res.cloudinary.com/dje4ke8hw/image/upload/v1715980427/svgs/male-icon_hmnyeh.svg' }}
                        description='raulquimbaya4@gmail.com'
                        name={`${item.primer_nombre} ${item.primer_apellido}`}
                      >
                        <span className='italic'>{item.correo}</span>
                      </User>
                    </TableCell>
                  )
                }

                if (columnKey === '$.1') {
                  return (
                    <TableCell className='text-center'>
                      <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize italic">{`${item.primer_nombre} ${item.segundo_nombre}`}</p>
                        <p className="text-bold text-sm capitalize text-default-400 italic">{`${item.primer_apellido} ${item.segundo_apellido}`}</p>
                      </div>
                    </TableCell>
                  )
                }

                if (columnKey === '$.2') {
                  return (
                    <TableCell className='text-center'>
                      <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize italic">{item.numero_documento}</p>
                        <p className="text-bold text-sm capitalize text-default-400 italic">Cédula de Ciudadanía</p>
                      </div>
                    </TableCell>
                  )
                }

                if (columnKey === '$.3') {
                  return (
                    <TableCell className='text-center italic'>{item.correo}</TableCell>
                  )
                }

                if (columnKey === '$.4') {
                  return (
                    <TableCell className='text-center italic'>{item.celular}</TableCell>
                  )
                }

                return (
                  <TableCell className='text-center'>
                    <div className="relative flex items-center justify-center gap-2">
                      <Tooltip content="Editar Empleado">
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => { handleOpen(item) }}>
                          <EditIcon />
                        </span>
                      </Tooltip>
                      <Tooltip color="danger" content="Eliminar Empleado">
                        <span className="text-lg text-danger cursor-pointer active:opacity-50">
                          <DeleteIcon />
                        </span>
                      </Tooltip>
                    </div>
                  </TableCell>
                )
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
    </section>
  )
}
