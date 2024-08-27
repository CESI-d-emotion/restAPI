export class Commentaire {
  public readonly id: number
  public readonly userId: number
  public readonly postId: number
  public readonly content: string
  public readonly createdAt: Date
  public readonly updatedAt: Date
  public readonly parentId: number | null

  constructor(
    id: number,
    userId: number,
    postId: number,
    content: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    parentId: number | null
  ) {
    this.id = id
    this.userId = userId
    this.postId = postId
    this.content = content
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.parentId = parentId
  }
}

export interface dbComment {
  id: number
  content: string
  createdAt: Date
  updatedAt: Date
  userId: number
  postId: number
}

export interface ICommentCreateInput {
  content: string
  attachedToType: 'ressource' | 'comment'
  attachedToId: number
}
