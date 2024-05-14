import { User } from '../entities/user.entity'

describe('User Entity', () => {
  const userVariables = {
    firstName: 'Antoine',
    lastName: 'Le Bras',
    email: 'test@mail.com',
    password: '12345678',
    regionId: 1,
    userRoleId: 1
  }

  it('Should be instance of UserEntity', () => {
    const user = new User(
      userVariables.firstName,
      userVariables.lastName,
      userVariables.email,
      userVariables.password,
      userVariables.regionId,
      userVariables.userRoleId
    )

    expect(user).toBeInstanceOf(User)
  })

  it('Every property can be read', () => {
    const user = new User(
      userVariables.firstName,
      userVariables.lastName,
      userVariables.email,
      userVariables.password,
      userVariables.regionId,
      userVariables.userRoleId
    )

    expect(user.firstName).toEqual(userVariables.firstName)
    expect(user.lastName).toEqual(userVariables.lastName)
    expect(user.email).toEqual(userVariables.email)
    expect(user.password).toEqual(userVariables.password)
    expect(user.regionId).toEqual(userVariables.regionId)
    expect(user.userRoleId).toEqual(userVariables.userRoleId)
  })
})
