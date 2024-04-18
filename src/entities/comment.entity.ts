export class Commentaire {
    public readonly id: number
    public readonly user: number
    public readonly post: number
    public readonly content: string
    public readonly createdAt: Date
    public readonly updatedAt: Date
    public readonly attachedTo: number
    public readonly typeObject: number
  
    constructor(
      id: number,
      user: number,
      post: number,
      content: string,
      createdAt: Date = new Date(),
      updatedAt: Date = new Date(),
      attachedTo:  number,
      typeObject: number
    ) {
      this.id= id
      this.user = user
      this.post = post
      this.content = content
      this.createdAt = createdAt
      this.updatedAt = updatedAt
      this.attachedTo = attachedTo
      this.typeObject = typeObject
    }
  }