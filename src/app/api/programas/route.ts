import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'
import { programaSchema } from './schema'
import { validateAccessAPI } from '@/libs/validateAccessAPI'

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
      programa,
      id_facultad: idFacultad
    } = programaSchema.parse(body)

    const existingPrograma = await db.programas.findUnique({
      where: { programa },
      select: { id_programa: true }
    })

    if (existingPrograma) {
      return NextResponse.json(
        { messsage: 'Programa already exists' },
        { status: 400 }
      )
    }

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const newFacultad = await db.programas.create({
      data: {
        programa,
        id_facultad: idFacultad,
        createdAt: currentDate,
        updatedAt: currentDate
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
