// Base / Abstract Class

class Notification {
  constructor(recipient, message) {
    if (new.target === Notification) {
      throw new Error("Notification is an abstract class.");
    }

    this.recipient = recipient;
    this.message = message;
  }

  // Abstract method
  async send() {
    throw new Error("send() method must be implemented.");
  }
}

export default Notification;