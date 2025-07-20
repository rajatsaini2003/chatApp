import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const code:number=0;
  const usersCount:number=0;
  const [messages, setMessages] = useState<string[]>([])
  useEffect(()=>{
    const socket = new WebSocket('ws://localhost:8080');
    socket.onmessage = (event) => {
      setMessages(prevMessages => [...prevMessages, event.data]); 
    }
  })
  return (
    <div className='h-screen w-screen flex items-center justify-center bg-black '>
         <div className='w-[40%] h-[90%] border-white/30 rounded-md border-1 py-8 px-5' >
         <div className='h-[20%]'>
            <h1 className='text-xl text-white font-bold'>Real Time Chat App</h1>
            <p className='text-white/70 font-extralight'>temporary room that allows users to chat in real-time.</p>
            <div className='py-1 px-4 text-sm  flex justify-between my-2 bg-gray-700/50 rounded-md border-white/20 border-1 text-white/50 font-semibold'>
              <p>Room Code: {code}</p>
              <p>Users : {usersCount}</p>
            </div>
         </div>
         <div className='border-white/30 border-1 h-[70%] rounded-md'></div>
         <div className=' mt-4 w-full gap-2 flex items-center justify-between text-white'>
          <input 
          className='w-full border-1 border-white/30 bg-transparent text-white rounded-md px-3 py-2 focus:outline-none focus:border-blue-500'
          placeholder='Type a message...'>
          </input>
          <button className='bg-white w-[15%] text-black  rounded-md px-3 py-2 focus:outline-none focus:border-blue-500'>Send</button> 
         </div>
         </div>
    </div>
  )
}

export default App
