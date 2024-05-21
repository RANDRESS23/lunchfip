'use client'

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, User, useDisclosure, Spinner } from '@nextui-org/react'
import { EditIcon } from '../icons/EditIcon'
import { DeleteIcon } from '../icons/DeleteIcon'
import { useEmailsEmpleados } from '@/hooks/useEmailsEmpleados'
import { ModalEditEmployee } from './ModalEditEmployee'
import { type Empleado } from '@/types/empleados'
import { useEmpleado } from '@/hooks/useEmpleado'
import { createClient } from '@supabase/supabase-js'
import { toast } from 'sonner'
import { useConfetti } from '@/hooks/useConfetti'
import Realistic from 'react-canvas-confetti/dist/presets/realistic'
import api from '@/libs/api'

interface EmployeeTableProps {
  supabaseUrl: string
  serviceRolKey: string
}

export const EmployeeTable = ({ supabaseUrl, serviceRolKey }: EmployeeTableProps) => {
  const { empleados, setEmpleados, loadingEmpleados } = useEmailsEmpleados()
  const { setEmpleado } = useEmpleado()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onInitHandler, onShoot } = useConfetti()

  const handleOpen = (empleado: Empleado) => {
    setEmpleado(empleado)
    onOpen()
  }

  const handleDeleteEmployee = ({ id_empleado: idEmpleado, primer_nombre: primerNombre, primer_apellido: primerApellido }: { id_empleado: string, primer_nombre: string, primer_apellido: string }) => {
    toast(`¿Estás seguro que deseas elminar al empleado "${primerNombre} ${primerApellido}?"`, {
      action: {
        label: 'Eliminar',
        onClick: () => { deleteEmployee(idEmpleado) }
      }
    })
  }

  const deleteEmployee = async (idEmpleado: string) => {
    try {
      const supabase = createClient(supabaseUrl, serviceRolKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })

      const { error } = await supabase.auth.admin.deleteUser(idEmpleado)

      if (error) {
        console.log({ error })

        return toast.error('¡Ocurrió un error al eliminar la cuenta del empleado!.')
      }

      const response = await api.delete(`/empleados/${idEmpleado}`)

      if (response.status === 200) {
        setEmpleados(response.data.empleados as Empleado[])
        onShoot()
        toast.success('¡Empleado eliminado exitosamente!')
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
        <TableBody items={empleados} emptyContent={'No hay empleados registrados en LunchFip.'} isLoading={loadingEmpleados} loadingContent={<Spinner label="Cargando..." />}>
          {empleados.map((item) => (
            <TableRow key={item.id_empleado}>
              {(columnKey) => {
                if (columnKey === '$.0') {
                  return (
                    <TableCell className='text-center'>
                      <User
                        avatarProps={{ radius: 'lg', src: item.id_sexo === '90e58398-2198-40b9-9a09-e55b6df94bee' ? 'https://res.cloudinary.com/dje4ke8hw/image/upload/v1715980427/svgs/male-icon_hmnyeh.svg' : 'https://res.cloudinary.com/dje4ke8hw/image/upload/v1715980438/svgs/female-icon_zktpzk.svg' }}
                        description={item.correo}
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
                        <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => {
                          handleDeleteEmployee({
                            id_empleado: item.id_empleado,
                            primer_nombre: item.primer_nombre,
                            primer_apellido: item.primer_apellido
                          })
                        }}>
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
      <Realistic onInit={onInitHandler} />
    </section>
  )
}
