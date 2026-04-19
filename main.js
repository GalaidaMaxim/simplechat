const { getClients, setClients, ws } = require("./modules/server");
const { Room, rooms } = require("./modules/room");
const clientCommandReducer = require("./modules/clientCommandReduser");

let lastlistSize = 0;

const connectionProcessor = () => {
  const clients = getClients();
  setClients(clients.filter((item) => item.readyState !== ws.CLOSED));
  rooms.forEach((item) => {
    item.checkConnections();
  });
  while (rooms.some((item) => !item.isActive)) {
    const index = rooms.findIndex((item) => !item.isActive);
    rooms.splice(index, 1);
  }
};

const onClinetsChange = () => {
  if (lastlistSize === getClients().length) {
    return;
  }
  const clients = getClients();
  clients.forEach((client, index, arr) => {
    const users = arr
      .map((item) => item.name)
      .filter((item) => item !== client.name);
    client.send(
      JSON.stringify({
        command: "userList",
        users,
      })
    );
  });
  lastlistSize = getClients().length;
};

const clientsCommandsProcessor = () => {
  const clients = getClients();
  clients.forEach((client) => {
    if (client.messages.length === 0) {
      return;
    }
    const message = client.messages.shift();
    message.from = client.name;
    clientCommandReducer(message);
  });
};

const messageListenerProcessor = () => {
  rooms.forEach((room) => {
    room.messageProcessor();
  });
};

//створення кімнат
setInterval(() => {
  try {
    connectionProcessor();
    messageListenerProcessor();
    clientsCommandsProcessor();
    onClinetsChange();
  } catch (err) {
    console.log(err);
  }
}, 500);
