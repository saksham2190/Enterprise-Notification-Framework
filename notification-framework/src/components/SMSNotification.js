// Derived Class

import Notification from "./Notification";

class SMSNotification extends Notification {
  constructor(recipient, message) {
    if (message.length > 160) {
      throw new Error(
        "SMS message cannot exceed 160 characters."
      );
    }

    super(recipient, message);
  }

  // Method overriding
  async send() {
    if (!this.recipient || this.recipient.trim() === "") {
      throw new Error("Please enter a recipient phone number.");
    }
    return `[Simulation Demo] SMS successfully dispatched to ${this.recipient}: "${this.message}". (Note: Sending real SMS to cellular networks requires a paid telecom gateway like Twilio or Fast2SMS).`;
  }
}

export default SMSNotification;