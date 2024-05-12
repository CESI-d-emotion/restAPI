import { Server } from './server'
import dotenv from 'dotenv'
dotenv.config()

// Import routers
import { UserRouter } from './routes/user.route'
import { HealthCheckRouter } from './routes/healthcheck.route'
import { AssociationRouter } from './routes/association.route'
import { RessourceRouter } from './routes/ressource.route'

// const app: Server = new Server([new UserRouter(), new HealthCheckRouter()])
const app: Server = new Server([
  new UserRouter(),
  new HealthCheckRouter(),
  new AssociationRouter(),
  new RessourceRouter()
])
app.listen()
