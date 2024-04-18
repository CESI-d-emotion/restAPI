export class Ressource {
  public readonly titre: string
  public readonly content: string
  public readonly createAt: Date
  public readonly updateAt: Date
  public readonly associationId: number

  constructor(
    titre: string,
    content: string,
    createAt: Date = new Date(),
    updateAt: Date = new Date(),
    associationId: number
  ) {
    this.titre = titre
    this.content = content
    this.createAt = createAt
    this.updateAt = updateAt
    this.associationId = associationId
  }
}