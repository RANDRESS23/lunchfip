import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'
import { entregasSchema } from '../schema'

export async function POST (request: Request) {
  const body = await request.json()

  try {
    const {
      id_estudiante_reserva: idEstudianteReserva
    } = entregasSchema.parse(body)

    const estados = await db.estados.findMany()

    const estudianteReserva = await db.estudiantes_Reservas.findUnique({
      where: { id_estudiante_reserva: idEstudianteReserva }
    })

    if (estudianteReserva === null) {
      return NextResponse.json(
        { message: '¡No existe reserva disponible para el estudiante!' },
        { status: 400 }
      )
    }

    const estadoInactivo = await db.estados.findFirst({
      where: { estado: 'Inactivo' }
    })

    const reserva = await db.reservas.findUnique({
      where: { id_reserva: estudianteReserva.id_reserva }
    })

    const estadoAlmuerzos = await db.estados_Almuerzos.findFirst({
      where: { id_almuerzo: reserva?.id_almuerzo }
    })

    if (estadoAlmuerzos?.id_estado === estadoInactivo?.id_estado) {
      return NextResponse.json(
        { message: '¡Ya finalizó el servicio de almuerzos!.' },
        { status: 404 }
      )
    }

    const [estadosReserva] = await db.estados_Reservas.findMany({
      where: { id_reserva: estudianteReserva.id_reserva }
    })

    if (estadosReserva.id_estado !== estados[0].id_estado) {
      return NextResponse.json(
        { message: '¡La reserva ya fue entregada!' },
        { status: 400 }
      )
    }

    const estudiante = await db.estudiantes.findUnique({
      where: { id_estudiante: estudianteReserva.id_estudiante }
    })

    if (estudiante === null) {
      return NextResponse.json(
        { message: '¡El estudiante no se encuentra registrado!' },
        { status: 400 }
      )
    }

    const [estadoEstudiante] = await db.estados_Estudiantes.findMany({
      where: { id_estudiante: estudiante.id_estudiante }
    })

    if (estadoEstudiante.id_estado !== estados[0].id_estado) {
      return NextResponse.json(
        { message: '¡El estudiante no se encuentra activo en LunchFip!' },
        { status: 400 }
      )
    }

    const programa = await db.programas.findUnique({
      where: { id_programa: estudiante.id_programa }
    })

    const tipoDocumento = await db.tipos_Documento.findUnique({
      where: { id_tipo_documento: estudiante.id_tipo_documento }
    })

    const sexo = await db.sexos.findUnique({
      where: { id_sexo: estudiante.id_sexo }
    })

    const imageEstudiante = await db.imagenes_Perfil_Estudiantes.findFirst({
      where: { id_estudiante: estudiante.id_estudiante }
    })

    const codigoQREstudiante = await db.codigos_QR_Estudiantes.findFirst({
      where: { id_estudiante: estudiante.id_estudiante }
    })

    return NextResponse.json(
      {
        estudiante: { ...estudiante, programa: programa?.programa, tipo_documento: tipoDocumento?.tipo_documento, sexo: sexo?.sexo, imageUrl: imageEstudiante?.url_imagen_perfil, codigoUrl: codigoQREstudiante?.url_codigo_qr },
        message: `¡Se verificó que ${estudiante.primer_nombre} se encuentre registrado y no tenga reserva pendiente en el día!`
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error({ error })

    if (error?.errors !== null) {
      const errorsMessages: Record<string, string> = {}
      const { errors } = error

      errors.forEach(
        ({ message, path }: { message: string, path: string[] }) => {
          if (!Object.values(errorsMessages).includes(message)) {
            errorsMessages[path.join('')] = message
          }
        }
      )

      return NextResponse.json(errorsMessages, { status: 500 })
    }

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}
