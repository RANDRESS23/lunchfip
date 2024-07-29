import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'
import { totalLunchesSchema } from './schema'
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
      total_almuerzos: totalAlmuerzos,
      nextDate
    } = totalLunchesSchema.parse(body)

    const fecha = new Date(nextDate)

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const existingLunchesDate = await db.almuerzos_Fecha.findUnique({
      where: { fecha },
      select: { id_almuerzos_fecha: true }
    })

    if (existingLunchesDate === null) {
      return NextResponse.json(
        { messsage: '¡No se encontró la fecha del servicio de almuerzos!' },
        { status: 400 }
      )
    }

    const existingLunchesInDate = await db.almuerzos.findFirst({
      where: { id_almuerzos_fecha: existingLunchesDate.id_almuerzos_fecha },
      select: { id_almuerzo: true }
    })

    if (existingLunchesInDate !== null) {
      return NextResponse.json(
        { messsage: '¡Ya hubo servicio de almuerzos para la fecha seleccionada!' },
        { status: 400 }
      )
    }

    const newAlmuerzo = await db.almuerzos.create({
      data: {
        id_almuerzos_fecha: existingLunchesDate.id_almuerzos_fecha,
        total_almuerzos: Number(totalAlmuerzos),
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

    const estados = await db.estados.findFirst({
      where: { estado: 'Activo' }
    })

    if (estados === null) {
      return NextResponse.json(
        { message: '¡No se encontró el estado activo para los almuerzos!' },
        { status: 404 }
      )
    }

    await db.estados_Almuerzos.create({
      data: {
        id_estado: estados.id_estado,
        id_almuerzo: newAlmuerzo.id_almuerzo
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
  try {
    const body = await request.json()

    const isValidateAccessAPI = await validateAccessAPI()

    if (isValidateAccessAPI) {
      return NextResponse.json(
        { message: '¡No tienes permisos para acceder a esta información!' },
        { status: 401 }
      )
    }

    const { id_almuerzo: idAlmuerzo, cantidad } = body

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
        { message: '¡La cantidad de almuerzos reservados es mayor a la cantidad establecida por el administrador!' },
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
        message: '¡No se pudo actualizar la cantidad de almuerzos para la fecha seleccionada!'
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
