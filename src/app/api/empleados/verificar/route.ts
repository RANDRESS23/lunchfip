import { NextResponse } from 'next/server'
import { empleadosSchema } from '../schema'
import { db } from '@/libs/prismaDB'
import { validateAccessAPI } from '@/libs/validateAccessAPI'

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
      numero_documento: numeroDocumento,
      correo,
      clave,
      celular,
      clave_2: clave2
    } = empleadosSchema.parse(body)

    const existingEmpleadoDocumento = await db.empleados.findUnique({
      where: { numero_documento: numeroDocumento },
      select: { numero_documento: true }
    })

    if (existingEmpleadoDocumento !== null) {
      return NextResponse.json(
        { messsage: '¡El número de documento ya existe en la base de datos!' },
        { status: 400 }
      )
    }

    const existingEmpleadoEmail = await db.empleados.findUnique({
      where: { correo },
      select: { correo: true }
    })

    if (existingEmpleadoEmail !== null) {
      return NextResponse.json(
        { messsage: '¡El correo electrónico ya existe en la base de datos!' },
        { status: 400 }
      )
    }

    const existingEmpleadoCelular = await db.empleados.findUnique({
      where: { celular },
      select: { celular: true }
    })

    if (existingEmpleadoCelular !== null) {
      return NextResponse.json(
        { messsage: '¡El número de celular ya existe en nuestra base de datos!' },
        { status: 400 }
      )
    }

    if (clave !== clave2) {
      return NextResponse.json(
        { messsage: '¡Las contraseñas no coinciden!' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: '¡Datos validados correctamente!' },
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
