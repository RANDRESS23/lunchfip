/* ➡ Interfaz con los tipos de las propiedades del Administrador */
export interface Administrador {
  id_administrador: string
  primer_nombre: string
  segundo_nombre: string
  primer_apellido: string
  segundo_apellido: string
  id_tipo_documento: string
  tipo_documento: string
  numero_documento: string
  correo: string
  id_sexo: string
  sexo: string
  celular: string
  createdAt: Date
  updatedAt: Date
}
