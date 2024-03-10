import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'
import { totalLunchesSchema } from './schema'

export async function GET () {
  try {
    const almuerzos = await db.almuerzos.findMany()

    return NextResponse.json(almuerzos)
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}

export async function POST (request: Request) {
  const body = await request.json()
  body.nextDate = new Date(body.nextDate as string)

  try {
    const {
      total_almuerzos: totalAlmuerzos,
      nextDate
    } = totalLunchesSchema.parse(body)

    const existingLunchesInDate = await db.almuerzos.findUnique({
      where: { fecha: nextDate }
    })

    if (existingLunchesInDate !== null) {
      return NextResponse.json(
        { messsage: '¡El servicio de almuerzos ya se ejecutó en la fecha seleccionada!' },
        { status: 400 }
      )
    }

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const newAlmuerzo = await db.almuerzos.create({
      data: {
        total_almuerzos: Number(totalAlmuerzos),
        fecha: nextDate,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    const newAlmuerzosReservados = await db.almuerzos_Reservados.create({
      data: {
        id_almuerzo: newAlmuerzo.id_almuerzo,
        cantidad: 0,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    const newAlmuerzosEntregados = await db.almuerzos_Entregados.create({
      data: {
        id_almuerzo: newAlmuerzo.id_almuerzo,
        cantidad: 0,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    return NextResponse.json(
      {
        almuerzosTotales: newAlmuerzo,
        almuerzosReservados: newAlmuerzosReservados,
        almuerzosEntregados: newAlmuerzosEntregados,
        message: '¡Cantidad de almuerzos registrada exitosamente para la fecha establecida!'
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

export async function PATCH (request: Request) {
  const body = await request.json()
  const { id_almuerzo: idAlmuerzo, cantidad } = body

  try {
    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const almuerzosReservados = await db.almuerzos_Reservados.findUnique({
      where: { id_almuerzo: idAlmuerzo }
    })

    if (almuerzosReservados === null) {
      return NextResponse.json(
        { message: '¡No se encontró el registro de almuerzos reservados para la fecha seleccionada!' },
        { status: 400 }
      )
    }

    if (almuerzosReservados.cantidad > Number(cantidad)) {
      return NextResponse.json(
        { message: '¡La cantidad de almuerzos reservados es mayor a la cantidad establecida por el usuario!' },
        { status: 400 }
      )
    }

    const almuerzoAmountUpdated = await db.almuerzos.update({
      data: { total_almuerzos: Number(cantidad), updatedAt: currentDate },
      where: { id_almuerzo: idAlmuerzo }
    })

    const updatedAlmuerzosReservados = await db.almuerzos_Reservados.update({
      data: { updatedAt: currentDate },
      where: { id_almuerzo: idAlmuerzo }
    })

    const updatedAlmuerzosEntregados = await db.almuerzos_Entregados.update({
      data: { updatedAt: currentDate },
      where: { id_almuerzo: idAlmuerzo }
    })

    if (almuerzoAmountUpdated === null || updatedAlmuerzosReservados === null || updatedAlmuerzosEntregados === null) {
      return NextResponse.json({
        message: 'No se pudo actualizar la cantidad de almuerzos para la fecha seleccionada.'
      })
    }

    return NextResponse.json(
      {
        almuerzosTotales: almuerzoAmountUpdated,
        almuerzosReservados: updatedAlmuerzosReservados,
        almuerzosEntregados: updatedAlmuerzosEntregados,
        message: '¡Cantidad de almuerzos actualizada exitosamente para la fecha establecida!'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}
