import { db } from '@/lib/prismaDB'
import { NextResponse } from 'next/server'
import { programaSchema } from './schema'

export async function GET () {
  try {
    const programas = await db.programas.findMany()

    return NextResponse.json(programas)
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
      programa,
      id_facultad: idFacultad
    } = programaSchema.parse(body)

    const existingPrograma = await db.programas.findMany({
      where: { programa }
    })

    if (existingPrograma.length > 0) {
      return NextResponse.json(
        { messsage: 'Programa already exists' },
        { status: 400 }
      )
    }

    const newFacultad = await db.programas.create({
      data: {
        programa,
        id_facultad: idFacultad
      }
    })

    return NextResponse.json(
      { newFacultad, message: 'Programa created successfully' },
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
