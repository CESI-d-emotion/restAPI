import { Request, Response } from 'express'
import { toResponseDTO } from '../dto/response.dto'
import { UtilsService } from '../services/utils.service'

export class UtilsController {
  // Get all roles
  static async getRoles(req: Request, res: Response) {
    try {
      const result = await UtilsService.getRoles()
      res.status(200).json(toResponseDTO(result, 200))
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Internal Server Error' })
    }
  }
  // Get all regions
  static async getRegions(req: Request, res: Response) {
    try {
      const result = await UtilsService.getRegions()
      res.status(200).json(toResponseDTO(result, 200))
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Internal Server Error' })
    }
  }
  // Get all Types of post
  static async getTypesPost(req: Request, res: Response) {
    try {
      const result = await UtilsService.getTypesPost()
      res.status(200).json(toResponseDTO(result, 200))
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Internal Server Error' })
    }
  }
}
