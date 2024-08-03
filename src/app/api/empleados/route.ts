import { encryptPassword } from '@/libs/bcrypt'
import { db } from '@/libs/prismaDB'
import { empleadosDataSchema, empleadosSchema } from './schema'
import { NextResponse } from 'next/server'
import { validateAccessAPI } from '@/libs/validateAccessAPI'

export async function GET (request: Request) {
  try {
    const isValidateAccessAPI = await validateAccessAPI()

    if (isValidateAccessAPI) {
      return NextResponse.json(
        { message: '¡No tienes permisos para acceder a esta información!' },
        { status: 401 }
      )
    }

    const searchParams = new URL(request.url).searchParams
    const page = searchParams.get('page')
    const rows = searchParams.get('rows')

    if (page === null) {
      return NextResponse.json(
        { messsage: '¡El parámetro "page" es requerido!' },
        { status: 400 }
      )
    }

    if (rows === null) {
      return NextResponse.json(
        { messsage: '¡El parámetro "rows" es requerido!' },
        { status: 400 }
      )
    }

    const empleadosTotal = await db.empleados.findMany()
    const totalEmpleados = await Promise.all(empleadosTotal.map(async empleado => {
      const estadoEmpleado = await db.estados_Empleados.findFirst({
        where: { id_empleado: empleado.id_empleado },
        select: { id_estado: true }
      })

      const estado = await db.estados.findUnique({
        where: { id_estado: estadoEmpleado?.id_estado },
        select: { estado: true }
      })

      return { ...empleado, estado: estado?.estado ?? '' }
    }))

    const empleados = empleadosTotal.slice(Number(rows) * (Number(page) - 1), Number(rows) * Number(page))

    const empleadosLunchFip = await Promise.all(empleados.map(async (empleado) => {
      const sexoPromise = await db.sexos.findUnique({
        where: { id_sexo: empleado.id_sexo },
        select: { sexo: true }
      })

      const estadoEmpleadoPromise = await db.estados_Empleados.findFirst({
        where: { id_empleado: empleado.id_empleado },
        select: { id_estado: true }
      })

      const [
        sexo,
        estado
      ] = await Promise.all([
        sexoPromise,
        estadoEmpleadoPromise
      ])

      const estadoEmpleado = await db.estados.findUnique({
        where: { id_estado: estado?.id_estado },
        select: { estado: true }
      })

      return {
        ...empleado, sexo: sexo?.sexo, estado: estadoEmpleado?.estado
      }
    }))

    return NextResponse.json({
      empleados: empleadosLunchFip,
      totalEmpleados,
      empleadosCount: empleadosTotal.length
    })
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
      where: { numero_documento: numeroDocumento },
      select: { numero_documento: true }
    })

    if (existingEmpleadoDocumento !== null) {
      return NextResponse.json(
        { messsage: '¡El número de documento ya existe en nuestra base de datos!' },
        { status: 400 }
      )
    }

    const existingEmpleadoEmail = await db.empleados.findUnique({
      where: { correo },
      select: { correo: true }
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

    const rolEmpleado = await db.roles.findUnique({
      where: { rol: 'Empleado' },
      select: { id_rol: true }
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
        id_rol: rolEmpleado?.id_rol ?? '',
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    const estados = await db.estados.findMany()

    await db.estados_Empleados.create({
      data: {
        id_empleado: newEmpleado.id_empleado,
        id_estado: estados[0].id_estado,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    const sexo = await db.sexos.findUnique({
      where: { id_sexo: newEmpleado.id_sexo },
      select: { sexo: true }
    })

    const estadoEmpleado = await db.estados_Empleados.findFirst({
      where: { id_empleado: newEmpleado.id_empleado },
      select: { id_estado: true }
    })

    const estado = await db.estados.findUnique({
      where: { id_estado: estadoEmpleado?.id_estado },
      select: { estado: true }
    })

    const empleadosAux = await db.empleados.findMany()
    const empleados = await Promise.all(empleadosAux.map(async (empleado) => {
      const sexoPromise = await db.sexos.findUnique({
        where: { id_sexo: empleado.id_sexo },
        select: { sexo: true }
      })

      const estadoEmpleadoPromise = await db.estados_Empleados.findFirst({
        where: { id_empleado: empleado.id_empleado },
        select: { id_estado: true }
      })

      const [
        sexo,
        estadoEmpleado
      ] = await Promise.all([
        sexoPromise,
        estadoEmpleadoPromise
      ])

      const estadoPromise = await db.estados.findUnique({
        where: { id_estado: estadoEmpleado?.id_estado },
        select: { estado: true }
      })

      const [
        estado
      ] = await Promise.all([
        estadoPromise
      ])

      return { ...empleado, sexo: sexo?.sexo, estado: estado?.estado }
    }))

    const { clave: _, ...empleado } = newEmpleado

    return NextResponse.json(
      {
        empleado: { ...empleado, sexo: sexo?.sexo, estado: estado?.estado },
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
      where: { id_empleado: idEmpleado },
      select: { numero_documento: true, correo: true, celular: true }
    })

    if (currentEmployee?.numero_documento !== numeroDocumento) {
      const existingEmpleadoDocumento = await db.empleados.findUnique({
        where: { id_empleado: idEmpleado },
        select: { numero_documento: true }
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
        where: { correo },
        select: { correo: true }
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
        where: { celular },
        select: { celular: true }
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

    const estados = await db.estados.findMany()

    await db.estados_Empleados.updateMany({
      data: {
        id_empleado: updatedEmpleado.id_empleado,
        id_estado: estados[0].id_estado,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      where: { id_empleado: idEmpleado }
    })

    const sexo = await db.sexos.findUnique({
      where: { id_sexo: updatedEmpleado.id_sexo },
      select: { sexo: true }
    })

    const estadoEmpleado = await db.estados_Empleados.findFirst({
      where: { id_empleado: updatedEmpleado.id_empleado },
      select: { id_estado: true }
    })

    const estado = await db.estados.findUnique({
      where: { id_estado: estadoEmpleado?.id_estado },
      select: { estado: true }
    })

    const empleadosAux = await db.empleados.findMany()
    const empleados = await Promise.all(empleadosAux.map(async (empleado) => {
      const sexoPromise = await db.sexos.findUnique({
        where: { id_sexo: empleado.id_sexo },
        select: { sexo: true }
      })

      const estadoEmpleadoPromise = await db.estados_Empleados.findFirst({
        where: { id_empleado: empleado.id_empleado },
        select: { id_estado: true }
      })

      const [
        sexo,
        estadoEmpleado
      ] = await Promise.all([
        sexoPromise,
        estadoEmpleadoPromise
      ])

      const estadoPromise = await db.estados.findUnique({
        where: { id_estado: estadoEmpleado?.id_estado },
        select: { estado: true }
      })

      const [
        estado
      ] = await Promise.all([
        estadoPromise
      ])

      return { ...empleado, sexo: sexo?.sexo, estado: estado?.estado }
    }))

    const { clave: _, ...empleado } = updatedEmpleado

    return NextResponse.json(
      {
        empleado: { ...empleado, sexo: sexo?.sexo, estado: estado?.estado },
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
