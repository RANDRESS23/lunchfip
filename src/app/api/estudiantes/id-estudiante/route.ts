import { NextResponse } from 'next/server'
import { db } from '@/libs/prismaDB'

export async function POST (request: Request) {
  const body = await request.json()

  try {
    const { numero_documento: numeroDocumento } = body

    const estudiante = await db.estudiantes.findUnique({
      where: { numero_documento: numeroDocumento }
    })

    if (estudiante === null) {
      return NextResponse.json(
        { message: '¡El número de documento ingresado no está registrado!' },
        { status: 404 }
      )
    }
    const estudianteReserva = await db.estudiantes_Reservas.findFirst({
      where: { id_estudiante: estudiante.id_estudiante }
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
