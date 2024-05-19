import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'

export async function DELETE (_: Request, { params }: { params: { idEmpleado: string } }) {
  try {
    const { idEmpleado } = params

    await db.empleados.delete({
      where: { id_empleado: idEmpleado }
    })

    const empleados = await db.empleados.findMany()

    return NextResponse.json(
      {
        empleados,
        message: '¡Empleado eliminado exitosamente!'
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
