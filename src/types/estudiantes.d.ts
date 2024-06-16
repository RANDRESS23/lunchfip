/* ➡ Interfaz con los tipos de las propiedades del formulario del Estudiante */
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

/* ➡ Interfaz con los tipos de las propiedades del Estudiante */
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

/* ➡ Interfaz con los tipos de las propiedades del Estudiante Almuerzo */
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

/* ➡ Interfaz con los tipos de las propiedades del historial de reservas del Estudiante */
export interface EstudianteHistorialReservas {
  tipo_reserva: string
  fecha_reserva: string
  hora_reserva: string
  estado_reserva: string
  fecha_entrega: string
  hora_entrega: string
}

/* ➡ Interfaz con los tipos de las propiedades del historial de recargas del Estudiante */
export interface EstudianteHistorialRecargas {
  id_recarga: string
  fecha_recarga: string
  hora_recarga: string
  saldo_recargado: number
}
