const { getClients } = require("./server");
const { Room, rooms } = require("./room");

module.exports = (message, from) => {
  if (message.command === "createRoomWith") {
    const client = getClients().find((item) => item.name === message.username);
    client.send(
      JSON.stringify({
        command: "requestConnectionWith",
        user: message.from,
      })
    );
  } else if (message.command === "createRoomAccept") {
    const clientA = getClients().find((item) => item.name === message.username);
    const clientB = getClients().find(
      (item) => item.name === message.usernameB
    );
    let response = JSON.stringify({
      command: "roomCreated",
    });
    clientA.send(response);
    clientB.send(response);
    rooms.push(new Room(clientA, clientB));
  } else if (message.command === "createRoomReject") {
    const clientA = getClients().find((item) => item.name === message.username);
    const clientB = getClients().find((item) => item.name === message.from);
    response = JSON.stringify({
      command: "roomCreationRejected",
    });
    clientA.send(response);
    clientB.send(response);
  }
};
