import { Request, Response } from 'express'
import { CommentaireService } from '../services/comment.service'
import { Commentaire, ICommentCreateInput } from '../entities/comment.entity'
import {
  ResponseDTO,
  SingleMessageDTO,
  toResponseDTO
} from '../dto/response.dto'
import { UserService } from '../services/user.service'
import { RessourceService } from '../services/ressource.service'

export class CommentaireController {
  static async deleteCommentById(req: Request, res: Response) {
    const commentId = parseInt(req.params.commentId)
    const user = res.locals.user

    if (!user) {
      return res
        .status(400)
        .json({ error: 'User not found', message: 'user not found' })
    }

    try {
      const connectedUser = await UserService.getUserById(user.id)
      const comment = await CommentaireService.getCommentById(commentId)
      if (!comment) {
        return res.status(404).json({
          error: 404,
          message: 'Comment not found'
        })
      }
      if (
        !connectedUser ||
        (connectedUser.userRoleId !== 1 && connectedUser.id !== comment.userId)
      ) {
        return res.status(401).json({
          error: 401,
          message: 'You are not allowed'
        })
      }
      await CommentaireService.deleteCommentAndChildrenById(commentId)
      const responseDTO: SingleMessageDTO = 'Comment deleted successfully'
      res.status(200).json(toResponseDTO(responseDTO, 200))
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal Server Error' })
    }
  }

  static async createComment(
    req: Request<{}, {}, ICommentCreateInput>,
    res: Response
  ) {
    const input = req.body
    const user = res.locals.user

    if (!user) {
      return res
        .status(400)
        .json({ error: 'User not found', message: 'user not found' })
    }

    try {
      await CommentaireService.createComment(input, user.id, user.entity)
      res.status(201).json(toResponseDTO('Commentaire ajouté', 201))
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal Server Error' })
    }
  }

  static async react(req: Request, res: Response) {
    const connectedUser = res.locals.user
    const ressourceId = parseInt(req.params.ressourceId)

    if (!connectedUser) {
      return res
        .status(400)
        .json({ error: 'User not found', message: 'user not found' })
    }

    try {
      const user = await UserService.getUserById(connectedUser.id)
      const ressource = await RessourceService.getRessourceById(ressourceId)
      if (!user || !ressource) {
        return res.status(401).json({
          error: 401,
          message: 'Ressource not found'
        })
      }

      await CommentaireService.reactAction(ressource.id, user.id)
      res.status(200).json(toResponseDTO('Reaction OK', 200))
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Internal Server Error' })
    }
  }
}
