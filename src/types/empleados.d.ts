export interface Empleado {
  primer_nombre: string
  segundo_nombre: string
  primer_apellido: string
  segundo_apellido: string
  id_tipo_documento: string
  numero_documento: string
  correo: string
  clave: string
  id_sexo: string
  celular: string
  createdAt: Date
  updatedAt: Date
}

export interface EmpleadoSignIn extends Empleado {
  id_empleado: string
  tipo_documento: string
  sexo: string
}
