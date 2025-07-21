import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Users, Copy, Send, Zap, Globe, ArrowLeft } from 'lucide-react'
import './App.css'
function App() {
  const socketRef = useRef<WebSocket | null>(null);
  const [roomCode, setRoomCode] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [roomMode, setRoomMode] = useState<'create' | 'join' | null>(null);
  const [inputRoomCode, setInputRoomCode] = useState<string>('');
  const [usersCount, setUsersCount] = useState<number>(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createRoom = () => {
    const newRoomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    setRoomCode(newRoomCode);
    connectToRoom(newRoomCode);
  };

  const joinRoom = () => {
    if (inputRoomCode.trim() === '') {
      alert("Please enter a room code");
      return;
    }
    setRoomCode(inputRoomCode.toUpperCase());
    connectToRoom(inputRoomCode.toUpperCase());
  };

  const connectToRoom = (code: string) => {
    try {
      socketRef.current = new WebSocket('ws://localhost:8080');

      socketRef.current.onopen = () => {
        console.log('Connected to WebSocket server');
        socketRef.current?.send(JSON.stringify({
          type: 'join',
          payload: { roomId: code }
        }));
        setIsConnected(true);
        setMessages([`Welcome to room ${code} 👋`]);
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          setMessages(prevMessages => [...prevMessages, data.message]);
        }
        else if (data.type === 'userCount') {
          setUsersCount(data.count);
        }
      };

      socketRef.current.onclose = () => {
        console.log('Disconnected from WebSocket server');
        setIsConnected(false);
      };

      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        alert('Failed to connect to the room');
      };
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect to the room');
    }
  };

  const leaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    setIsConnected(false);
    setRoomCode('');
    setRoomMode(null);
    setInputRoomCode('');
    setMessages([]);
    setMessageInput('');
  };

  const handleSubmit = () => {
    if (messageInput.trim() === '') {
      alert("Message cannot be empty");
      return;
    }
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      alert("Connect To A Room to send messages");
      return;
    }
    socketRef.current.send(JSON.stringify({
      type: "message",
      payload: {
        message: messageInput
      }
    }));
    setMessageInput('');
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    alert('Room code copied to clipboard!');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl animate-bounce delay-500"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-2xl mb-4">
                  <MessageCircle className="w-8 h-8 text-blue-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                  ChatFlow
                </h1>
                <p className="text-slate-400">Connect instantly, chat effortlessly</p>
              </div>

              {roomMode === null && (
                <div className="space-y-4 animate-fade-in">
                  <button
                    onClick={() => setRoomMode('create')}
                    className="group w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      <span>Create New Room</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setRoomMode('join')}
                    className="group w-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 hover:border-emerald-500/50 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      <span>Join Existing Room</span>
                    </div>
                  </button>
                </div>
              )}

              {roomMode === 'create' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Create New Room</h2>
                    <p className="text-slate-400 mb-6">Start a new conversation instantly</p>
                    <button
                      onClick={createRoom}
                      className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <Zap className="w-5 h-5" />
                        <span>Create Room</span>
                      </div>
                    </button>
                  </div>
                  <button
                    onClick={() => setRoomMode(null)}
                    className="w-full bg-slate-700/50 hover:bg-slate-700/70 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                </div>
              )}

              {roomMode === 'join' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Join Room</h2>
                    <p className="text-slate-400 mb-6">Enter the room code to connect</p>
                    <div className="relative mb-6">
                      <input
                        type="text"
                        value={inputRoomCode}
                        onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                        placeholder="ENTER CODE"
                        className="w-full bg-white/5 border border-white/20 focus:border-emerald-500/50 text-white text-center text-lg font-mono rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 placeholder-slate-500 transition-all duration-200"
                        maxLength={6}
                      />
                    </div>
                    <button
                      onClick={joinRoom}
                      className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 hover:border-emerald-500/50 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <Globe className="w-5 h-5" />
                        <span>Join Room</span>
                      </div>
                    </button>
                  </div>
                  <button
                    onClick={() => setRoomMode(null)}
                    className="w-full bg-slate-700/50 hover:bg-slate-700/70 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat interface when connected
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl h-[90vh] flex flex-col">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl flex-1 flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="border-b border-white/10 p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">ChatFlow</h1>
                  <p className="text-slate-400">Connected & Ready</p>
                </div>
                <button
                  onClick={leaveRoom}
                  className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 text-red-300 font-medium py-2 px-4 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  Leave Room
                </button>
              </div>
              
              {/* Room Info */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-300 font-medium">Room:</span>
                      <code className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg font-mono text-sm">
                        {roomCode}
                      </code>
                      <button
                        onClick={copyRoomCode}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{usersCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm border border-white/10 text-white p-4 rounded-2xl shadow-lg max-w-[85%] animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {message}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-white/10 p-6">
              <div className="flex space-x-3">
                <input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-white/5 border border-white/20 focus:border-blue-500/50 text-white rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/25 placeholder-slate-500 transition-all duration-200"
                  placeholder="Type your message..."
                />
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 text-blue-300 p-3 rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App