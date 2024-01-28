'use client'

import { useState, useEffect } from 'react'
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import { ModalDeliveryLunch } from './ModalDeliveryLunch'
import { useDisclosure } from '@nextui-org/react'
import api from '@/libs/api'
import { useEstudiantesStore } from '@/store/estudiantes'
import { type Estudiante } from '@/types/estudiantes'
import { toast } from 'sonner'

export const ScannerQRCode = () => {
  const [repeatScann, setRepeatScann] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const estudiante = useEstudiantesStore(state => state.estudiante)
  const setEstudiante = useEstudiantesStore(state => state.setEstudiante)

  const handleOpen = () => { onOpen() }

  useEffect(() => {
    const formatsToSupport = [
      Html5QrcodeSupportedFormats.QR_CODE
    ]
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250
      },
      fps: 10,
      rememberLastUsedCamera: true,
      formatsToSupport
    }, /* verbose= */ false)

    const success = async (data: string) => {
      scanner.clear()

      try {
        const response = await api.post('/almuerzos/entregas/verificar', {
          id_estudiante_reserva: data,
          id_estudiante: '',
          id_empleado: '',
          id_almuerzo: ''
        })

        if (response.status === 200) {
          const { estudiante } = response.data

          setEstudiante(estudiante as Estudiante)

          handleOpen()
        }
      } catch (error: any) {
        if (error.response.data !== undefined) {
          const { message } = error.response.data

          toast.error(message as string)
          setRepeatScann(!repeatScann)
          console.log(error.response.data)
        }
      }
    }

    const error = () => {
      // console.error(error)
    }

    scanner.render(success, error)
  }, [repeatScann])

  return (
    <section className='w-full h-full flex flex-col justify-center items-center'>
      <div id="reader" />
      <ModalDeliveryLunch
        numeroDocumento={estudiante.numero_documento}
        nombreCompleto={`${estudiante.primer_nombre} ${estudiante.segundo_nombre} ${estudiante.primer_apellido} ${estudiante.segundo_apellido}`}
        tipoDocumento={estudiante.tipo_documento}
        programa={estudiante.programa}
        correoInstitucional={estudiante.correo_institucional}
        celular={estudiante.celular}
        saldo={estudiante.saldo}
        isOpen={isOpen}
        onClose={() => {
          onClose()
          setRepeatScann(!repeatScann)
        }}
      />
    </section>
  )
}
