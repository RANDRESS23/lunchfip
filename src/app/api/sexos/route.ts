import { db } from '@/lib/prismaDB'
import { NextResponse } from 'next/server'
import { sexoSchema } from './schema'

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
  const body = await request.json()

  try {
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

    const newSexo = await db.sexos.create({
      data: {
        sexo
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
