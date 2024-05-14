import { User } from '../entities/user.entity'
import { toResponseDTO } from '../dto/response.dto'

describe('Test mapping function', () => {
  it('One should have password Omitted', () => {
    const user = new User("Antoine", "Le Bras", "test@mail.com", "12314324", 1, 1)
    const received = toResponseDTO<User>(user, 200)
    const actualWithoutPass = toResponseDTO<User>(user, 200, 'password')

    expect(received.data).toHaveProperty('password')
    expect(actualWithoutPass.data).not.toHaveProperty('password')
  })

  it('Has the correct format', () => {
    const user = new User("Antoine", "Le Bras", "test@mail.com", "12314324", 1, 1)
    const userList = [user]
    const singleString = "Single string it is"

    const receivedEntity = toResponseDTO<User>(user, 200, 'password')
    const receivedEntityList = toResponseDTO<User>(userList, 200, 'password')
    const receivedSingleString = toResponseDTO<string>(singleString, 200)

    expect(receivedEntity.data).toBeInstanceOf(Object)
    expect(receivedEntityList.data).toBeInstanceOf(Array)
    expect(receivedSingleString.data).toEqual(singleString)
  })
})