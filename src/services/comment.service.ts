import * as cache from 'memory-cache'
import { PrismaClient } from '@prisma/client'
import { log } from '../helpers/logger.helper'
import { Commentaire } from '../entities/comment.entity'

const prisma = new PrismaClient()

export class CommentaireService {
  static async getCommentByPost(postId: number): Promise<Commentaire[]> {
    const cacheKey = `comments_by_post_${postId}`
    const cachedData = cache.get(cacheKey)

    if (cachedData) {
      log.info('Serving from cache')
      return cachedData
    }

    log.info('Serving from db')
    const commentaires = await prisma.comment.findMany({
      where: { postId },
      include: { user: true, post: true, parent: true }
    })

    const commentairesFormatted: Commentaire[] = commentaires.map(
      commentaire => ({
        id: commentaire.id,
        userId: commentaire.userId,
        postId: commentaire.postId,
        content: commentaire.content,
        createdAt: commentaire.createdAt,
        updatedAt: commentaire.updatedAt,
        parentId: commentaire.parentId
      })
    )

    cache.put(cacheKey, commentairesFormatted, 6000)
    return commentairesFormatted
  }

  static async createComment(
    commentaire: Commentaire
  ): Promise<Commentaire | null> {
    try {
      const createdComment = await prisma.comment.create({
        data: {
          userId: commentaire.userId,
          postId: commentaire.postId,
          content: commentaire.content,
          parentId: commentaire.parentId,
          createdAt: commentaire.createdAt,
          updatedAt: commentaire.updatedAt
        }
      })

      const cacheKey = `comments_by_post_${commentaire.postId}`
      cache.del(cacheKey)

      return createdComment
    } catch (error) {
      log.error('Error creating commentaire')
      return null
    }
  }

  static async createReplyToComment(
    commentId: number,
    replyContent: string,
    userId: number
  ): Promise<Commentaire | null> {
    try {
      const parentComment = await prisma.comment.findUnique({
        where: { id: commentId }
      })

      if (!parentComment) {
        throw new Error('Parent comment not found')
      }

      const createdReply = await prisma.comment.create({
        data: {
          userId,
          postId: parentComment.postId,
          content: replyContent,
          parentId: commentId
        }
      })

      const cacheKey = `comments_by_post_${parentComment.postId}`
      cache.del(cacheKey)

      return createdReply
    } catch (error) {
      log.error(`Error creating reply to comment: ${error}`)
      return null
    }
  }

  static async deleteCommentAndChildrenById(commentId: number): Promise<void> {
    try {
      await prisma.comment.delete({
        where: { id: commentId }
      })

      await prisma.comment.deleteMany({
        where: { parentId: commentId }
      })

      const cacheKeys = cache.keys()
      for (const key of cacheKeys) {
        if (key.startsWith('comments_by_post_')) {
          cache.del(key)
        }
      }
    } catch (error) {
      log.error(`Error deleting commentaire and children: ${error}`)
      throw error
    }
  }
}
