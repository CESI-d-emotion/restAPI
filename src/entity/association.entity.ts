import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'associations' })
export class Association {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ nullable: false })
  rna: string

  @Column({ nullable: false })
  name: string

  @Column({ nullable: false })
  description: string

  @Column({ nullable: false })
  createdAt: Date

  @Column({ nullable: false })
  updatedAt: Date
}

export interface CreateAssociationInput {
  rna: string
  name: string
  description: string
}
