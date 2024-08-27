export class Ressource {
  public readonly title: string
  public readonly content: string
  public readonly authorId: number
  public readonly typePostId: number

  constructor(
    title: string,
    content: string,
    associationId: number,
    typePostId: number
  ) {
    this.title = title
    this.content = content
    this.authorId = associationId
    this.typePostId = typePostId
  }
}

export interface ressourceCreateInput {
  title: string
  content: string
  typePostId: number
}

export interface dbRessource {
  id: number
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  authorId: number
  typePostId: number
}

export class TypePost {
  public readonly libelle: string

  constructor(libelle: string) {
    this.libelle = libelle
  }
}

export interface IFilterSearchRessourceRequest {
  sort: 'asc' | 'desc'
  keyword?: string
  typePostId?: number
  authorId?: number
}

export interface UpdateRessourceInput {
  rid: number
  title: string
  content: string
  typePostId: number
}
