export class Association {
  public readonly rna: string
  public readonly nom: string
  public readonly email: string
  public readonly description: string
  public password: string
  public readonly passwordConfirmation: string
  public readonly createAt: Date
  public readonly updateAt: Date

  constructor(
    rna: string,
    nom: string,
    email: string,
    description: string,
    password: string,
    passwordConfirmation: string,
    createAt: Date = new Date(),
    updateAt: Date = new Date()
  ) {
    this.rna = rna
    this.nom = nom
    this.email = email
    this.description = description
    this.password = password
    this.passwordConfirmation = passwordConfirmation
    this.createAt = createAt
    this.updateAt = updateAt
  }
}


export interface AssociationLoginInput {
  email: string
  password: string
}