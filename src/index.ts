import { Server } from './server'
import dotenv from 'dotenv'
dotenv.config()

// Import routers
import { UserRouter } from './routes/user.route'

const app: Server = new Server([new UserRouter()])
app.listen()
