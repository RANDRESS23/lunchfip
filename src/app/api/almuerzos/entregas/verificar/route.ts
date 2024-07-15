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
      where: { id_estudiante_reserva: idEstudianteReserva },
      select: { id_estudiante: true, id_reserva: true }
    })

    if (estudianteReserva === null) {
      return NextResponse.json(
        { message: '¡No existe reserva disponible para el estudiante!' },
        { status: 400 }
      )
    }

    const estadoInactivo = await db.estados.findFirst({
      where: { estado: 'Inactivo' },
      select: { id_estado: true }
    })

    const reserva = await db.reservas.findUnique({
      where: { id_reserva: estudianteReserva.id_reserva },
      select: { id_almuerzo: true }
    })

    const estadoAlmuerzos = await db.estados_Almuerzos.findFirst({
      where: { id_almuerzo: reserva?.id_almuerzo },
      select: { id_estado: true }
    })

    if (estadoAlmuerzos?.id_estado === estadoInactivo?.id_estado) {
      return NextResponse.json(
        { message: '¡Ya finalizó el servicio de almuerzos!.' },
        { status: 404 }
      )
    }

    const [estadosReserva] = await db.estados_Reservas.findMany({
      where: { id_reserva: estudianteReserva.id_reserva },
      select: { id_estado: true }
    })

    if (estadosReserva.id_estado !== estados[0].id_estado) {
      return NextResponse.json(
        { message: '¡La reserva ya fue entregada!' },
        { status: 400 }
      )
    }

    const estudiante = await db.estudiantes.findUnique({
      where: { id_estudiante: estudianteReserva.id_estudiante },
      select: { id_estudiante: true, primer_nombre: true, id_tipo_documento: true, id_sexo: true, id_programa: true }
    })

    if (estudiante === null) {
      return NextResponse.json(
        { message: '¡El estudiante no se encuentra registrado!' },
        { status: 400 }
      )
    }

    const [estadoEstudiante] = await db.estados_Estudiantes.findMany({
      where: { id_estudiante: estudiante.id_estudiante },
      select: { id_estado: true }
    })

    if (estadoEstudiante.id_estado !== estados[0].id_estado) {
      return NextResponse.json(
        { message: '¡El estudiante no se encuentra activo en LunchFip!' },
        { status: 400 }
      )
    }

    const [tipoDocumento, sexo, programa, imageEstudiante, codigoQREstudiante] = await Promise.all([
      db.tipos_Documento.findUnique({
        where: { id_tipo_documento: estudiante.id_tipo_documento },
        select: { tipo_documento: true }
      }),
      db.sexos.findUnique({
        where: { id_sexo: estudiante.id_sexo },
        select: { sexo: true }
      }),
      db.programas.findUnique({
        where: { id_programa: estudiante.id_programa },
        select: { programa: true }
      }),
      db.imagenes_Perfil_Estudiantes.findFirst({
        where: { id_estudiante: estudiante.id_estudiante },
        select: { url_imagen_perfil: true }
      }),
      db.codigos_QR_Estudiantes.findFirst({
        where: { id_estudiante: estudiante.id_estudiante },
        select: { url_codigo_qr: true }
      })
    ])

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
