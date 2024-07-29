import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'
import { sexoSchema } from './schema'
import { validateAccessAPI } from '@/libs/validateAccessAPI'

export async function GET () {
  try {
    const sexos = await db.sexos.findMany()

    return NextResponse.json(sexos)
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}

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
      sexo
    } = sexoSchema.parse(body)

    const existingSexo = await db.sexos.findMany({
      where: { sexo }
    })

    if (existingSexo.length > 0) {
      return NextResponse.json(
        { messsage: 'Sexo already exists' },
        { status: 400 }
      )
    }

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const newSexo = await db.sexos.create({
      data: {
        sexo,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    return NextResponse.json(
      { newSexo, message: 'Sexo created successfully' },
      { status: 201 }
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
