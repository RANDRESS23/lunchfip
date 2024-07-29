import { NextResponse } from 'next/server'
import { db } from '@/libs/prismaDB'
import { z } from 'zod'
import { encryptPassword } from '@/libs/bcrypt'

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/

const cambioClaveSchema = z.object({
  id_estudiante: z.string(),
  clave: z.string().refine(value => passwordRegex.test(value), {
    message: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.'
  }),
  clave_2: z.string()
}).required().refine(data => data.clave === data.clave_2, {
  message: 'Las contraseñas no coinciden.',
  path: ['clave_2']
})

export async function PATCH (request: Request) {
  try {
    const body = await request.json()

    const {
      id_estudiante: idEstudiante,
      clave,
      clave_2: clave2
    } = cambioClaveSchema.parse(body)

    if (clave !== clave2) {
      return NextResponse.json(
        { messsage: '¡Las contraseñas no coinciden!' },
        { status: 400 }
      )
    }

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const hashedPassword = await encryptPassword(clave)
    await db.estudiantes.update({
      data: { clave: hashedPassword, updatedAt: currentDate },
      where: { id_estudiante: idEstudiante }
    })

    return NextResponse.json(
      { message: '¡Cambio de contraseña de LunchFip exitosamente!' },
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
