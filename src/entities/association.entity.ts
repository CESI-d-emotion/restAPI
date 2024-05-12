export class Association {
  public readonly rna: string
  public readonly name: string
  public readonly email: string
  public readonly description: string | null
  public password: string
  public readonly createdAt: Date
  public readonly updatedAt: Date
  public regionId: number

  constructor(
    rna: string,
    name: string,
    email: string,
    password: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    regionId: number,
    description: string | null = null
  ) {
    this.rna = rna
    this.name = name
    this.email = email
    this.description = description
    this.password = password
    this.createdAt = createdAt
    this.updatedAt = updatedAt
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
  updatedAt: Date,
  regionId: number
  region: {
    id: number,
    name: string,
    nutsCode: string
  }
}
