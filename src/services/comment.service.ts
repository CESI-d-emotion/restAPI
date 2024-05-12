import * as cache from 'memory-cache'
import { PrismaClient } from '@prisma/client'
import { log } from '../helpers/logger.helper'
import { Commentaire, ICommentCreateInput } from '../entities/comment.entity'
import { db } from '../helpers/db.helper'

export class CommentaireService {
  private static commentRepo = db.comment
  private static reactionRepo = db.postReaction

  static async createComment(
    commentaire: ICommentCreateInput,
    authorId: number,
    authorType: 'isuser' | 'isassociation'
  ) {
    if (commentaire.attachedToType == 'comment') {
      await this.commentRepo.create({
        data: {
          content: commentaire.content,
          attachedToType: commentaire.attachedToType,
          parent: { connect: { id: commentaire.attachedToId } },
          ...(authorType == 'isuser' && {
            user: { connect: { id: authorId } }
          }),
          ...(authorType == 'isassociation' && {
            associations: { connect: { id: authorId } }
          })
        }
      })
    } else if (commentaire.attachedToType == 'ressource') {
      await this.commentRepo.create({
        data: {
          content: commentaire.content,
          attachedToType: commentaire.attachedToType,
          post: { connect: { id: commentaire.attachedToId } },
          ...(authorType == 'isuser' && {
            user: { connect: { id: authorId } }
          }),
          ...(authorType == 'isassociation' && {
            associations: { connect: { id: authorId } }
          })
        }
      })
    }
  }

  static async deleteCommentAndChildrenById(commentId: number): Promise<void> {
    await this.commentRepo.delete({
      where: { id: commentId }
    })
  }

  static async getCommentById(commentId: number) {
    return this.commentRepo.findFirst({
      where: { id: commentId }
    })
  }

  static async reactAction(ressourceId: number, userId: number) {
    // Check if user already likes ressource
    const checking = await this.reactionRepo.findFirst({
      where: {
        userId,
        postId: ressourceId
      }
    })

    if (checking) {
      await this.reactionRepo.delete({
        where: {
          id: checking.id
        }
      })
    } else {
      await this.reactionRepo.create({
        data: {
          users: { connect: { id: userId } },
          post: { connect: { id: ressourceId } }
        }
      })
    }
  }
}
