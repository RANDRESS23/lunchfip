import { useEffect, useState } from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '@/libs/api'
import { useTiposDocumento } from '@/hooks/useTiposDocumento'
import { useFacultades } from '@/hooks/useFacultades'
import { useProgramas } from '@/hooks/useProgramas'
import { MdPhoneIphone } from 'react-icons/md'
import { HiIdentification } from 'react-icons/hi2'
import { Button } from '@/components/Button'
import { estudianteDataSchema } from '@/app/api/estudiantes/schema'
import { toast } from 'sonner'
import { useEstudiante } from '@/hooks/useEstudiante'
import { Skeleton } from '@nextui-org/react'
import { type Estudiante } from '@/types/estudiantes'
import { InputControlled } from '@/components/Input/InputControlled'
import { SelectControlled } from '@/components/Select/SelectControlled'
import { useConfetti } from '@/hooks/useConfetti'
import Realistic from 'react-canvas-confetti/dist/presets/realistic'

export const StudentData = () => {
  const [isEditData, setIsEditData] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [idTipoDocumento, setIdTipoDocumento] = useState<Set<any>>(new Set([]))
  const [idFacultad, setIdFacultad] = useState<Set<any>>(new Set([]))
  const [idPrograma, setIdPrograma] = useState<Set<any>>(new Set([]))
  const { tiposDocumento, loadingTiposDocumento } = useTiposDocumento()
  const { facultades, loadingFacultades } = useFacultades()
  const { programas, loadingProgramas } = useProgramas()
  const { estudiante, loadingStudent, setEstudiante } = useEstudiante()
  const { onInitHandler, onShoot } = useConfetti()

  if (loadingStudent) return null

  const {
    handleSubmit,
    setValue,
    getValues,
    reset,
    control,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      id_estudiante: '',
      primer_nombre: estudiante.primer_nombre,
      segundo_nombre: estudiante.segundo_nombre,
      primer_apellido: estudiante.primer_apellido,
      segundo_apellido: estudiante.segundo_apellido,
      id_tipo_documento: estudiante.id_tipo_documento,
      numero_documento: estudiante.numero_documento,
      id_facultad: '',
      id_programa: estudiante.id_programa,
      celular: estudiante.celular
    },
    resolver: zodResolver(estudianteDataSchema)
  })

  const values = getValues()

  useEffect(() => {
    if (programas.length > 0 && values.id_facultad === '') {
      const idFacultad = programas.find(programa => programa.id_programa === estudiante.id_programa)?.id_facultad

      setValue('id_facultad', idFacultad, {
        shouldValidate: true,
        shouldDirty: true
      })
      setIdTipoDocumento(new Set([estudiante.id_tipo_documento]))
      setIdFacultad(new Set([idFacultad]))
      setIdPrograma(new Set([estudiante.id_programa]))
    }
  }, [programas])

  const resetValues = () => {
    const idFacultad = programas.find(programa => programa.id_programa === estudiante.id_programa)?.id_facultad

    reset({
      id_estudiante: '',
      primer_nombre: estudiante.primer_nombre,
      segundo_nombre: estudiante.segundo_nombre,
      primer_apellido: estudiante.primer_apellido,
      segundo_apellido: estudiante.segundo_apellido,
      id_tipo_documento: estudiante.id_tipo_documento,
      numero_documento: estudiante.numero_documento,
      id_facultad: idFacultad,
      id_programa: estudiante.id_programa,
      celular: estudiante.celular
    })
    setIdTipoDocumento(new Set([estudiante.id_tipo_documento]))
    setIdFacultad(new Set([idFacultad]))
    setIdPrograma(new Set([estudiante.id_programa]))
  }

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    try {
      setIsLoading(true)

      const isPossibleSubmit = data.primer_nombre !== estudiante.primer_nombre ||
        data.segundo_nombre !== estudiante.segundo_nombre ||
        data.primer_apellido !== estudiante.primer_apellido ||
        data.segundo_apellido !== estudiante.segundo_apellido ||
        data.id_tipo_documento !== estudiante.id_tipo_documento ||
        data.numero_documento !== estudiante.numero_documento ||
        data.id_programa !== estudiante.id_programa ||
        data.celular !== estudiante.celular

      if (!isPossibleSubmit) {
        resetValues()

        return toast.success('¡Los datos siguen igual, por lo tanto no se ha realizado ningún cambio!')
      }

      const response = await api.put('/estudiantes', { ...data, id_estudiante: estudiante.id_estudiante })

      if (response.status === 200) {
        setEstudiante(response.data.estudiante as Estudiante)

        onShoot()
        toast.success('¡Datos actualizados exitosamente!')
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
      setIsEditData(false)
    }
  }

  return (
    <div className='relative bg-grid-black dark:bg-grid-white py-10 font-inter-sans flex flex-col justify-center items-center'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_0.5%,black)]" />
      <form onSubmit={handleSubmit(onSubmit)} className='lg:max-w-[590px] mx-auto w-11/12 flex flex-col gap-5'>
        <p className='w-full text-sm z-10 -mt-10 text-center italic text-p-light dark:text-p-dark'>Aqui encontrarás todos tus datos personales, si deseas actualizarlos dirígete hasta abajo y da click en el botón de {'"Editar Información"'}</p>

        {
          (loadingTiposDocumento || loadingFacultades || loadingProgramas)
            ? (
                <>
                  <Skeleton className="flex w-full h-[60px] rounded-xl"/>
                  <Skeleton className="flex w-full h-[60px] rounded-xl"/>
                  <Skeleton className="flex w-full h-[60px] rounded-xl"/>
                  <Skeleton className="flex w-full h-[60px] rounded-xl"/>
                  <Skeleton className="flex w-full h-[60px] rounded-xl"/>
                  <Skeleton className="flex w-full h-[60px] rounded-xl"/>
                  <Skeleton className="flex w-full h-[60px] rounded-xl"/>
                  <Skeleton className="flex w-full h-[60px] rounded-xl"/>
                  <Skeleton className="flex w-full h-[60px] rounded-xl"/>
                </>
              )
            : (
                <>
                  <InputControlled
                    type="text"
                    name="primer_nombre"
                    label="Primer nombre"
                    isRequired
                    control={control}
                    disabled={!isEditData || isLoading}
                    errors={errors}
                  />

                  <InputControlled
                    type="text"
                    name="segundo_nombre"
                    label="Segundo apellido"
                    isRequired={false}
                    control={control}
                    disabled={!isEditData || isLoading}
                    errors={errors}
                  />

                  <InputControlled
                    type="text"
                    name="primer_apellido"
                    label="Primer apellido"
                    isRequired
                    control={control}
                    disabled={!isEditData || isLoading}
                    errors={errors}
                  />

                  <InputControlled
                    type="text"
                    name="segundo_apellido"
                    label="Segundo apellido"
                    isRequired={false}
                    control={control}
                    disabled={!isEditData || isLoading}
                    errors={errors}
                  />

                  <SelectControlled
                    label="Tipo de documento"
                    isRequired
                    name="id_tipo_documento"
                    control={control}
                    disabled={loadingTiposDocumento || !isEditData || isLoading}
                    options={
                      tiposDocumento.map(tipoDocumento => ({ label: tipoDocumento.tipo_documento, value: tipoDocumento.id_tipo_documento }))
                    }
                    errors={errors}
                    value={idTipoDocumento}
                    setValue={setIdTipoDocumento}
                  />

                  <InputControlled
                    type="text"
                    name="numero_documento"
                    label="Número de documento"
                    isRequired
                    control={control}
                    endContent={
                      <div className="h-full flex justify-center items-center">
                        <HiIdentification className="text-2xl text-default-400 pointer-events-none" />
                      </div>
                    }
                    disabled={!isEditData || isLoading}
                    errors={errors}
                  />

                  <SelectControlled
                    label="Facultad"
                    isRequired
                    name="id_facultad"
                    control={control}
                    disabled={loadingFacultades || !isEditData || isLoading}
                    options={
                      facultades.map(facultad => ({ label: facultad.facultad, value: facultad.id_facultad }))
                    }
                    errors={errors}
                    value={idFacultad}
                    setValue={setIdFacultad}
                  />

                  <SelectControlled
                    label="Programa académico"
                    isRequired
                    name="id_programa"
                    control={control}
                    disabled={loadingProgramas || !isEditData || isLoading}
                    options={
                      programas
                        .filter(programa => programa.id_facultad === Array.from(idFacultad).join(''))
                        .map(programa => ({ label: programa.programa, value: programa.id_programa }))
                    }
                    errors={errors}
                    value={idPrograma}
                    setValue={setIdPrograma}
                  />

                  <InputControlled
                    type="text"
                    name="celular"
                    label="Celular"
                    isRequired
                    control={control}
                    endContent={
                      <div className="h-full flex justify-center items-center">
                        <MdPhoneIphone className="text-2xl text-default-400 pointer-events-none" />
                      </div>
                    }
                    disabled={!isEditData || isLoading}
                    errors={errors}
                  />
                </>
              )
        }
        {
          isEditData && (
            <Button
              type="submit"
              text={isLoading ? 'Cargando...' : 'Confirmar Cambios'}
              disabled={isLoading}
            />
          )
        }
      </form>
      <div className='lg:max-w-[590px] mx-auto w-11/12 mt-5'>
        <Button
          type="button"
          text={isEditData ? 'Cancelar Cambios' : 'Editar Información'}
          disabled={isLoading}
          onClick={() => {
            if (isEditData) resetValues()

            setIsEditData(!isEditData)
          }}
        />
      </div>
      <Realistic onInit={onInitHandler} />
    </div>
  )
}
