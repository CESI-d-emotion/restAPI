import { compare, hash } from 'bcrypt'

export async function encryptPassword(x: string) {
  return await hash(x, 12)
}

export async function decryptPassword(x: string, password: string) {
  return await compare(x, password)
}
