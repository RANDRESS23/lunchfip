import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'

export async function GET (_: Request, { params }: { params: { id_almuerzo: string } }) {
  try {
    const almuerzoReservado = await db.almuerzos_Reservados.findUnique({
      where: { id_almuerzo: params.id_almuerzo }
    })

    if (almuerzoReservado === null) {
      return NextResponse.json(
        { message: 'No se encontró la cantidad de almuerzos reservados para el dia correspondiente.' },
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
