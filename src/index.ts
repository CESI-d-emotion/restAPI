import { AppDataSource } from './data-source'
import { Server } from './server'
import { User } from './entity/User'
import dotenv from 'dotenv'
dotenv.config()

// Import routers
import { UserRouter } from './routes/user.route'
import { AssociationRouter } from './routes/association.route'
import { Association } from './entity/association.entity'

const app: Server = new Server([new UserRouter(), new AssociationRouter()])

AppDataSource.initialize()
  .then(async () => {
    app.listen()
    console.log('Data Source has been initialized!')

    console.log('Inserting a new user into the database...')
    const user = new User()
    user.firstName = 'Timber'
    user.lastName = 'Saw'
    user.age = 25
    await AppDataSource.manager.save(user)
    console.log('Saved a new user with id: ' + user.id)

    const asso = new Association()
    asso.rna = 'super le rna'
    asso.name = 'Sauvez Nathan'
    asso.description = 'Direction Bali'
    asso.createdAt = new Date()
    asso.updatedAt = asso.createdAt
    await AppDataSource.manager.save(asso)

    console.log('Loading users from the database...')
    const users = await AppDataSource.manager.find(User)
    console.log('Loaded users: ', users)

    console.log(
      'Here you can setup and run express / fastify / any other framework.'
    )
  })
  .catch(error => console.log(error))
