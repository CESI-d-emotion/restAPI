export class CommentaireResponse {
  public id: number
  public userId: number
  public postId: number
  public content: string
  public createdAt: Date
  public updatedAt: Date
  public parentId: number | null
}
