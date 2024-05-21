'use client'

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, User, Spinner, Chip, Pagination } from '@nextui-org/react'
import { toast } from 'sonner'
import { useConfetti } from '@/hooks/useConfetti'
import Realistic from 'react-canvas-confetti/dist/presets/realistic'
import api from '@/libs/api'
import { useEstudiantes } from '@/hooks/useEstudiantes'
import { createClient } from '@supabase/supabase-js'
import { BsToggle2Off, BsToggle2On } from 'react-icons/bs'
import { cn } from '@/libs/utils'
import { useMemo, useState } from 'react'

interface StudentsTableProps {
  supabaseUrl: string
  serviceRolKey: string
}

export const StudentsTable = ({ supabaseUrl, serviceRolKey }: StudentsTableProps) => {
  const [page, setPage] = useState(1)
  const { estudiantes, estudiantesCount, setEstudiantes, loadingEstudiantes } = useEstudiantes({ page: page.toString() })
  const { onInitHandler, onShoot } = useConfetti()

  const handleChangeState = (estado: string, idEstudiante: string, primerNombre: string, primerApellido: string) => {
    if (estado === 'Activo') {
      toast(`¿Estás seguro que deseas deshabilitar al estudiante "${primerNombre} ${primerApellido}?"`, {
        action: {
          label: 'Deshabilitar',
          onClick: () => { handleChangeDisableStudent(idEstudiante) }
        }
      })
    } else {
      toast(`¿Estás seguro que deseas habilitar al estudiante "${primerNombre} ${primerApellido}?"`, {
        action: {
          label: 'Habilitar',
          onClick: () => { handleChangeEnableStudent(idEstudiante) }
        }
      })
    }
  }

  const handleChangeDisableStudent = async (idEstudiante: string) => {
    try {
      const supabase = createClient(supabaseUrl, serviceRolKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })

      const { error } = await supabase.auth.admin.updateUserById(idEstudiante, {
        ban_duration: '876600h'
      })

      if (error) {
        console.log({ error })

        return toast.error('¡Ocurrió un error al deshabilitar la cuenta del estudiante!.')
      }

      const response = await api.patch('/estudiantes/estado', { id_estudiante: idEstudiante, estadoNuevo: 'Inactivo' })

      if (response.status === 200) {
        const estudiantesUpdated = estudiantes.map((estudiante) => {
          if (estudiante.id_estudiante === idEstudiante) {
            return { ...estudiante, estado: 'Inactivo' }
          }

          return estudiante
        })

        setEstudiantes(estudiantesUpdated)
        onShoot()
        toast.success('¡Estudiante deshabilitado exitosamente!')
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

  const handleChangeEnableStudent = async (idEstudiante: string) => {
    try {
      const supabase = createClient(supabaseUrl, serviceRolKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })

      const { error } = await supabase.auth.admin.updateUserById(idEstudiante, {
        ban_duration: '0h'
      })

      if (error) {
        console.log({ error })

        return toast.error('¡Ocurrió un error al habilitar la cuenta del estudiante!.')
      }

      const response = await api.patch('/estudiantes/estado', { id_estudiante: idEstudiante, estadoNuevo: 'Activo' })

      if (response.status === 200) {
        const estudiantesUpdated = estudiantes.map((estudiante) => {
          if (estudiante.id_estudiante === idEstudiante) {
            return { ...estudiante, estado: 'Activo' }
          }

          return estudiante
        })

        setEstudiantes(estudiantesUpdated)
        onShoot()
        toast.success('¡Estudiante habilitado exitosamente!')
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

  const rowsPerPage = 20

  const pages = useMemo(() => {
    return estudiantesCount ? Math.ceil(estudiantesCount / rowsPerPage) : 0
  }, [estudiantesCount, rowsPerPage])
  /* cambiar la key de la tableBody despues */
  return (
    <section className='w-full'>
      <Table isStriped aria-label="Tabla de estudiantes registrados en LunchFip" shadow='md' bottomContent={
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
        <TableHeader>
          <TableColumn className='text-center bg-[#f3f2f2] dark:bg-[#3f3f4666] text-black dark:text-white transition-all'>USUARIO</TableColumn>
          <TableColumn className='text-center bg-[#f3f2f2] dark:bg-[#3f3f4666] text-black dark:text-white transition-all'>NOMBRE</TableColumn>
          <TableColumn className='text-center bg-[#f3f2f2] dark:bg-[#3f3f4666] text-black dark:text-white transition-all'>DOCUMENTO</TableColumn>
          <TableColumn className='text-center bg-[#f3f2f2] dark:bg-[#3f3f4666] text-black dark:text-white transition-all'>PROGRAMA</TableColumn>
          <TableColumn className='text-center bg-[#f3f2f2] dark:bg-[#3f3f4666] text-black dark:text-white transition-all'>CELULAR</TableColumn>
          <TableColumn className='text-center bg-[#f3f2f2] dark:bg-[#3f3f4666] text-black dark:text-white transition-all'>ESTADO</TableColumn>
          <TableColumn className='text-center bg-[#f3f2f2] dark:bg-[#3f3f4666] text-black dark:text-white transition-all'>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody items={estudiantes} emptyContent={'No hay estudiantes registrados en LunchFip.'} isLoading={loadingEstudiantes} loadingContent={<Spinner label="Cargando..." />}>
          {estudiantes.filter((item) => item.id_estudiante !== '').map((item) => (
            <TableRow key={item.id_estudiante}>
              {(columnKey) => {
                if (columnKey === '$.0') {
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
                        <p className="text-bold text-sm capitalize text-default-400 italic">{item.tipo_documento}</p>
                      </div>
                    </TableCell>
                  )
                }

                if (columnKey === '$.3') {
                  return (
                    <TableCell className='text-center'>
                      <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize italic">{item.programa}</p>
                        <p className="text-bold text-sm capitalize text-default-400 italic">{item.facultad}</p>
                      </div>
                    </TableCell>
                  )
                }

                if (columnKey === '$.4') {
                  return (
                    <TableCell className='text-center italic'>{item.celular}</TableCell>
                  )
                }

                if (columnKey === '$.5') {
                  return (
                    <TableCell className='text-center italic'>
                      <Chip className="capitalize" color={item.estado === 'Activo' ? 'success' : 'danger'} size="sm" variant="flat">
                        {item.estado}
                      </Chip>
                    </TableCell>
                  )
                }

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
              }}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Realistic onInit={onInitHandler} />
    </section>
  )
}
