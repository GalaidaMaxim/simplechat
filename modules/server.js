const http = require("http");
const ws = require("ws");
const { randomUUID } = require("crypto");
function heartbeat() {
  this.isAlive = true;
}

const server = http.createServer();
const socket = new ws.Server({ server });
let clients = [];

socket.on("connection", (ws, req) => {
  console.log("ws connected");
  const url = new URL(req.url, "ws://some"); // нужно указать базу
  const name = url.searchParams.get("name");
  if (!name) {
    console.log("Connection without name");
    ws.close();
  }
  ws.name = name;
  ws.inRoom = false;
  ws.id = randomUUID();
  ws.send("Hello from ws");
  ws.on("pong", heartbeat);
  ws.messages = [];
  ws.on("message", (data) => {
    ws.messages.push(JSON.parse(data.toString()));
  });
  clients.push(ws);
});

setInterval(() => {
  socket.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      ws.terminate();
      console.log("Session terminated");
      return;
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 3000);

server.listen(3004, () => {
  console.log("Server started on 3004");
});

module.exports = {
  server,
  getClients: () => clients,
  setClients: (newClients) => {
    clients = newClients;
  },
  ws,
};
