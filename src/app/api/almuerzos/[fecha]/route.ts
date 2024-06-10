import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'

export async function GET (_: Request, { params }: { params: { fecha: string } }) {
  try {
    const fecha = new Date(params.fecha)

    const existingLunchesDate = await db.almuerzos_Fecha.findUnique({
      where: { fecha }
    })

    if (existingLunchesDate === null) {
      return NextResponse.json(
        { messsage: '¡No se encontró la fecha del servicio de almuerzos!' },
        { status: 400 }
      )
    }

    const almuerzo = await db.almuerzos.findFirst({
      where: { id_almuerzos_fecha: existingLunchesDate.id_almuerzos_fecha }
    })

    if (almuerzo === null) {
      return NextResponse.json({
        message: `¡No se encontró el servicio de almuerzos para la fecha ${params.fecha}!`
      }, { status: 404 }
      )
    }

    return NextResponse.json(almuerzo)
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}
