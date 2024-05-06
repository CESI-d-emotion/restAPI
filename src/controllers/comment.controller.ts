import { Request, Response } from 'express';
import { CommentaireService } from '../services/comment.service';
import { Commentaire } from '../entities/comment.entity';
import { ResponseDTO, SingleMessageDTO, toResponseDTO } from '../dto/response.dto';

export class CommentaireController {

  static async deleteCommentById(req: Request, res: Response): Promise<void> {
    const commentId = Number(req.params.commentId);

    try {
      await CommentaireService.deleteCommentAndChildrenById(commentId);
      const responseDTO: SingleMessageDTO = 'Commentaire deleted successfully';
      res.status(200).json(toResponseDTO(responseDTO, 200)); 
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}

static async getCommentByPost(req: Request, res: Response): Promise<void> {
    const postId = Number(req.params.postId);

    try {
      const comments: Commentaire[] = await CommentaireService.getCommentByPost(postId);
      res.status(200).json(toResponseDTO(comments, 200));
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
}
