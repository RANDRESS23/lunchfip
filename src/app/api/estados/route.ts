import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'
import { estadoSchema } from './schema'
import { validateAccessAPI } from '@/libs/validateAccessAPI'

export async function GET () {
  try {
    const estados = await db.estados.findMany()

    return NextResponse.json(estados)
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
      estado
    } = estadoSchema.parse(body)

    const existingEstado = await db.estados.findMany({
      where: { estado },
      select: { id_estado: true }
    })

    if (existingEstado.length > 0) {
      return NextResponse.json(
        { messsage: 'Estado already exists' },
        { status: 400 }
      )
    }

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const newEstado = await db.estados.create({
      data: {
        estado,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    return NextResponse.json(
      { newEstado, message: 'Estado created successfully' },
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
