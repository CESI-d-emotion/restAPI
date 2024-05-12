export class Association {
  public readonly rna: string
  public readonly name: string
  public readonly email: string
  public readonly description: string | null
  public password: string
  public passwordConfirmation: string
  public regionId: number

  constructor(
    rna: string,
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    regionId: number,
    description: string | null = null
  ) {
    this.rna = rna
    this.name = name
    this.email = email
    this.description = description
    this.password = password
    this.passwordConfirmation = passwordConfirmation
    this.regionId = regionId
  }
}

export interface AssociationLoginInput {
  email: string
  password: string
}

export interface associationRegisterInput {
  rna: string
  name: string
  email: string
  description: string | null
  password: string
  passwordConfirmation: string | null
  createdAt: Date
  updatedAt: Date
  regionId: number
}

export interface dbAssociation {
  id: number
  rna: string
  name: string
  email: string
  description: string | null
  password: string
  createdAt: Date
  updatedAt: Date
  regionId: number
}

export interface dbAssociationJoin {
  id: number
  rna: string
  name: string
  email: string
  description: string | null
  password: string
  createdAt: Date
  updatedAt: Date
  regionId: number
  region: {
    id: number
    name: string
    nutsCode: string
  }
}
