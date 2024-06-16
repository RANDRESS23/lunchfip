import bcrypt from 'bcryptjs'

/* ➡ Función encriptar contraseñas */
export async function encryptPassword (password: string) {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  return hash
}

/* ➡ Función comparar contraseñas */
export async function verifyPassword (password: string, hash: string) {
  const comparePasswords = await bcrypt.compare(password, hash)
  return comparePasswords
}
