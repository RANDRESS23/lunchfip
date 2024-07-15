import { NextResponse } from 'next/server'
import { db } from '@/libs/prismaDB'
import { z } from 'zod'

const emailRegex = /^[A-Za-z0-9._%+-]+@itfip\.edu\.co$/

const correoInstitucionalSchema = z.object({
  correo_institucional: z.string().refine(value => emailRegex.test(value), {
    message: 'Debes usar un correo institucional. (@itfip.edu.co)'
  })
})

export async function POST (request: Request) {
  const body = await request.json()

  try {
    const {
      correo_institucional: correoInstitucional
    } = correoInstitucionalSchema.parse(body)

    const existingEstudianteEmail = await db.estudiantes.findUnique({
      where: { correo_institucional: correoInstitucional },
      select: { numero_documento: true }
    })

    if (existingEstudianteEmail === null) {
      return NextResponse.json(
        { messsage: '¡El correo electrónico no existe en nuestra base de datos!' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        numero_documento: existingEstudianteEmail.numero_documento,
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
