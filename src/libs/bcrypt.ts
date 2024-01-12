import bcrypt from 'bcryptjs'

export async function encryptPassword (password: string) {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  return hash
}

export async function verifyPassword (password: string, hash: string) {
  const comparePasswords = await bcrypt.compare(password, hash)
  return comparePasswords
}
