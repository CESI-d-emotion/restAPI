import { IRouter } from '../interfaces/router.interface'
import { Router } from 'express'
import { CommentaireController } from '../controllers/comment.controller'

export class CommentRouter implements IRouter {
  public path: string = '/ressource'
  public router: Router = Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/:ressourceId`,
      CommentaireController.getCommentByPost
    )

    this.router.delete(
      `${this.path}/:commentId`,
      CommentaireController.deleteCommentById
    )

    this.router.post(
      `${this.path}/:commentId/reply`,
      CommentaireController.createReplyToComment
    )

    this.router.post(`${this.path}/create`, CommentaireController.createComment)
  }
}
