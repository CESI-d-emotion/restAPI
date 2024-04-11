export class User {
  public firstName: string
  public lastName: string
  public email: string
  public password: string
  public passwordConfirmation: string
  public regionId: number
  public userRoleId: number

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    regionId: number,
    userRoleId: number
  ) {
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.password = password
    this.passwordConfirmation = passwordConfirmation
    this.regionId = regionId
    this.userRoleId = userRoleId
  }
}
