import { NextResponse } from 'next/server'
import { db } from '@/libs/prismaDB'

export async function POST (request: Request) {
  try {
    const body = await request.json()

    const { numero_documento: numeroDocumento, nextDate } = body

    const fecha = new Date(nextDate as string)

    const estudiante = await db.estudiantes.findUnique({
      where: { numero_documento: numeroDocumento },
      select: { id_estudiante: true }
    })

    if (estudiante === null) {
      return NextResponse.json(
        { message: '¡El número de documento ingresado no está registrado!' },
        { status: 404 }
      )
    }

    const almuerzosDisponiblesFecha = await db.almuerzos_Fecha.findUnique({
      where: { fecha },
      select: { id_almuerzos_fecha: true }
    })

    if (almuerzosDisponiblesFecha === null) {
      return NextResponse.json(
        { message: '¡No se encontró la fecha del servicio de almuerzos!' },
        { status: 404 }
      )
    }

    const almuerzosDisponibles = await db.almuerzos.findFirst({
      where: { id_almuerzos_fecha: almuerzosDisponiblesFecha.id_almuerzos_fecha },
      select: { id_almuerzo: true }
    })

    if (almuerzosDisponibles === null) {
      return NextResponse.json(
        { message: '¡El administrador no ha definido la cantidad total de almuerzos para reservar, intente más tarde!.' },
        { status: 404 }
      )
    }

    const estudianteReserva = await db.estudiantes_Reservas.findFirst({
      where: { id_estudiante: estudiante.id_estudiante },
      select: { id_estudiante_reserva: true }
    })

    return NextResponse.json(
      {
        idEstudiante: estudiante.id_estudiante,
        idEstudianteReserva: estudianteReserva?.id_estudiante_reserva ?? '',
        message: '¡Datos validados correctamente!'
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
