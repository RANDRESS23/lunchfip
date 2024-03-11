'use client'

import { useState } from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '@/libs/api'
import { Input } from '@/components/Input'
import { HiIdentification } from 'react-icons/hi2'
import { Button } from '@/components/Button'
import { toast } from 'sonner'
import { z } from 'zod'
import { ModalDeliveryLunch } from './ModalDeliveryLunch'
import { useEstudiante } from '@/hooks/useEstudiante'
import { useDisclosure } from '@nextui-org/react'
import { type Estudiante } from '@/types/estudiantes'

const numeroDocumentoSchema = z.object({
  numero_documento: z.string().min(7, {
    message: 'El número de documento debe tener al menos 7 caracteres.'
  }).max(12, {
    message: 'El número de documento debe tener máximo 12 caracteres.'
  })
})

export const FormDeliver = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { estudiante, setEstudiante } = useEstudiante()

  const handleOpen = () => { onOpen() }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      numero_documento: ''
    },
    resolver: zodResolver(numeroDocumentoSchema)
  })

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    setIsLoading(true)

    try {
      const response = await api.post('/estudiantes/id-estudiante', {
        numero_documento: data.numero_documento
      })

      if (response.status === 200) {
        const { idEstudianteReserva } = response.data

        const response2 = await api.post('/almuerzos/entregas/verificar', {
          id_estudiante_reserva: idEstudianteReserva,
          id_estudiante: '',
          id_empleado: '',
          id_almuerzo: ''
        })

        if (response2.status === 200) {
          const { estudiante } = response2.data

          setEstudiante(estudiante as Estudiante)

          handleOpen()
        }
      }
    } catch (error: any) {
      if (error.response.data !== undefined) {
        const errorsMessages = Object.values(error.response.data as Record<string, string>)
        let errorsMessagesString = ''

        errorsMessages.forEach((message: any) => {
          errorsMessagesString += `${message} ${'\n'}`
        })

        return toast.error(errorsMessagesString)
      }

      console.error({ error })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='lg:max-w-sm w-11/12 flex flex-col gap-5'>
      <Input
        type="number"
        label="Número de identificación"
        isRequired
        name="numero_documento"
        size="lg"
        disabled={isLoading}
        register={register}
        endContent={
          <div className="h-full flex justify-center items-center">
            <HiIdentification className="text-2xl text-default-400 pointer-events-none" />
          </div>
        }
        errors={errors}
      />

      <Button
        type="submit"
        text={isLoading ? 'Cargando...' : 'Buscar Estudiante'}
        disabled={isLoading}
      />

      <ModalDeliveryLunch
        numeroDocumento={estudiante.numero_documento}
        nombreCompleto={`${estudiante.primer_nombre} ${estudiante.segundo_nombre} ${estudiante.primer_apellido} ${estudiante.segundo_apellido}`}
        tipoDocumento={estudiante.tipo_documento}
        programa={estudiante.programa}
        correoInstitucional={estudiante.correo_institucional}
        celular={estudiante.celular}
        saldo={estudiante.saldo}
        isOpen={isOpen}
        onClose={() => { onClose() }}
        reset={reset}
      />
    </form>
  )
}
