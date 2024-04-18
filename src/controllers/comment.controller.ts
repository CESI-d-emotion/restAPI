import { Request, Response } from 'express';
import { CommentaireService } from '../services/comment.service';
import { Commentaire } from '../entities/comment.entity';
import { ResponseDTO, SingleMessageDTO, toResponseDTO } from '../dto/response.dto';

export class CommentaireController {

    static async deleteCommentaireById(req: Request, res: Response): Promise<void> {
        const commentId = Number(req.params.commentId);
    
        try {
          await CommentaireService.deleteCommentaireById(commentId);
          const responseDTO: SingleMessageDTO = { message: 'Commentaire deleted successfully' };
          res.status(200).json(responseDTO);
        } catch (error: any) { // Définir le type de l'erreur explicitement
          res.status(500).json({ error: error.message || 'Internal Server Error' });
        }
      }

}
