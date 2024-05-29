import { NextResponse } from 'next/server'
import { db } from '@/libs/prismaDB'

export async function POST (request: Request) {
  try {
    const body = await request.json()

    const {
      id_estudiante: idEstudiante,
      id_almuerzo: idAlmuerzo
    } = body

    const estudiante = await db.estudiantes.findUnique({
      where: { id_estudiante: idEstudiante }
    })

    if (estudiante === null) {
      return NextResponse.json(
        { message: '¡El ID del estudiante ingresado no está registrado!' },
        { status: 404 }
      )
    }

    const almuerzos = await db.almuerzos.findUnique({
      where: { id_almuerzo: idAlmuerzo }
    })

    if (almuerzos === null) {
      return NextResponse.json(
        { message: '¡No existe almuerzos para el día seleccionado!' },
        { status: 404 }
      )
    }

    const reservas = await db.reservas.findMany({
      where: { id_almuerzo: almuerzos.id_almuerzo }
    })

    if (reservas.length === 0) {
      return NextResponse.json(
        { message: '¡No existe reservas disponibles para el día seleccionado!' },
        { status: 400 }
      )
    }

    const estudianteReserva = await db.estudiantes_Reservas.findFirst({
      where: { id_estudiante: idEstudiante, id_reserva: { in: reservas.map((reserva) => reserva.id_reserva) } }
    })

    if (estudianteReserva === null) {
      return NextResponse.json(
        { message: '¡No existe reserva disponible para el estudiante!' },
        { status: 400 }
      )
    }

    const codigoQRReserva = await db.codigos_QR_Reservas.findFirst({
      where: { id_reserva: estudianteReserva.id_reserva }
    })

    if (codigoQRReserva === null) {
      return NextResponse.json(
        { message: '¡No existe código QR disponible para la reserva!' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        codigoQRReserva: codigoQRReserva.url_codigo_qr,
        message: '¡Codigo QR obtenido exitosamente!'
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
