export class AssociationDto<T> {
  data: T
  message: string
}

export class AssociationCreatedResponse {
  id: number
}

export class GetAssociationsResponse {
  id: number
  rna: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
}
