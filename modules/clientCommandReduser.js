const { getClients } = require("./server");

module.exports = (message, from) => {
  switch (message.command) {
    case "createRoomWith":
      const client = getClients().find(
        (item) => item.name === message.username,
      );
      client.send(
        JSON.stringify({
          command: "requestConnectionWith",
          user: from.name,
        }),
      );
      break;
  }
};
