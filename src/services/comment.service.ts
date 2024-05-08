import * as cache from 'memory-cache';
import { log } from '../helpers/logger.helper';
import { Prisma, Comment } from '@prisma/client'; 
import { db } from '../helpers/db.helper';
import { Commentaire } from '../entities/comment.entity';

export class CommentaireService {
  private static commentaireRepo = db.comment;

  static async getCommentByPost(postId: number): Promise<Commentaire[]> {
    const cacheKey = `comments_by_post_${postId}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      log.info('Serving from cache');
      return cachedData;
    }

    log.info('Serving from db');
    const commentaires = await this.commentaireRepo.findMany({
      where: { postId },
      include: { user: true, post: true, parent: true },
    });

    const commentairesFormatted: Commentaire[] = commentaires.map(commentaire => ({
      id: commentaire.id,
      userId: commentaire.userId,
      postId: commentaire.postId,
      content: commentaire.content,
      createdAt: commentaire.createdAt,
      updatedAt: commentaire.updatedAt,
      parentId: commentaire.parentId, 
    }));

    cache.put(cacheKey, commentairesFormatted, 6000);
    return commentairesFormatted;
  }

  static async createComment(commentaire: Commentaire): Promise<Comment | null> {
    try {
      const createdComment = await this.commentaireRepo.create({
        data: {
          userId: commentaire.userId,
          postId: commentaire.postId,
          content: commentaire.content,
          parentId: commentaire.parentId,
          createdAt: commentaire.createdAt,
          updatedAt: commentaire.updatedAt,
        },
      });

      const cacheKey = `comments_by_post_${commentaire.postId}`;
      cache.del(cacheKey); 

      return createdComment;
    } catch (error) {
      log.error(`Error creating commentaire`);
      return null;
    }
  }

  static async deleteCommentAndChildrenById(commentId: number): Promise<void> {
    try {
      await this.commentaireRepo.delete({
        where: { id: commentId },
      });

      await this.commentaireRepo.deleteMany({
        where: { parentId: commentId },
      });

      const cacheKeys = cache.keys();
      for (const key of cacheKeys) {
        if (key.startsWith(`comments_by_post_`)) {
          cache.del(key);
        }
      }
      
    } catch (error) {
      log.error(`Error deleting commentaire and children: ${error}`);
      throw error;
    }
  }
}
