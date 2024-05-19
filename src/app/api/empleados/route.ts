import { encryptPassword } from '@/libs/bcrypt'
import { db } from '@/libs/prismaDB'
import { empleadosDataSchema, empleadosSchema } from './schema'
import { NextResponse } from 'next/server'

export async function GET () {
  try {
    const empleados = await db.empleados.findMany()

    return NextResponse.json(empleados)
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
      id_empleado: idEmpleado,
      primer_nombre: primerNombre,
      segundo_nombre: segundoNombre,
      primer_apellido: primerApellido,
      segundo_apellido: segundoApellido,
      numero_documento: numeroDocumento,
      correo,
      clave,
      clave_2: clave2,
      id_sexo: idSexo,
      celular
    } = empleadosSchema.parse(body)

    const existingEmpleadoDocumento = await db.empleados.findUnique({
      where: { numero_documento: numeroDocumento }
    })

    if (existingEmpleadoDocumento !== null) {
      return NextResponse.json(
        { messsage: '¡El número de documento ya existe en nuestra base de datos!' },
        { status: 400 }
      )
    }

    const existingEmpleadoEmail = await db.empleados.findUnique({
      where: { correo }
    })

    if (existingEmpleadoEmail !== null) {
      return NextResponse.json(
        { messsage: '¡El correo electrónico ya existe en nuestra base de datos!' },
        { status: 400 }
      )
    }

    if (clave !== clave2) {
      return NextResponse.json(
        { messsage: '¡Las contraseñas no coinciden!' },
        { status: 400 }
      )
    }

    const roles = await db.roles.findMany({
      where: { rol: 'Empleado' }
    })

    const tiposDocumento = await db.tipos_Documento.findMany()

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const hashedPassword = await encryptPassword(clave)
    const newEmpleado = await db.empleados.create({
      data: {
        id_empleado: idEmpleado,
        primer_nombre: primerNombre,
        segundo_nombre: segundoNombre,
        primer_apellido: primerApellido,
        segundo_apellido: segundoApellido,
        id_tipo_documento: tiposDocumento[0].id_tipo_documento,
        numero_documento: numeroDocumento,
        correo,
        clave: hashedPassword,
        id_sexo: idSexo,
        celular,
        id_rol: roles[0].id_rol,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    const empleados = await db.empleados.findMany()
    const { clave: _, ...empleado } = newEmpleado

    return NextResponse.json(
      {
        empleado,
        empleados,
        message: '¡Empleado registrado exitosamente!'
      },
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

export async function PUT (request: Request) {
  const body = await request.json()

  try {
    const {
      id_empleado: idEmpleado,
      primer_nombre: primerNombre,
      segundo_nombre: segundoNombre,
      primer_apellido: primerApellido,
      segundo_apellido: segundoApellido,
      numero_documento: numeroDocumento,
      correo,
      celular
    } = empleadosDataSchema.parse(body)

    const currentEmployee = await db.empleados.findUnique({
      where: { id_empleado: idEmpleado }
    })

    if (currentEmployee?.numero_documento !== numeroDocumento) {
      const existingEmpleadoDocumento = await db.empleados.findUnique({
        where: { id_empleado: idEmpleado }
      })

      if (existingEmpleadoDocumento !== null) {
        return NextResponse.json(
          { messsage: '¡El número de documento ya existe en la base de datos!' },
          { status: 400 }
        )
      }
    }

    if (currentEmployee?.correo !== correo) {
      const existingEmpleadoEmail = await db.empleados.findUnique({
        where: { correo }
      })

      if (existingEmpleadoEmail !== null) {
        return NextResponse.json(
          { messsage: '¡El correo electrónico ya existe en la base de datos!' },
          { status: 400 }
        )
      }
    }

    if (currentEmployee?.celular !== celular) {
      const existingEmpleadoCelular = await db.empleados.findUnique({
        where: { celular }
      })

      if (existingEmpleadoCelular !== null) {
        return NextResponse.json(
          { messsage: '¡El número de celular ya existe en nuestra base de datos!' },
          { status: 400 }
        )
      }
    }

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const updatedEmpleado = await db.empleados.update({
      data: {
        primer_nombre: primerNombre,
        segundo_nombre: segundoNombre,
        primer_apellido: primerApellido,
        segundo_apellido: segundoApellido,
        numero_documento: numeroDocumento,
        correo,
        celular,
        updatedAt: currentDate
      },
      where: { id_empleado: idEmpleado }
    })

    const empleados = await db.empleados.findMany()
    const { clave: _, ...empleado } = updatedEmpleado

    return NextResponse.json(
      {
        empleado,
        empleados,
        message: '¡Empleado actualizado exitosamente!'
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
