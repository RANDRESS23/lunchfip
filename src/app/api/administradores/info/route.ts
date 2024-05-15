import { NextResponse } from 'next/server'
import { db } from '@/libs/prismaDB'

export async function POST (request: Request) {
  const body = await request.json()

  try {
    const { correo } = body

    const administrador = await db.administradores.findUnique({
      where: { correo }
    })

    if (administrador === null) {
      return NextResponse.json(
        { message: '¡El correo ingresado no está registrado!' },
        { status: 404 }
      )
    }

    const tipoDocumento = await db.tipos_Documento.findUnique({
      where: { id_tipo_documento: administrador.id_tipo_documento }
    })

    const sexo = await db.sexos.findUnique({
      where: { id_sexo: administrador.id_sexo }
    })

    const { clave: _, ...administradorWithoutClave } = administrador

    return NextResponse.json(
      {
        administrador: { ...administradorWithoutClave, tipo_documento: tipoDocumento?.tipo_documento, sexo: sexo?.sexo },
        message: '¡Datos validados correctamente!'
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
