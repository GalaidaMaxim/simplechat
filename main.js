const { getClients, setClients, ws } = require("./modules/server");
const { Room } = require("./modules/room");

let rooms = [];

const connectionProcessor = () => {
  const clients = getClients();
  setClients(clients.filter((item) => item.readyState !== ws.CLOSED));
  rooms.forEach((item) => {
    item.checkConnections();
  });
  rooms = rooms.filter((item) => item.isActive);
};

const roomCreationProcessor = () => {
  const clients = getClients();
  if (clients.length < 2) {
    return;
  }
  const a = clients[0];
  const b = clients[1];

  rooms.push(new Room(a, b));
  setClients(
    clients.filter((item) => item.name !== a.name && item.name !== b.name)
  );
  console.log(`Room created room for ${a.name}, ${b.name}`);
};

const messageListenerProcessor = () => {
  rooms.forEach((room) => {
    room.messageProcessor();
  });
};

//створення кімнат
setInterval(() => {
  connectionProcessor();
  roomCreationProcessor();
  messageListenerProcessor();
}, 500);
