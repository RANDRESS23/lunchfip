import { NextResponse } from 'next/server'
import { estudianteSchema } from '../schema'
import { db } from '@/libs/prismaDB'

export async function POST (request: Request) {
  try {
    const body = await request.json()

    const {
      numero_documento: numeroDocumento,
      correo_institucional: correoInstitucional,
      celular,
      clave,
      clave_2: clave2
    } = estudianteSchema.parse(body)

    const existingEstudianteDocumento = await db.estudiantes.findUnique({
      where: { numero_documento: numeroDocumento },
      select: { numero_documento: true }
    })

    if (existingEstudianteDocumento !== null) {
      return NextResponse.json(
        { messsage: '¡El número de documento ya existe en nuestra base de datos!' },
        { status: 400 }
      )
    }

    const existingEstudianteEmail = await db.estudiantes.findUnique({
      where: { correo_institucional: correoInstitucional },
      select: { correo_institucional: true }
    })

    if (existingEstudianteEmail !== null) {
      return NextResponse.json(
        { messsage: '¡El correo electrónico ya existe en nuestra base de datos!' },
        { status: 400 }
      )
    }

    const existingEstudianteCelular = await db.estudiantes.findUnique({
      where: { celular },
      select: { celular: true }
    })

    if (existingEstudianteCelular !== null) {
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
