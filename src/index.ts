import { Server } from './server'
import dotenv from 'dotenv'
dotenv.config()

// Import routers
import { UserRouter } from './routes/user.route'
import { HealthCheckRouter } from './routes/healthcheck.route'

const app: Server = new Server([new UserRouter(), new HealthCheckRouter()])
app.listen()
