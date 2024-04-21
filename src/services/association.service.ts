import * as cache from 'memory-cache'
import { log } from '../helpers/logger.helper'
import { db } from '../helpers/db.helper'
import { Association, dbAssociation } from '../entities/association.entity'
import { decryptPassword } from '../helpers/password.helper'

export class AssociationService {
  private static associationRepo = db.associations

  /**
   * Récupère les associations de la mémoire cache ou de la base de données
   * @returns Une liste d'associations
   */
  static async getAssociation() {
    const data = cache.get('data')
    if (data) {
      log.info('Serving from cache')
      return data
    } else {
      log.info('Serving from db')
      const association = await this.associationRepo.findMany()
      cache.put('data', association, 6000)
      return association
    }
  }

  /**
   * Crée une nouvelle association dans la base de données
   * @param association les informations de l'association à créer
   * @returns un token JWT
   */
  static async createAssociation(association: Association) {
    const result = await this.associationRepo.create({
      data: {
        rna: association.rna,
        name: association.name,
        email: association.email,
        description: association.description,
        password: association.password,
        createdAt: new Date(),
        updatedAt: new Date(),
        region: { connect: { id: association.regionId } }
      }
    })
    // TODO : return createToken(result.id, result.email)
  }

  /**
   * Authentifie une association en vérifiant l'email et le mot de passe
   * @param email l'email de l'association
   * @param password le mot de passe de l'association
   * @returns un token JWT ou null si l'authentification échoue
   */
  static async login(email: string, password: string) {
    const association = await this.associationRepo.findFirst({
      where: { email }
    })

    if (!association) {
      return null
    }

    const matchPass = await decryptPassword(password, association.password)
    if (!matchPass) {
      return null
    }
    // TODO : return createToken(association.id, association.email)
  }

  /**
   * Supprime une association de la base de données
   * @param associationId l'ID de l'association à supprimer
   */
  static async deleteAssociationById(associationId: number): Promise<void> {
    await this.associationRepo.delete({
      where: { id: associationId }
    })
  }

  /**
   * Récupère une association par son ID
   * @param associationId l'ID de l'association à récupérer
   * @returns l'association correspondante ou null si non trouvée
   */
  static async getAssociationById(associationId: number): Promise<any> {
    return this.associationRepo.findUnique({
      where: { id: associationId }
    })
  }

  /**
   * Recherche des associations par non ou description
   * @param keyword le mot-clé de recherche
   * @returns une liste d'associations correspondant au mot-clé
   */
  static async searchAssociations(keyword: string) {
    // Recherche les associations dont le nom ou la description correspond au mot-clé
    return this.associationRepo.findMany({
      where: {
        name: {
          contains: keyword
        },
        description: {
          contains: keyword
        }
      }
    })
  }

  /**
   * Trier les associations par la date de création en ordre croissant
   * @returns une liste d'associations triées
   */
  static async triAssociationsByDateAsc() {
    // Récupérer les associations triées par la date de création en ordre ascendant
    const associations = await this.associationRepo.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    })
    return associations
  }

  /**
   * Trier les associations par la date de création en ordre décroissant
   * @returns une liste d'associations triées
   */
  static async triAssociationsByDateDesc() {
    // Récupérer les associations triées par la date de création en ordre décroissant
    const associations = await this.associationRepo.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return associations
  }
}
