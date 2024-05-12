import { db } from '../helpers/db.helper'
import { Region } from '../entities/region.entity'
import { UserRole } from '../entities/role.entity'
import { Ressource, TypePost } from '../entities/ressource.entity'
import { User } from '../entities/user.entity'
import { Association } from '../entities/association.entity'
import { encryptPassword } from '../helpers/password.helper'

export class IgniteService {
  private static pool = db
  private static regions: Region[] = [
    new Region('Auvergne-Rhône-Alpes', 'FR-ARA'),
    new Region('Bourgogne-Franche-Comté', 'FR-BFC'),
    new Region('Bretagne', 'FR-BRE'),
    new Region('Centre-Val de Loire', 'FR-CVL'),
    new Region('Corse', 'FR-COR'),
    new Region('Grand Est', 'FR-GES'),
    new Region('Hauts-de-France', 'FR-HDF'),
    new Region('Île-de-France', 'FR-IDF'),
    new Region('Normandie', 'FR-NOR'),
    new Region('Nouvelle-Aquitaine', 'FR-NAQ'),
    new Region('Occitanie', 'FR-OCC'),
    new Region('Pays de la Loire', 'FR-PDL'),
    new Region("Provence-Alpes-Côte d'Azur", 'FR-PAC'),
    new Region('Guadeloupe', 'FR-GUA'),
    new Region('Guyane', 'FR-GUF'),
    new Region('Martinique', 'FR-MTQ'),
    new Region('La Réunion', 'FR-LRE'),
    new Region('Mayotte', 'FR-MAY')
  ]
  private static roles: UserRole[] = [
    new UserRole('admin'),
    new UserRole('regadmin'),
    new UserRole('assomember'),
    new UserRole('user')
  ]
  private static typePost: TypePost[] = [
    new TypePost('événement'),
    new TypePost('communication'),
    new TypePost('ressource')
  ]
  private static users: User[] = [
    new User(
      'Antoine',
      'Le Bras',
      'antoine.test@mail.com',
      'ouisuperlemotdepasse',
      1,
      1
    ),
    new User(
      'Nathan',
      'Morard',
      'nathan.test@mail.com',
      'ouisuperlemotdepasse',
      4,
      2
    ),
    new User(
      'Clem',
      'Yupyup',
      'clem.test@mail.com',
      'ouisuperlemotdepasse',
      3,
      2
    ),
    new User(
      'Rhiz',
      'Vioooooon',
      'rhiz.test@mail.com',
      'ouisuperlemotdepasse',
      5,
      2
    ),
    new User(
      'Ethan',
      'Dans nos veines',
      'ethan.test@mail.com',
      'ouisuperlemotdepasse',
      6,
      1
    )
  ]
  private static associations: Association[] = [
    new Association(
      '123098',
      "Fada de l'OM",
      'fada@mail.com',
      'motdepasseasso',
      1,
      "On est fans de l'équipe de foot."
    ),
    new Association(
      '340598',
      'Resto du coeur',
      'rdc@mail.com',
      'motdepasseasso',
      4,
      'Tout le monde a le droit de manger correctement.'
    ),
    new Association(
      '238474',
      'Des lacets pour des chaussures',
      'vans@mail.com',
      'motdepasseasso',
      3
    ),
    new Association(
      '238383',
      'Ballon pour tous',
      'foot@mail.com',
      'motdepasseasso',
      5
    ),
    new Association(
      '540389',
      'CESI association',
      'cesi@mail.com',
      'motdepasseasso',
      1
    )
  ]
  private static ressources: Ressource[] = [
    new Ressource(
      'Bienvenue chez nous',
      "Ceci est notre premier post sur l'application",
      1,
      3
    ),
    new Ressource(
      'Bienvenue chez nous',
      "Ceci est notre premier post sur l'application",
      2,
      3
    ),
    new Ressource(
      'Bienvenue chez nous',
      "Ceci est notre premier post sur l'application",
      1,
      3
    ),
    new Ressource(
      'Bienvenue chez nous',
      "Ceci est notre premier post sur l'application",
      3,
      3
    ),
    new Ressource(
      'Bienvenue chez nous',
      "Ceci est notre premier post sur l'application",
      1,
      3
    ),
    new Ressource(
      'Bienvenue chez nous',
      "Ceci est notre premier post sur l'application",
      5,
      3
    ),
    new Ressource(
      'Bienvenue chez nous',
      "Ceci est notre premier post sur l'application",
      4,
      3
    ),
    new Ressource(
      'Bienvenue chez nous',
      "Ceci est notre premier post sur l'application",
      1,
      3
    ),
    new Ressource(
      'Bienvenue chez nous',
      "Ceci est notre premier post sur l'application",
      1,
      3
    )
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

    // remplir la table typePost
    const typePostRepo = this.pool.typePost
    for (const tpost of this.typePost) {
      await typePostRepo.create({
        data: {
          ...tpost
        }
      })
    }

    // remplir la table user
    const userRepo = this.pool.users
    for (const user of this.users) {
      // SALT PASSWORD
      user.password = await encryptPassword(user.password)
      await userRepo.create({
        data: {
          ...user
        }
      })
    }

    // remplir la table asso
    const assoRepo = this.pool.associations
    for (const association of this.associations) {
      await assoRepo.create({
        data: {
          ...association
        }
      })
    }

    // Remplir la table ressources
    const ressourceRepo = this.pool.post
    for (const ressource of this.ressources) {
      await ressourceRepo.create({
        data: {
          ...ressource
        }
      })
    }
  }
}
