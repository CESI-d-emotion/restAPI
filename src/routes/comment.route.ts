import { IRouter } from '../interfaces/router.interface'
import { Router } from 'express'
import { CommentaireController } from '../controllers/comment.controller'
import { requireUser } from '../helpers/jwt.helper'

export class CommentRouter implements IRouter {
  public path: string = '/comments'
  public router: Router = Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.delete(
      `${this.path}/:commentId`,
      requireUser,
      CommentaireController.deleteCommentById
    )

    this.router.post(
      `${this.path}`,
      requireUser,
      CommentaireController.createComment
    )

    this.router.get(
      `${this.path}/react/:ressourceId`,
      requireUser,
      CommentaireController.react
    )
  }
}
