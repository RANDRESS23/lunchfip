import { NextResponse } from 'next/server'
import { db } from '@/libs/prismaDB'
import { format } from '@formkit/tempo'

export async function GET (_: Request, { params }: { params: { idEstudiante: string } }) {
  try {
    const { idEstudiante } = params

    const estudiante = await db.estudiantes.findUnique({
      where: { id_estudiante: idEstudiante },
      select: { id_estudiante: true }
    })

    if (estudiante === null) {
      return NextResponse.json(
        { message: '¡El ID del estudiante ingresado no está registrado!' },
        { status: 404 }
      )
    }

    const estudianteReservas = await db.estudiantes_Reservas.findMany({
      where: { id_estudiante: idEstudiante },
      select: { id_estudiante_reserva: true, id_reserva: true }
    })

    const estudianteEntregas = await db.estudiantes_Entregas.findMany({
      where: { id_estudiante_reserva: { in: estudianteReservas.map((reserva) => reserva.id_estudiante_reserva) } },
      select: { id_entrega: true }
    })

    const estudianteRecargas = await db.estudiantes_Recargas.findMany({
      where: { id_estudiante: idEstudiante },
      select: { id_recarga: true }
    })

    const reserva = await db.reservas.findFirst({
      where: { id_reserva: estudianteReservas[estudianteReservas.length - 1]?.id_reserva || '' },
      select: { fecha: true }
    })

    const entrega = await db.entregas.findFirst({
      where: { id_entrega: estudianteEntregas[estudianteEntregas.length - 1]?.id_entrega || '' },
      select: { fecha: true }
    })

    const recarga = await db.recargas.findFirst({
      where: { id_recarga: estudianteRecargas[estudianteRecargas.length - 1]?.id_recarga || '' },
      select: { fecha: true }
    })

    let fechaReserva = 'N/A'
    let fechaEntrega = 'N/A'
    let fechaRecarga = 'N/A'

    if (reserva) {
      const fechaReservaAux = new Date(reserva?.fecha?.toString() ?? '')

      if (process.env.NODE_ENV === 'development') {
        fechaReservaAux.setUTCHours(fechaReservaAux.getUTCHours() + 5)
      }

      const fechaReservaAux2 = new Date(fechaReservaAux.toString())
      fechaReserva = format(fechaReservaAux2, 'DD/MM/YYYY')
    }

    if (entrega) {
      const fechaEntregaAux = new Date(entrega?.fecha?.toString() ?? '')

      if (process.env.NODE_ENV === 'development') {
        fechaEntregaAux.setUTCHours(fechaEntregaAux.getUTCHours() + 5)
      }

      const fechaEntregaAux2 = new Date(fechaEntregaAux.toString())
      fechaEntrega = format(fechaEntregaAux2, 'DD/MM/YYYY')
    }

    if (recarga) {
      const fechaRecargaAux = new Date(recarga?.fecha?.toString() ?? '')

      if (process.env.NODE_ENV === 'development') {
        fechaRecargaAux.setUTCHours(fechaRecargaAux.getUTCHours() + 5)
      }

      const fechaRecargaAux2 = new Date(fechaRecargaAux.toString())
      fechaRecarga = format(fechaRecargaAux2, 'DD/MM/YYYY')
    }

    return NextResponse.json(
      {
        cantidadReservas: estudianteReservas.length,
        cantidadReclamados: estudianteEntregas.length,
        cantidadSinReclamar: estudianteReservas.length - estudianteEntregas.length,
        cantidadRecargas: estudianteRecargas.length,
        fechaUltimaReserva: fechaReserva,
        fechaUltimoReclamo: fechaEntrega,
        fechaUltimaRecarga: fechaRecarga,
        message: '¡Estadísticas obtenidas exitosamente!'
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
