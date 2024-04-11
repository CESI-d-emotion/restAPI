import { NextFunction, Request, Response } from 'express'
import { Association } from '../entity/association.entity'
import { AssociationService } from '../services/association.service'
import {
  AssociationCreatedResponse,
  AssociationDto,
  GetAssociationsResponse
} from '../dto/association.dto'
import { log } from '../helpers/logger.helper'

export class AssociationController {
  static async createAssociation(
    req: Request<{}, Partial<Association>>,
    res: Response,
    next: NextFunction
  ): Promise<any | AssociationDto<AssociationCreatedResponse>> {
    try {
      const { rna, name, description } = req.body
      log.debug(
        'AssociationController.createAssociation',
        rna,
        name,
        description
      )
      // Verification
      const result = await AssociationService.createAssociation({
        rna,
        name,
        description
      })
      return res.status(200).json({
        data: result,
        message: 'Association created successfully'
      })
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured'
      })
    }
  }

  static async getAssociations(
    req: Request,
    res: Response
  ): Promise<any | AssociationDto<GetAssociationsResponse[]>> {
    try {
      const result = await AssociationService.getAssociations()
      return res.status(200).json({
        data: result,
        message: 'Operation Successful'
      })
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured'
      })
    }
  }
}
