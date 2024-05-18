'use client'

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, User } from '@nextui-org/react'
import { EditIcon } from '../icons/EditIcon'
import { DeleteIcon } from '../icons/DeleteIcon'

export const EmployeeTable = () => {
  // const dateAux = new Date(fechaUltimo)
  // dateAux.setUTCHours(dateAux.getUTCHours() + 5)
  // const dateFormated = dateAux.toLocaleString('es-ES', {
  //   weekday: 'long',
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric',
  //   hour: 'numeric',
  //   minute: 'numeric',
  //   second: 'numeric'
  // })

  return (
    <section className='w-full'>
      <Table isStriped aria-label="Tabla de empleados registrados en LunchFip" shadow='md'>
        <TableHeader>
          <TableColumn className='text-center bg-[#f3f2f2] dark:bg-[#3f3f4666] text-black dark:text-white transition-all'>NOMBRE</TableColumn>
          <TableColumn className='text-center bg-[#f3f2f2] dark:bg-[#3f3f4666] text-black dark:text-white transition-all'>DOCUMENTO</TableColumn>
          <TableColumn className='text-center bg-[#f3f2f2] dark:bg-[#3f3f4666] text-black dark:text-white transition-all'>CORREO</TableColumn>
          <TableColumn className='text-center bg-[#f3f2f2] dark:bg-[#3f3f4666] text-black dark:text-white transition-all'>CELULAR</TableColumn>
          <TableColumn className='text-center bg-[#f3f2f2] dark:bg-[#3f3f4666] text-black dark:text-white transition-all'>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell className='text-center'>
              <User
                avatarProps={{ radius: 'lg', src: 'https://res.cloudinary.com/dje4ke8hw/image/upload/v1715980427/svgs/male-icon_hmnyeh.svg' }}
                description='raulquimbaya4@gmail.com'
                name='Raúl Quimbaya'
              >
                <span className='italic'>raulquimbaya4@gmail.com</span>
              </User>
            </TableCell>
            <TableCell className='text-center'>
              <div className="flex flex-col">
                <p className="text-bold text-sm capitalize italic">1109840239</p>
                <p className="text-bold text-sm capitalize text-default-400 italic">Cédula de Ciudadanía</p>
              </div>
            </TableCell>
            <TableCell className='text-center italic'>raulquimbaya4@gmail.com</TableCell>
            <TableCell className='text-center italic'>3153090045</TableCell>
            <TableCell className='text-center'>
              <div className="relative flex items-center justify-center gap-2">
                <Tooltip content="Editar Empleado">
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
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
          </TableRow>
          <TableRow key="2">
            <TableCell className='text-center'>
              <User
                avatarProps={{ radius: 'lg', src: 'https://res.cloudinary.com/dje4ke8hw/image/upload/v1715980438/svgs/female-icon_zktpzk.svg' }}
                description='raulquimbaya4@gmail.com'
                name='Raúl Quimbaya'
              >
                <span className='italic'>raulquimbaya4@gmail.com</span>
              </User>
            </TableCell>
            <TableCell className='text-center'>
              <div className="flex flex-col">
                <p className="text-bold text-sm capitalize italic">1109840239</p>
                <p className="text-bold text-sm capitalize text-default-400 italic">Cédula de Ciudadanía</p>
              </div>
            </TableCell>
            <TableCell className='text-center italic'>raulquimbaya4@gmail.com</TableCell>
            <TableCell className='text-center italic'>3153090045</TableCell>
            <TableCell className='text-center'>
              <div className="relative flex items-center justify-center gap-2">
                <Tooltip content="Editar Empleado">
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
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
          </TableRow>
        </TableBody>
      </Table>
    </section>
  )
}
