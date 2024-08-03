import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'
import { reservasSchema } from '../schema'
import { validateAccessAPI } from '@/libs/validateAccessAPI'

export async function POST (request: Request) {
  try {
    const body = await request.json()

    const isValidateAccessAPI = await validateAccessAPI()

    if (isValidateAccessAPI) {
      return NextResponse.json(
        { message: '¡No tienes permisos para acceder a esta información!' },
        { status: 401 }
      )
    }

    const {
      id_estudiante: idEstudiante,
      id_almuerzo: idAlmuerzo
    } = reservasSchema.parse(body)

    const estudiante = await db.estudiantes.findUnique({
      where: { id_estudiante: idEstudiante },
      select: { id_estudiante: true, primer_nombre: true, id_tipo_documento: true, id_sexo: true, id_programa: true }
    })

    if (estudiante === null) {
      return NextResponse.json(
        { message: '¡El estudiante no se encuentra registrado en LunchFip!' },
        { status: 400 }
      )
    }

    const estadoInactivo = await db.estados.findFirst({
      where: { estado: 'Inactivo' },
      select: { id_estado: true }
    })

    const estadoEstudiante = await db.estados_Estudiantes.findUnique({
      where: { id_estudiante: estudiante.id_estudiante },
      select: { id_estado: true }
    })

    if (estadoEstudiante?.id_estado !== estadoInactivo?.id_estado) {
      return NextResponse.json(
        { message: '¡El estudiante no se encuentra activo en LunchFip!' },
        { status: 400 }
      )
    }

    const estadoAlmuerzos = await db.estados_Almuerzos.findFirst({
      where: { id_almuerzo: idAlmuerzo },
      select: { id_estado: true }
    })

    if (estadoAlmuerzos?.id_estado === estadoInactivo?.id_estado) {
      return NextResponse.json(
        { message: '¡Ya finalizó el servicio de almuerzos!.' },
        { status: 404 }
      )
    }

    const reservas = await db.reservas.findMany({
      where: { id_almuerzo: idAlmuerzo },
      select: { id_reserva: true }
    })

    const estudiantesReservas = await db.estudiantes_Reservas.findMany({
      where: { id_reserva: { in: reservas.map(reserva => reserva.id_reserva) } },
      select: { id_estudiante: true }
    })

    const existingTheStudentReservation = estudiantesReservas.some(estudianteReserva => estudianteReserva.id_estudiante === estudiante.id_estudiante)

    if (existingTheStudentReservation) {
      return NextResponse.json(
        { message: '¡El estudiante ya realizó la respectiva reserva de almuerzo!' },
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
