import { Request, Response } from 'express';
import { CommentaireService } from '../services/comment.service';
import { Commentaire } from '../entities/comment.entity';
import { ResponseDTO, SingleMessageDTO, toResponseDTO } from '../dto/response.dto';

export class CommentaireController {

  static async deleteCommentById(req: Request, res: Response): Promise<void> {
    const commentId = Number(req.params.commentId);

    try {
      await CommentaireService.deleteCommentAndChildrenById(commentId);
      const responseDTO: SingleMessageDTO = 'Comment deleted successfully';
      res.status(200).json(toResponseDTO(responseDTO, 200)); 
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }

  static async getCommentByPost(req: Request, res: Response): Promise<void> {
    const postId = Number(req.params.ressourceId);

    try {
      const comments: Commentaire[] = await CommentaireService.getCommentByPost(postId);
      res.status(200).json(toResponseDTO(comments, 200));
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }

  static async createReplyToComment(req: Request, res: Response): Promise<void> {
    const { commentId, userId, parentId, postId } = req.params;
    const { content } = req.body;

    if (!content || !userId || !parentId) {
      res.status(400).json({ error: 'Content, parentId and userId are required fields' });
      return;
    }

    try {
      const reply = await CommentaireService.createReplyToComment(parseInt(commentId), content, parseInt(userId));
      if (!reply) {
        res.status(500).json({ error: 'Failed to create reply to comment' });
        return;
      }
      
      res.status(201).json(toResponseDTO(reply, 201));
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }

  static async createComment(req: Request, res: Response): Promise<void> {
    const { postId, userId } = req.params;
    const { content } = req.body;

    try {
      const newComment = await CommentaireService.createComment(new Commentaire(0, parseInt(userId), parseInt(postId), content, new Date(), new Date(), null));
      if (!newComment) {
        res.status(500).json({ error: 'Failed to create comment' });
        return;
      }

      res.status(201).json(toResponseDTO(newComment, 201));
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }

}
