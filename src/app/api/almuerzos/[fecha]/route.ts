import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'

export async function GET (_: Request, { params }: { params: { fecha: string } }) {
  const fechaAux = new Date(params.fecha)
  const año = fechaAux.getFullYear()
  const mes = fechaAux.getMonth() + 1
  const dia = fechaAux.getDate()

  const fecha = new Date(`${año}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`)

  try {
    const almuerzo = await db.almuerzos.findUnique({
      where: { fecha }
    })

    return NextResponse.json(almuerzo)
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}
