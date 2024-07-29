import { db } from '@/libs/prismaDB'
import { validateAccessAPI } from '@/libs/validateAccessAPI'
import { NextResponse } from 'next/server'

export async function GET (_: Request, { params }: { params: { id_almuerzo: string } }) {
  try {
    const isValidateAccessAPI = await validateAccessAPI()

    if (isValidateAccessAPI) {
      return NextResponse.json(
        { message: '¡No tienes permisos para acceder a esta información!' },
        { status: 401 }
      )
    }

    const almuerzoReservado = await db.almuerzos_Reservados.findUnique({
      where: { id_almuerzo: params.id_almuerzo },
      select: { id_almuerzos_reservados: true }
    })

    if (almuerzoReservado === null) {
      return NextResponse.json(
        { message: '¡El administrador no ha definido la cantidad total de almuerzos para reservar, intente más tarde!.', almuerzoReservado },
        { status: 404 }
      )
    }

    return NextResponse.json(almuerzoReservado)
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}
