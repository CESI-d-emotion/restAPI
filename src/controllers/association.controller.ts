import { Request, Response } from 'express'
import { AssociationResponse } from '../dto/association.dto'
import { AssociationService } from '../services/association.service'
import {
  ResponseDTO,
  SingleMessageDTO,
  toResponseDTO
} from '../dto/response.dto'
import {
  Association,
  AssociationLoginInput,
  associationRegisterInput,
  dbAssociation,
  UpdateAssociationInput
} from '../entities/association.entity'
import { encryptPassword } from '../helpers/password.helper'
import { maxAge } from '../helpers/jwt.helper'
import { IFilterSearchAssoRequest } from '../interfaces/request.interface'
import { UserService } from '../services/user.service'

export class AssociationController {
  // Méthode pour récupérer toutes les associations
  static async getAssociation(
    req: Request,
    res: Response
  ): Promise<any | ResponseDTO<AssociationResponse>> {
    try {
      const result = await AssociationService.getAssociation()
      return res.status(200).json(toResponseDTO(result, 200, 'password'))
    } catch (error) {
      return res.status(500).json({
        error: error
      })
    }
  }

  // Méthode pour s'inscrire en tant qu'association
  static async signup(
    req: Request<{}, {}, associationRegisterInput>,
    res: Response
  ): Promise<any | ResponseDTO<SingleMessageDTO>> {
    try {
      const input = req.body

      // Vérifier si les mots de passe correspondent
      if (input.password !== input.passwordConfirmation) {
        return res.status(400).json({
          error: 400,
          message: 'Passwords do not match'
        })
      }

      // Crypter le mot de passe
      input.password = await encryptPassword(input.password)

      // Créer l'association
      const result = await AssociationService.createAssociation(input)
      // Définir le cookie JWT
      res.cookie('jwt', result, { httpOnly: true, maxAge: maxAge * 1000 })
      return res.status(200).json(
        toResponseDTO(
          {
            token: result,
            identity: 'isassociation',
            message: 'Association created successfully'
          },
          200
        )
      )
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured during signup'
      })
    }
  }

  // Méthode pour se connecter en tant qu'association
  static async login(
    req: Request<{}, {}, AssociationLoginInput>,
    res: Response
  ): Promise<any | ResponseDTO<SingleMessageDTO>> {
    try {
      const { email, password } = req.body

      // Vérifier les identifiants
      const result = await AssociationService.login(email, password)
      if (!result) {
        return res.status(401).json({
          error: 401,
          message: 'Incorrect email or password'
        })
      }

      // Définit le cookie JWT
      res.cookie('jwt', result, { httpOnly: true })
      res.status(200).json(
        toResponseDTO(
          {
            token: result,
            identity: 'isassociation',
            message: 'Association logged in!'
          },
          200
        )
      )
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured during login'
      })
    }
  }

  // Méthode pour supprimer une association par ID
  static async deleteAssociationById(
    req: Request,
    res: Response
  ): Promise<any | ResponseDTO<SingleMessageDTO>> {
    try {
      const associationId: number = parseInt(req.params.associationId)

      // Vérifie si l'ID de l'association est valide
      if (isNaN(associationId) || associationId == 0) {
        return res.status(400).json({
          error: 400,
          message: 'Invalid Association Id'
        })
      }

      // Récupérer l'association par ID
      const association =
        await AssociationService.getAssociationById(associationId)
      if (!association) {
        return res.status(404).json({
          error: 404,
          message: 'Association not found'
        })
      }

      const connectedUser = res.locals.user
      if (
        connectedUser.entity == 'isassociation' &&
        connectedUser.id !== associationId
      ) {
        return res.status(400).json({
          error: 404,
          message: 'You do not have the rights to execute this operation'
        })
      } else if (connectedUser.entity == 'isuser') {
        const user = await UserService.getUserById(connectedUser.id)
        if (!user || user.userRoleId !== 1) {
          return res.status(400).json({
            error: 404,
            message: 'You do not have the rights to execute this operation'
          })
        }
      }

      // Supprimer l'association
      await AssociationService.deleteAssociationById(associationId)
      return res
        .status(200)
        .json(
          toResponseDTO<SingleMessageDTO>('Association has been deleted!', 200)
        )
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured during deleteAssociationById'
      })
    }
  }

  // Méthode pour récupérer une association par ID
  static async getAssociationById(
    req: Request,
    res: Response
  ): Promise<any | ResponseDTO<AssociationResponse>> {
    try {
      const associationId: number = parseInt(req.params.associationId)

      // Vérifier si l'ID de l'association est valide
      if (isNaN(associationId) || associationId == 0) {
        return res.status(400).json({
          error: 400,
          message: 'Invalid Association Id'
        })
      }

      // Récupérer l'association par ID
      const result = await AssociationService.getAssociationById(associationId)
      if (!result) {
        return res.status(400).json({
          error: 400,
          message: 'Association not found'
        })
      }

      return res.status(200).json(toResponseDTO(result, 200, 'password'))
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: 'An error occured while fetching the association'
      })
    }
  }

  // New asso search
  static async filterSearchAsso(
    req: Request<{}, {}, IFilterSearchAssoRequest>,
    res: Response
  ): Promise<any | ResponseDTO<AssociationResponse[] | []>> {
    // Recupere les filtres / options
    const { sort, keyword } = req.body

    const searchWord = keyword ? keyword : ''

    try {
      const result = await AssociationService.filterAssociations(
        sort,
        searchWord
      )
      return res.status(200).json(toResponseDTO(result, 200, 'password'))
    } catch (err) {
      return res.status(500).json({
        error: err,
        message: 'An error occurred while searching associations'
      })
    }
  }

  // Helpers
  static remapToResponse(assos: dbAssociation[]): AssociationResponse[] {
    if (assos.length < 1) return []
    return assos.map(asso => {
      return {
        id: asso.id,
        rna: asso.rna,
        name: asso.name,
        email: asso.email,
        description: asso.description,
        regionId: asso.regionId,
        createdAt: asso.createdAt,
        updatedAt: asso.updatedAt
      }
    })
  }

  static async whoami(req: Request, res: Response) {
    const connectedUser = res.locals.user
    if (!connectedUser) {
      return res.status(401).json({
        error: 401,
        message: 'You are not connected'
      })
    }

    try {
      const asso = await AssociationService.getAssociationById(connectedUser.id)
      if (!asso) {
        return res.status(401).json({
          error: 401,
          message: 'Association not found'
        })
      }
      return res.status(200).json(toResponseDTO(asso, 200, 'password'))
    } catch (err) {
      return res.status(500).json({
        error: 500,
        message: err
      })
    }
  }

  static async update(
    req: Request<{}, {}, UpdateAssociationInput>,
    res: Response
  ) {
    const connectedUser = res.locals.user
    if (!connectedUser) {
      return res.status(401).json({
        error: 401,
        message: 'You are not connected'
      })
    }

    try {
      const { aid } = req.body
      if (connectedUser.id !== aid) {
        const user = await UserService.getUserById(connectedUser.id)
        if (!user || user.userRoleId !== 1) {
          return res.status(401).json({
            error: 401,
            message: 'You do not have the rights'
          })
        }
        const asso = await AssociationService.getAssociationById(aid)
        if (!asso) {
          return res.status(401).json({
            error: 401,
            message: 'Association not found'
          })
        }
      }

      const input = req.body
      const result = await AssociationService.updateAssociation(input)
      return res.status(200).json(toResponseDTO(result, 200, 'password'))
    } catch (err) {
      return res.status(500).json({
        error: 500,
        message: err
      })
    }
  }
}
