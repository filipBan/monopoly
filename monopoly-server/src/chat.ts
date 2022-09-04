import { Server, Socket } from 'socket.io'
import { v4 } from 'uuid'

interface ConnectionProps {
  io: Server
  socket: Socket
}

interface User {
  id: string
  name: string
}

interface Message {
  id: string
  user: User
  value: string
  time: number
}

const messages = new Set<Message>()
const users = new Map()

const defaultUser: User = {
  id: 'anon',
  name: 'Anonymous',
}

const messageExpirationTimeMS = 10000

export class Connection implements ConnectionProps {
  socket: Socket
  io: Server

  constructor(io: Server, socket: Socket) {
    this.socket = socket
    this.io = io

    socket.on('getMessages', () => this.getMessages())
    socket.on('message', (value) => this.handleMessage(value))
    socket.on('disconnect', () => this.disconnect())
    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`)
    })
  }

  sendMessage(message: Message) {
    this.io.sockets.emit('message', message)
  }

  getMessages() {
    messages.forEach((message) => this.sendMessage(message))
  }

  handleMessage(value: string) {
    const message = {
      id: v4(),
      user: users.get(this.socket) || defaultUser,
      value,
      time: Date.now(),
    }

    messages.add(message)
    this.sendMessage(message)

    setTimeout(() => {
      messages.delete(message)
      this.io.sockets.emit('deleteMessage', message.id)
    }, messageExpirationTimeMS)
  }

  disconnect() {
    users.delete(this.socket)
  }
}

export function chat(io: Server) {
  io.on('connection', (socket) => {
    new Connection(io, socket)
  })
}
