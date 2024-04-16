import { db } from '../helpers/db.helper'
import { Region } from '../entities/region.entity'
import { UserRole } from '../entities/role.entity'

export class IgniteService {
  private static pool = db
  private static regions: Region[] = [
    new Region("Auvergne-Rhône-Alpes", "FR-ARA"),
    new Region("Bourgogne-Franche-Comté", "FR-BFC"),
    new Region("Bretagne", "FR-BRE"),
    new Region("Centre-Val de Loire", "FR-CVL"),
    new Region("Corse", "FR-COR"),
    new Region("Grand Est", "FR-GES"),
    new Region("Hauts-de-France", "FR-HDF"),
    new Region("Île-de-France", "FR-IDF"),
    new Region("Normandie", "FR-NOR"),
    new Region("Nouvelle-Aquitaine", "FR-NAQ"),
    new Region("Occitanie", "FR-OCC"),
    new Region("Pays de la Loire", "FR-PDL"),
    new Region("Provence-Alpes-Côte d'Azur", "FR-PAC"),
    new Region("Guadeloupe", "FR-GUA"),
    new Region("Guyane", "FR-GUF"),
    new Region("Martinique", "FR-MTQ"),
    new Region("La Réunion", "FR-LRE"),
    new Region("Mayotte", "FR-MAY")
  ]
  private static roles: UserRole[] = [
    new UserRole("admin"),
    new UserRole("regadmin"),
    new UserRole("assomember"),
    new UserRole("user"),
  ]

  static async ignite() {
    // remplir la table region
    const regionRepo = this.pool.region
    for (const region of this.regions) {
      await regionRepo.create({
        data: {
          ...region
        }
      })
    }

    // remplir la table userroles
    const roleRepo = this.pool.userRole
    for (const role of this.roles) {
      await roleRepo.create({
        data: {
          ...role
        }
      })
    }
  }
}