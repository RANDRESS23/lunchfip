export interface EstudianteForm {
  primer_nombre: string
  segundo_nombre: string
  primer_apellido: string
  segundo_apellido: string
  id_tipo_documento: string
  numero_documento: string
  id_facultad: string
  id_programa: string
  correo_institucional: string
  clave: string
  clave_2: string
  id_sexo: string
  celular: string
}

export interface Estudiante {
  id_estudiante: string
  primer_nombre: string
  segundo_nombre: string
  primer_apellido: string
  segundo_apellido: string
  id_tipo_documento: string
  tipo_documento: string
  numero_documento: string
  id_programa: string
  programa: string
  correo_institucional: string
  id_sexo: string
  sexo: string
  celular: string
  saldo: number
  imageUrl: string
  codigoUrl: string
  // codigoUrlReserva: string
  createdAt: Date
  updatedAt: Date
}
