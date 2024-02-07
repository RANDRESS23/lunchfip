import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react'
import Image from 'next/image'
import { cn } from '@/libs/utils'
import { HiIdentification } from 'react-icons/hi2'
import { MdEmail, MdPhoneIphone } from 'react-icons/md'
import { BsCashCoin } from 'react-icons/bs'
import { FaUniversity } from 'react-icons/fa'
import { toast } from 'sonner'
import api from '@/libs/api'
import { useEstudiantesStore } from '@/store/estudiantes'
import { useAlmuerzosStore } from '@/store/almuerzos'
import { type AlmuerzosEntregados } from '@/types/almuerzos'
import { useAlmuerzosTotales } from '@/hooks/useAlmuerzosTotales'
import getNextDate from '@/libs/nextDate'
import { useEmpleadoSignIn } from '@/hooks/useEmpleadoSignIn'
import { useUser } from '@clerk/nextjs'
import { useState } from 'react'

interface ModalDeliveryLunchProps {
  numeroDocumento: string
  nombreCompleto: string
  tipoDocumento: string
  programa: string
  correoInstitucional: string
  celular: string
  saldo: number
  isOpen: boolean
  onClose: () => void
}

export const ModalDeliveryLunch = ({
  numeroDocumento, nombreCompleto, tipoDocumento, programa, correoInstitucional, celular, saldo, isOpen, onClose
}: ModalDeliveryLunchProps) => {
  const [loadingReservation, setLoadingReservation] = useState(false)
  const { user } = useUser()
  const { empleado } = useEmpleadoSignIn({ correo: user?.primaryEmailAddress?.emailAddress ?? '' })
  const estudiante = useEstudiantesStore(state => state.estudiante)

  const { nextDate } = getNextDate()
  const { almuerzosTotales } = useAlmuerzosTotales({ nextDate: nextDate.toString() })
  const setAlmuerzosEntregados = useAlmuerzosStore(state => state.setAlmuerzosEntregados)

  const saldoString = saldo.toString()
  const saldoParsed = saldoString.slice(0, saldoString.length - 3)
  const saldoParsed2 = saldoString.slice(saldoString.length - 3)
  const saldoParsed3 = `$ ${saldoParsed}.${saldoParsed2}`

  const deliveryLunch = async () => {
    try {
      setLoadingReservation(true)

      const response = await api.post('/almuerzos/entregas', {
        id_empleado: empleado.id_empleado,
        id_estudiante: estudiante.id_estudiante,
        id_almuerzo: almuerzosTotales.id_almuerzo,
        id_estudiante_reserva: ''
      })

      if (response.status === 201) {
        const { almuerzosEntregados } = response.data

        setAlmuerzosEntregados(almuerzosEntregados as AlmuerzosEntregados)

        toast.success('¡Entrega realizada exitosamente!')
        onClose()
      }
    } catch (error: any) {
      if (error.response.data !== undefined) {
        const { message } = error.response.data

        toast.error(message as string)
      }
    } finally {
      setLoadingReservation(false)
    }
  }

  return (
    <>
      <Modal backdrop='blur' size='3xl' isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Reservar Almuerzo</ModalHeader>
              <ModalBody>
                <div className='flex gap-5'>
                  <section className='w-2/5 flex justify-center items-center'>
                    <Image
                      src={`https://guia.itfip.edu.co/sgacampus/images/dynamic/foto/1/${numeroDocumento}/${numeroDocumento}.jpg?width=1000&cut=1`}
                      alt='Foto de perfil del estudiante'
                      width={1000}
                      height={1000}
                      className='w-full h-full rounded-xl'
                    />
                  </section>
                  <section className='w-3/5 flex flex-col justify-between'>
                    <div>
                      <div>
                        <p className='text-xl font-semibold'>
                          {nombreCompleto}
                        </p>
                      </div>
                      <div className='flex items-center gap-1'>
                        <HiIdentification className="text-2xl" />
                        <p className='font-semibold'>
                          {`${numeroDocumento} ${tipoDocumento === 'Cédula de Ciudadanía' ? 'C.C' : 'T.I'}`}
                        </p>
                      </div>
                    </div>
                    <div className='flex flex-col gap-6'>
                      <div className={cn(
                        'flex gap-1',
                        programa.length > 45 ? '' : 'items-center'
                      )}>
                        <FaUniversity className="text-2xl" />
                        <p className='font-semibold'>
                          {programa}
                        </p>
                      </div>
                      <div className={cn(
                        'flex gap-1',
                        correoInstitucional.length > 45 ? '' : 'items-center'
                      )}>
                        <MdEmail className="text-2xl" />
                        <p className='font-semibold'>
                          {correoInstitucional}
                        </p>
                      </div>
                      <div className={cn(
                        'flex gap-1',
                        'Técnica Profesional en Programación Webqwesss'.length > 45 ? '' : 'items-center'
                      )}>
                        <MdPhoneIphone className="text-2xl" />
                        <p className='font-semibold'>
                          {celular}
                        </p>
                      </div>
                      <div className={cn(
                        'flex gap-1',
                        'Técnica Profesional en Programación Webqwesss'.length > 45 ? '' : 'items-center'
                      )}>
                        <BsCashCoin className="text-2xl" />
                        <p className='font-semibold'>
                          {saldo === 0 ? '$ 0' : saldoParsed3}
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  isDisabled={loadingReservation}
                  onPress={deliveryLunch}
                >
                  Entregar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}