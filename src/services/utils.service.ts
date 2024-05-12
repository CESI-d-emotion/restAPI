import { db } from '../helpers/db.helper'

export class UtilsService {
  private static rolesRepo = db.userRole
  private static regionsRepo = db.region
  private static typePostRepo = db.typePost

  static async getRoles() {
    return this.rolesRepo.findMany()
  }

  static async getTypesPost() {
    return this.typePostRepo.findMany()
  }

  static async getRegions() {
    return this.regionsRepo.findMany()
  }
}