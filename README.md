# ChatFlow ✨

A stunning, real-time chat application built with React, TypeScript, and Tailwind CSS. It features a modern, glassmorphism-inspired UI with fluid animations, allowing users to create or join temporary chat rooms effortlessly.



## 🚀 Features

-   **Real-Time Messaging:** Instant message delivery using WebSockets.
-   **Create & Join Rooms:** Users can instantly create a new private room or join an existing one with a 6-character code.
-   **Live User Count:** See how many users are currently in the chat room.
-   **Copy Room Code:** Easily copy the room code to your clipboard to invite others.
-   **Stunning Modern UI:** A beautiful dark-themed interface with glassmorphism effects and subtle animations.
-   **Responsive Design:** Looks great on all screen sizes.


## 🛠️ Tech Stack

-   **Frontend (`client/`):** React, TypeScript, Tailwind CSS, Lucide React
-   **Backend (`server/`):** Node.js, WebSocket (`ws`) library


## 🔧 Getting Started

This project is set up as a monorepo with a separate `client` and `server`. Follow these steps to get both parts running.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (version >=20 needed)
-   [Git](https://git-scm.com/)

### 1. Clone the Project

First, clone the project repository to your local machine.

```bash
git clone https://github.com/rajatsaini2003/chatApp.git
cd chatApp
```
---
### 2. Set Up and Run the Backend Server

The backend is responsible for handling WebSocket connections and chat rooms.

```bash
# Navigate to the server directory
cd server

# Install backend dependencies
npm install

# Start the server
node server.js
```
Leave this terminal running. You should see the message: `WebSocket server started on port 8080`.

---

### 3. Set Up and Run the Frontend Client

Open a **new terminal window** for this step. Do not close the server terminal.

```bash
# Navigate to the client directory from the root folder (chatApp/)
cd client

# Install frontend dependencies
npm install

# Start the React development server
npm run dev
```
Your browser should automatically open to the ChatFlow application, fully connected to your local backend.


## 📄 License

This project is licensed under the MIT License.