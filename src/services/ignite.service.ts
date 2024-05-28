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
      "Les fadas de l'OM",
      'fada@mail.com',
      'motdepasseasso',
      1,
      "On est là pour s'amuser s'éclater. Le groupe a été créer pour parler de l'om dans le respect et la bonhumeur. Je ne veut refaire deux fois la même erreur. J'ai perdu mon premier groupe. Celui là je vais m'accrocher pour le garder bienvenue à tous les membres. Publié quand vous voulez et quand vous pouvez surtout. Merci à tous ceux qui viendront dans mon groupe et passez de très bons moments forza l'om à la vie à la mort. J'oubliais aucune insulte est toléré celui qui insulte sera viré du groupe.\n" +
        "Inviter vos amis marseillais. Amusez vous un groupe c'est fait pour ça."
    ),
    new Association(
      '340598',
      'Les restos du coeur',
      'rdc@mail.com',
      'motdepasseasso',
      4,
      'En 2022-2023, ce sont 171 millions de repas qui ont été servis, contre 142 millions l’année précédente, du jamais vu ! 1,3 million de personnes ont également été accueillies, soit 200 000 personnes supplémentaires en un an.\n' +
        'L’aide alimentaire permet d’apporter une aide d’urgence mais représente surtout le point de contact privilégié pour favoriser l’inclusion sociale des plus démunis et les accompagner vers la réinsertion.'
    ),
    new Association(
      '238474',
      'Marion la main tendue',
      'vans@mail.com',
      'motdepasseasso',
      3,
      'Notre objectif : La prévention et la lutte contre les violences et le harcèlement en milieu scolaire ainsi que les cyber violences.\n' +
        'Notre mission : Chaque enfant a le droit à une scolarité libre de toute violence. Aider les enfants et adolescents à grandir en toute sécurité tel doit être l’objectif de chaque adulte, parent, enseignant, éducateur.'
    ),
    new Association(
      '238383',
      'Un ballon pour tous',
      'foot@mail.com',
      'motdepasseasso',
      5,
      'C’est à partir de cette idée que l’association Un ballon pour tous, régie par la loi de 1901 voit le jour en 2010.\n' +
        'Parce que nous sommes convaincus des bienfaits que cela représente pour les enfants que nous encadrons, mais aussi, conscients de l’importance de soutenir et de soulager des familles, nous continuons de développer nos actions jour après jour.'
    ),
    new Association(
      '540389',
      "40 millions d'automobilistes",
      'cesi@mail.com',
      'motdepasseasso',
      1,
      '"40 millions d\'automobilistes" est la 1ère association nationale de défense des automobilistes reconnue d\'intérêt général.\n' +
        'Indépendante de tout pouvoir politique ou économique et porte-parole des automobilistes raisonnables et responsables, l\'association protège vos intérêts en intervenant dans l\'ensemble des débats qui touchent à votre vie d\'automobiliste.'
    )
  ]
  private static ressources: Ressource[] = [
    new Ressource(
      'Auba sur le départ',
      'Selon La Provence : "Sil’OM ne parvient pas à se qualifier pour une coupe d’Europe, son départ ne fait aucun doute étant donné ses émoluments XXL. Même en cas de C3 ou C4 rien n’est acquis."\n' +
        'Le journal évoque même un possible départ vers l’Arabie Saoudite qui avait tenté de le recruter l’été dernier déjà. "Il se murmure en effet que PEA aurait déjà choisi sa future destination, dans un championnat qui lui fait les yeux doux depuis l’été dernier…"',
      1,
      3
    ),
    new Ressource(
      'La distribution accompagnée',
      "La principale activité en matière d’aide alimentaire est la distribution de paniers-repas équilibrés à cuisiner chez soi. L’aide alimentaire n’est pas seulement une réponse au problème de nutrition mais une occasion d’échanger, de créer du lien social dans un cadre convivial.\n" +
        'Des produits d’hygiène (savon, dentifrice…) et des produits alimentaires de base s’y ajoutent : le lait, le beurre, l’huile, le sucre, les céréales, la farine, etc…\n' +
        'Les centres de distribution offrent depuis toujours un libre choix des denrées que les personnes peuvent emporter. Ainsi, elles repartent des centres avec des produits qu’elles ont elles-mêmes choisies dans les différentes catégories d’aliments: protéines, féculents, légumes, laitages, etc…',
      2,
      3
    ),
    new Ressource(
      'Atelier de coiffure et atelier esthétique',
      "Ces ateliers s’appuient sur des coiffeurs ou esthéticiennes professionnels bénévoles. Le matériel est fourni par le bénévole, parfois complété par des dons. Cette année, 95 associations départementales ont proposé ces actions auprès de 9 850 personnes. Pour la personne accueillie, il suffit de prendre rendez-vous dans un centre et de se présenter avec les cheveux préalablement lavés pour une coupe et un brushing. Pour l’esthétique, la personne accueillie se voit proposer soin du visage, manucure, ou séance de maquillage, parfois même du conseil en image.",
      2,
      3
    ),
    new Ressource(
      'Atelier de sensibilisation',
      "L’atelier de sensibilisation a pour objectif de responsabiliser les jeunes enfants, élèves dès le plus jeune âge.\n" +
        "Développer la verbalisation des émotions, et ainsi les amener à développer leurs compétences psychosociales et relationnelles. Comprendre leur rapport à autrui et favoriser la prise de parole et l’entraide lorsqu’ils observent ou sont témoins de rapport de domination d’un jeune individu sur un autre.\n" +
        "Le matériel pédagogique utilisé au cours de l’atelier est adapté à l’âge et la compréhension du public. Il vise à être interactif dans le but de favoriser l’attention et la participation des enfants à travers des jeux de rôle, des écrits dédiés et développés par notre association. Un focus sur le Cyberharcèlement est réalisé pendant l’atelier.",
      3,
      3
    ),
    new Ressource(
      'Formation des élèves ambassadeurs',
      "La formation a pour objectif de former les jeunes et de faire d’eux des éléments moteurs de la lutte contre le harcèlement et les cyberviolences.\n" +
        "Les élèves ambassadeurs ont pour mission de sensibiliser leurs camarades au harcèlement, repérer les signes et agir à travers des actions de préventions dans l’établissement et sur les réseaux sociaux, notamment selon les âges.",
      3,
      3
    ),
    new Ressource(
      'Le projet sportif',
      "L’équipe d’un ballon pour tous, ne conçoit pas un projet de vie sans la pratique d’une activité sportive.\n" +
        "Même si la pratique du sport se retrouve en milieu scolaire, un club de sport et les valeurs qu’il véhicule est un bienfait pour la santé physique et mental de l’enfant.",
      4,
      3
    ),
    new Ressource(
      'Nouvelle bataille gagnée',
      "Alors que la loi ZFE-m prévoyait initialement de bannir les véhicules Cri’Air 3, 4, 5 et non classés d’une quarantaine de métropoles à partir du 1er janvier 2025, les Zones à Faibles Émissions continuent de perdre du terrain. Paris et Lyon restent les seules agglomérations touchées d’une obligation d’interdire les véhicules Crit’Air 3 à la circulation à cette échéance. Un nouveau recul du Gouvernement sur le dossier, qui marque une volonté de désamorcer la bombe sociale à retardement, sans pour autant perdre la face.",
      5,
      3
    ),
    new Ressource(
      'Stop à la fronde contre les SUV',
      'Tour à tour, des villes comme Lyon, Paris, Bordeaux ou encore Grenoble prévoient de mener prochainement des politiques particulièrement restrictives envers les propriétaires des SUV, alors qu\'il s\'agit du type de véhicule le plus plébiscité par les Français. Une façon détournée d\'éradiquer la voiture en ville pour un maximum de citoyens, contre laquelle l\'association "40 millions d\'automobilistes" appelle à se mobiliser sur une pétition dédiée.',
      5,
      3
    ),
    new Ressource(
      'Les chiffres qui comptent',
      "L’OM a gagné ses 4 dernières confrontations contre le Stade de Reims.\n" +
        "L’OM a remporté 5 de ses 8 matches à l’extérieur contre Reims en Ligue 1 au 21e siècle pour un nul et deux défaites.\n" +
        "Reims n’a remporté aucun de ses 6 derniers matches de Ligue 1 : 3 nuls et 3 défaites.\n" +
        "Reims n’a gagné qu’une seule de ses 7 réceptions en Ligue 1 en 2024 : 3 nuls, 3 défaites.\n" +
        "Pierre-Emerick Aubameyang a inscrit 7 des 12 derniers buts de l’OM en Ligue 1.",
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
