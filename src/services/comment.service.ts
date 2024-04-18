import * as cache from 'memory-cache';
import { log } from '../helpers/logger.helper';
import { Prisma, postComment } from '@prisma/client'; // Importez les types Prisma nécessaires
import { db } from '../helpers/db.helper';
import { Commentaire } from '../entities/comment.entity';

export class CommentaireService {
  private static commentaireRepo = db.postComment;

  static async getCommentaireByPost(postId: number): Promise<postComment[]> {
    const cacheKey = `comments_by_post_${postId}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      log.info('Serving from cache');
      return cachedData;
    }

    log.info('Serving from db');
    const commentaire = await this.commentaireRepo.findMany({
      where: { postId },
      include: { user: true, post: true, attachedTo: true, typeObject: true },
    });

    cache.put(cacheKey, commentaire, 6000);
    return commentaire;
  }

  static async createCommentaire(commentaire: Commentaire): Promise<postComment | null> {
    try {
      const createdComment = await this.commentaireRepo.create({
        data: {
          userId: commentaire.user,
          postId: commentaire.post,
          content: commentaire.content,
          attachedToId: commentaire.attachedTo,
          typeObjectId: commentaire.typeObject,
          createdAt: commentaire.createdAt,
          updatedAt: commentaire.updatedAt,
        },
      });

      const cacheKey = `comments_by_post_${commentaire.post}`;
      cache.del(cacheKey); 

      return createdComment;
    } catch (error) {
      log.error(`Error creating commentaire`);
      return null;
    }
  }

  static async deleteCommentaireById(commentId: number): Promise<void> {
    await this.commentaireRepo.delete({
      where: { id: commentId },
    });
  }
}
