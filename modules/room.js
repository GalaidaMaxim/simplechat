const { ws } = require("./server");
let rooms = [];

const setRooms = (roomsNew) => {
  rooms = roomsNew;
};

class Room {
  constructor(clientA, clientB) {
    this.clientA = clientA;
    this.clientB = clientB;
    this.messages = [];
    this._active = true;
  }
  checkConnections = () => {
    if (
      this.clientA.readyState === ws.CLOSED ||
      this.clientB.readyState === ws.CLOSED
    ) {
      this.clientA.terminate();
      this.clientB.terminate();
      console.log(
        `Room for ${this.clientA.name} and  ${this.clientB.name} deleted`
      );

      this._active = false;
    }
  };
  messageReduser = (message, a, b) => {
    if (message.command === "message") {
      b.send(JSON.stringify({ command: "message", message: message.message }));
    }
  };
  messageProcessor = () => {
    if (this.clientA.messages.length !== 0) {
      const message = this.clientA.messages.shift();
      this.messageReduser(message, this.clientA, this.clientB);
    }
    if (this.clientB.messages.length !== 0) {
      const message = this.clientB.messages.shift();
      this.messageReduser(message, this.clientB, this.clientA);
    }
  };
  get isActive() {
    return this._active;
  }
}

module.exports = { Room, rooms };
