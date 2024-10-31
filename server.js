const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 5005;

const server = http.createServer(app)
const io = new Server(server, {cors: { origin: process.env.ORIGIN || "http://localhost:5173"}})

io.on('connection', (socket)=>{
  console.log("Usuario conectado")

  socket.on("mensaje", (mensaje)=>{
    // console.log(mensaje)
    socket.broadcast.emit('mensaje', mensaje)
  })
})

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});