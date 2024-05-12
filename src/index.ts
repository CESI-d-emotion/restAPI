import { Server } from './server'
import dotenv from 'dotenv'
dotenv.config()

// Import routers
import { UserRouter } from './routes/user.route'
import { HealthCheckRouter } from './routes/healthcheck.route'
import { AssociationRouter } from './routes/association.route'
import { RessourceRouter } from './routes/ressource.route'
import { UtilsRouter } from './routes/utils.router'
import { CommentRouter } from './routes/comment.route'

// const app: Server = new Server([new UserRouter(), new HealthCheckRouter()])
const app: Server = new Server([
  new UserRouter(),
  new HealthCheckRouter(),
  new AssociationRouter(),
  new RessourceRouter(),
  new UtilsRouter(),
  new CommentRouter()
])
app.listen()
