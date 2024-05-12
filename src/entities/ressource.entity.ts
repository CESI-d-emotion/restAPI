export class Ressource {
  public readonly  id: number
  public readonly title: string
  public readonly content: string
  public readonly createAt: Date
  public readonly updateAt: Date
  public readonly authorId: number
  public readonly typePostId: number

  constructor(
    id: number,
    title: string,
    content: string,
    createAt: Date = new Date(),
    updateAt: Date = new Date(),
    associationId: number,
    typePostId: number,
  ) {
    this.id = id
    this.title = title
    this.content = content
    this.createAt = createAt
    this.updateAt = updateAt
    this.authorId = associationId
    this.typePostId = typePostId
  }
}

export interface dbRessource{
  id:number
  title:string
  content:string
  createdAt:Date
  updatedAt:Date
  authorId:number
  typePostId:number
}
