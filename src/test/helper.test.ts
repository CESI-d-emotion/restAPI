import { decryptPassword, encryptPassword } from '../helpers/password.helper'

describe('Test helper function', () => {
  it('Check password encryption', async () => {
    const password = "123456789"
    const hashed = await encryptPassword(password)
    const received = await decryptPassword(password, hashed)

    expect(hashed).not.toEqual(password)
    expect(received).toBeTruthy()
  })
})