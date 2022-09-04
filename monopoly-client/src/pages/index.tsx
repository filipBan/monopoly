import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'

const Home: NextPage = () => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const newSocket = io('http://127.0.0.1:8080')

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  return (
    <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
      <div className="App">
        <header className="app-header">React Chat</header>
        {socket ? <h1>Connected</h1> : <h1>Not Connected</h1>}
      </div>
    </main>
  )
}

export default Home
