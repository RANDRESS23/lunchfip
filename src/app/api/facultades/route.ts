import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'
import { facultadSchema } from './schema'
import { validateAccessAPI } from '@/libs/validateAccessAPI'

export async function GET () {
  try {
    const facultades = await db.facultades.findMany()

    return NextResponse.json(facultades)
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
      facultad
    } = facultadSchema.parse(body)

    const existingFacultad = await db.facultades.findUnique({
      where: { facultad },
      select: { id_facultad: true }
    })

    if (existingFacultad) {
      return NextResponse.json(
        { messsage: 'Facultad already exists' },
        { status: 400 }
      )
    }

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const newFacultad = await db.facultades.create({
      data: {
        facultad,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    return NextResponse.json(
      { newFacultad, message: 'Facultad created successfully' },
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
