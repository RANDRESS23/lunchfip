import { NextResponse } from 'next/server'
import { db } from '@/libs/prismaDB'

export async function GET (_: Request, { params }: { params: { idEstudiante: string } }) {
  try {
    const { idEstudiante } = params

    const estudiante = await db.estudiantes.findUnique({
      where: { id_estudiante: idEstudiante }
    })

    if (estudiante === null) {
      return NextResponse.json(
        { message: '¡El ID del estudiante ingresado no está registrado!' },
        { status: 404 }
      )
    }

    const estudianteReservas = await db.estudiantes_Reservas.findMany({
      where: { id_estudiante: idEstudiante }
    })

    const estudianteEntregas = await db.estudiantes_Entregas.findMany({
      where: { id_estudiante_reserva: estudianteReservas[0]?.id_estudiante_reserva }
    })

    const estudianteRecargas = await db.estudiantes_Recargas.findMany({
      where: { id_estudiante: idEstudiante }
    })

    return NextResponse.json(
      {
        cantidadReservas: estudianteReservas.length,
        cantidadReclamados: estudianteEntregas.length,
        cantidadSinReclamar: estudianteReservas.length - estudianteEntregas.length,
        cantidadRecargas: estudianteRecargas.length,
        fechaUltimaReserva: estudianteReservas[estudianteReservas.length - 1]?.createdAt ?? 'N/A',
        fechaUltimoReclamo: estudianteEntregas[estudianteEntregas.length - 1]?.createdAt ?? 'N/A',
        fechaUltimaRecarga: estudianteRecargas[estudianteRecargas.length - 1]?.createdAt ?? 'N/A',
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
