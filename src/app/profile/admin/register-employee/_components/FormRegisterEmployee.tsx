'use client'

import { useState } from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '@/libs/api'
import { useSexos } from '@/hooks/useSexos'
import { Input } from '@/components/Input'
import { IoEyeOff } from 'react-icons/io5'
import { MdPhoneIphone } from 'react-icons/md'
import { FaEye } from 'react-icons/fa'
import { HiIdentification } from 'react-icons/hi2'
import { Button } from '@/components/Button'
import { Select } from '@/components/Select'
import { toast } from 'sonner'
import { createClient } from '@supabase/supabase-js'
import { empleadosSchema } from '@/app/api/empleados/schema'
import { ButtonLitUpBorders } from '@/components/Button/ButtonLitUpBoders'
import { useEmpleados } from '@/hooks/useEmpleados'
import { type Empleado } from '@/types/empleados'

interface FormRegisterEmployeeProps {
  onClose: () => void
  onShoot: () => void
  supabaseUrl: string
  serviceRolKey: string
}

export const FormRegisterEmployee = ({ onClose, onShoot, supabaseUrl, serviceRolKey }: FormRegisterEmployeeProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passwordVisible2, setPasswordVisible2] = useState(false)
  const { setEmpleados } = useEmpleados({})
  const [isLoading, setIsLoading] = useState(false)
  const { sexos, loadingSexos } = useSexos()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      id_empleado: '',
      primer_nombre: '',
      segundo_nombre: '',
      primer_apellido: '',
      segundo_apellido: '',
      id_tipo_documento: '',
      numero_documento: '',
      correo: '',
      clave: '',
      clave_2: '',
      id_sexo: '',
      celular: ''
    },
    resolver: zodResolver(empleadosSchema)
  })

  const toggleVisibility = () => { setPasswordVisible(!passwordVisible) }
  const toggleVisibility2 = () => { setPasswordVisible2(!passwordVisible2) }

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    try {
      setIsLoading(true)

      const response = await api.post('/empleados/verificar', data)

      if (response.status === 200) {
        const supabase = createClient(supabaseUrl, serviceRolKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        })

        const { data: { user }, error } = await supabase.auth.admin.createUser({
          email: data.correo,
          password: data.clave,
          email_confirm: true
        })

        if (error) {
          console.log({ error })

          return toast.error('¡Ocurrió un error al registrar el empleado, verifica los datos!.')
        }

        if (user) {
          const response = await api.post('/empleados', { ...data, id_empleado: user.id })

          setEmpleados(response.data.empleados as Empleado[])
          toast.success(`¡El empleado con el correo ${data.correo} se registró exitosamente!`)
          onShoot()
          onClose()
        }
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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='relative font-inter-sans flex flex-col justify-center items-center'>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col gap-5'>
        <Input
          type="text"
          label="Primer nombre"
          isRequired
          name="primer_nombre"
          register={register}
          disabled={isLoading}
          errors={errors}
        />

        <Input
          type="text"
          label="Segundo nombre"
          isRequired={false}
          name="segundo_nombre"
          register={register}
          disabled={isLoading}
          errors={errors}
        />

        <Input
          type="text"
          label="Primer apellido"
          isRequired
          name="primer_apellido"
          register={register}
          disabled={isLoading}
          errors={errors}
        />

        <Input
          type="text"
          label="Segundo apellido"
          isRequired={false}
          name="segundo_apellido"
          register={register}
          disabled={isLoading}
          errors={errors}
        />

        <Input
          type="number"
          label="Número de documento"
          isRequired
          name="numero_documento"
          register={register}
          disabled={isLoading}
          endContent={
            <div className="h-full flex justify-center items-center gap-1">
              <HiIdentification className="text-2xl text-default-400 pointer-events-none" />
              <div className="pointer-events-none flex items-center h-full">
                <span className="text-default-400 font-semibold text-small">C.C</span>
              </div>
            </div>
          }
          errors={errors}
        />

        <Input
          type="text"
          label="Celular"
          isRequired
          name="celular"
          register={register}
          disabled={isLoading}
          endContent={
            <div className="h-full flex justify-center items-center">
              <MdPhoneIphone className="text-2xl text-default-400 pointer-events-none" />
            </div>
          }
          errors={errors}
        />

        <Select
          label="Sexo"
          isRequired
          name="id_sexo"
          disabled={loadingSexos || isLoading}
          options={
            sexos.map(sexo => ({ label: sexo.sexo, value: sexo.id_sexo }))
          }
          register={register}
          errors={errors}
        />

        <Input
          type="email"
          label="Correo"
          isRequired
          name="correo"
          register={register}
          disabled={isLoading}
          errors={errors}
        />

        <Input
          type={passwordVisible ? 'text' : 'password'}
          label="Contraseña"
          isRequired
          name="clave"
          register={register}
          disabled={isLoading}
          endContent={
            <button className="focus:outline-none h-full" type="button" onClick={toggleVisibility}>
              {passwordVisible
                ? (
                <IoEyeOff className="text-2xl text-default-400 pointer-events-none" />
                  )
                : (
                <FaEye className="text-2xl text-default-400 pointer-events-none" />
                  )}
            </button>
          }
          errors={errors}
        />

        <Input
          type={passwordVisible2 ? 'text' : 'password'}
          label="Confirmar contraseña"
          isRequired
          name="clave_2"
          register={register}
          disabled={isLoading}
          endContent={
            <button className="focus:outline-none h-full" type="button" onClick={toggleVisibility2}>
              {passwordVisible2
                ? (
                <IoEyeOff className="text-2xl text-default-400 pointer-events-none" />
                  )
                : (
                <FaEye className="text-2xl text-default-400 pointer-events-none" />
                  )}
            </button>
          }
          errors={errors}
        />

        <Button
          type="submit"
          text={isLoading ? 'Cargando...' : 'Registrar Empleado'}
          disabled={isLoading}
        />
        <ButtonLitUpBorders
          type="button"
          text='Cancelar Registro'
          disabled={isLoading}
          onClick={onClose}
        />
      </form>
    </div>
  )
}
