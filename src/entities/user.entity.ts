export class User {
  public readonly firstName: string
  public readonly lastName: string
  public readonly email: string
  public password: string
  public readonly regionId: number
  public readonly userRoleId: number

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    regionId: number,
    userRoleId: number
  ) {
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.password = password
    this.regionId = regionId
    this.userRoleId = userRoleId
  }
}

export interface UserLoginInput {
  email: string
  password: string
}

export interface userSignupInput {
  firstName: string
  lastName: string
  email: string
  password: string
  passwordConfirmation: string
  regionId: number
  userRoleId: number
}
