import { db } from '@/lib/prismaDB'
import { NextResponse } from 'next/server'
import { tipoDocumentoSchema } from './schema'

export async function GET () {
  try {
    const tiposDocumento = await db.tipos_Documento.findMany()

    return NextResponse.json(tiposDocumento)
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
      tipo_documento: tipoDocumento
    } = tipoDocumentoSchema.parse(body)

    const existingTipoDocumento = await db.tipos_Documento.findMany({
      where: { tipo_documento: tipoDocumento }
    })

    if (existingTipoDocumento.length > 0) {
      return NextResponse.json(
        { messsage: 'Tipo Documento already exists' },
        { status: 400 }
      )
    }

    const newTipoDocumento = await db.tipos_Documento.create({
      data: {
        tipo_documento: tipoDocumento
      }
    })

    return NextResponse.json(
      { newTipoDocumento, message: 'Tipo Documento created successfully' },
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
