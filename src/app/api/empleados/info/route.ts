import { NextResponse } from 'next/server'
import { db } from '@/libs/prismaDB'

export async function POST (request: Request) {
  const body = await request.json()

  try {
    const { correo } = body

    const empleado = await db.empleados.findUnique({
      where: { correo }
    })

    if (empleado === null) {
      return NextResponse.json(
        { message: '¡El correo ingresado no está registrado!' },
        { status: 404 }
      )
    }

    const tipoDocumento = await db.tipos_Documento.findUnique({
      where: { id_tipo_documento: empleado.id_tipo_documento },
      select: { tipo_documento: true }
    })

    const sexo = await db.sexos.findUnique({
      where: { id_sexo: empleado.id_sexo },
      select: { sexo: true }
    })

    const { clave: _, ...empleadoWithoutClave } = empleado

    return NextResponse.json(
      {
        empleado: { ...empleadoWithoutClave, tipo_documento: tipoDocumento?.tipo_documento, sexo: sexo?.sexo },
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
