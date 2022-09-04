import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { Server } from 'socket.io'
import http from 'http'

dotenv.config()

const app: Express = express()

app.use(cors())

const port = process.env.PORT ?? '8080'

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

io.on('connection', (socket) => {
  console.log('A user connected')

  socket.on('createRoom', (value) => {
    console.log('Going to create a room: ', value)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

server.listen(port, () => {
  console.log('Hi')
  console.log(`⚡️[server]: Server is running at https://localhost:8080`)
})
