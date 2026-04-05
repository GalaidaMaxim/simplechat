const { getClients } = require("./server");
const { Room, rooms } = require("./room");

module.exports = (message, from) => {
  switch (message.command) {
    case "createRoomWith":
      let client = getClients().find((item) => item.name === message.username);
      client.send(
        JSON.stringify({
          command: "requestConnectionWith",
          user: message.from,
        })
      );
      break;
    case "createRoomAccept":
      let clientA = getClients().find((item) => item.name === message.username);
      let clientB = getClients().find(
        (item) => item.name === message.usernameB
      );
      let response = JSON.stringify({
        command: "roomCreated",
      });
      clientA.send(response);
      clientB.send(response);
      rooms.push(new Room(clientA, clientB));
      break;
    case "createRoomReject":
      clientA = getClients().find((item) => item.name === message.username);
      clientB = getClients().find((item) => item.name === message.usernameB);
      response = JSON.stringify({
        command: "roomCreationRejected",
      });
      clientA.send(response);
      clientB.send(response);
      break;
  }
};
