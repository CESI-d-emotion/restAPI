import { Repository } from 'typeorm'
import {
  Association,
  CreateAssociationInput
} from '../entity/association.entity'
import { AppDataSource } from '../data-source'
import { log } from '../helpers/logger.helper'
import * as cache from 'memory-cache'

export class AssociationService {
  static associationRepo: Repository<Association> =
    AppDataSource.getRepository(Association)

  static async createAssociation(
    assoInput: CreateAssociationInput
  ): Promise<number> {
    log.debug('CreateAssociation called')
    const asso = new Association()
    asso.rna = assoInput.rna
    asso.name = assoInput.name
    asso.description = assoInput.description
    asso.createdAt = new Date()
    asso.updatedAt = asso.createdAt
    const result = await AppDataSource.manager.save(asso)
    return result.id
  }

  static async getAssociations() {
    const data = cache.get('data')
    if (data) {
      log.info('Serving from cache')
      return data
    } else {
      log.info('Serving from db')
      const assos = await this.associationRepo.find()

      cache.put('data', assos)
      return assos
    }
  }
}
