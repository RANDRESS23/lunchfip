import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'

export async function GET () {
  try {
    const empleados = await db.empleados.findMany()
    const emailsEmpleados = empleados.map((empleado) => empleado.correo)

    return NextResponse.json({ emailsEmpleados })
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}
