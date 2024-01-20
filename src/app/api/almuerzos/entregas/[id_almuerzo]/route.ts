import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'

export async function GET (_: Request, { params }: { params: { id_almuerzo: string } }) {
  try {
    const almuerzoEntregado = await db.almuerzos_Entregados.findUnique({
      where: { id_almuerzo: params.id_almuerzo }
    })

    if (almuerzoEntregado === null) {
      return NextResponse.json(
        { message: 'No se encontró la cantidad de almuerzos entregados para el dia correspondiente.' },
        { status: 404 }
      )
    }

    return NextResponse.json(almuerzoEntregado)
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}
