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
  id_facultad: string
  facultad: string
  correo_institucional: string
  id_sexo: string
  sexo: string
  celular: string
  saldo: number
  imageUrl: string
  codigoUrl: string
  estado: string
  createdAt: Date
  updatedAt: Date
}

export interface EstudianteAlmuerzo {
  id_estudiante: string
  primer_nombre: string
  segundo_nombre: string
  primer_apellido: string
  segundo_apellido: string
  tipo_documento: string
  numero_documento: string
  programa: string
  facultad: string
  correo_institucional: string
  celular: string
  imageUrl: string
  fecha_reserva: string
  hora_reserva: string
  estado_reserva: string
  fecha_entrega: string
  hora_entrega: string
  reserva_empleado: boolean
  reserva_virtual: boolean
}

export interface EstudianteHistorialReservas {
  tipo_reserva: string
  fecha_reserva: string
  hora_reserva: string
  estado_reserva: string
  fecha_entrega: string
  hora_entrega: string
}
