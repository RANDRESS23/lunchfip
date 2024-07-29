import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'
import { recargasSchema } from './schema'
import { validateAccessAPI } from '@/libs/validateAccessAPI'

export async function GET () {
  try {
    const isValidateAccessAPI = await validateAccessAPI()

    if (isValidateAccessAPI) {
      return NextResponse.json(
        { message: '¡No tienes permisos para acceder a esta información!' },
        { status: 401 }
      )
    }

    const recargas = await db.recargas.findMany()

    return NextResponse.json(recargas)
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}

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
      id_empleado: idEmpleado,
      id_estudiante: idEstudiante,
      new_saldo: newSaldo
    } = recargasSchema.parse(body)

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const newRecarga = await db.recargas.create({
      data: {
        id_empleado: idEmpleado,
        saldo: newSaldo,
        fecha: currentDate,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    await db.estudiantes_Recargas.create({
      data: {
        id_estudiante: idEstudiante,
        id_recarga: newRecarga.id_recarga,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    await db.estudiantes.update({
      data: {
        saldo: { increment: newSaldo },
        updatedAt: currentDate
      },
      where: { id_estudiante: idEstudiante }
    })

    return NextResponse.json(
      {
        message: '¡Recarga realizada exitosamente!'
      },
      { status: 201 }
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
