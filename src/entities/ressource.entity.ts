export class Ressource {
  public readonly title: string
  public readonly content: string
  public readonly createAt: Date
  public readonly updateAt: Date
  public readonly associationId: number
  public readonly typePostId: number

  constructor(
    title: string,
    content: string,
    createAt: Date = new Date(),
    updateAt: Date = new Date(),
    associationId: number,
    typePostId: number,
  ) {
    this.title = title
    this.content = content
    this.createAt = createAt
    this.updateAt = updateAt
    this.associationId = associationId
    this.typePostId = typePostId
  }
}

export interface dbRessource{
  title:string
  content:string
  createdAt:Date
  updatedAt:Date
  associationId:number
  typePostId:number

}
