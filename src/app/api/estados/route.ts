import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'
import { estadoSchema } from './schema'

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
  const body = await request.json()

  try {
    const {
      estado
    } = estadoSchema.parse(body)

    const existingEstado = await db.estados.findMany({
      where: { estado }
    })

    if (existingEstado.length > 0) {
      return NextResponse.json(
        { messsage: 'Estado already exists' },
        { status: 400 }
      )
    }

    const newEstado = await db.estados.create({
      data: {
        estado
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
