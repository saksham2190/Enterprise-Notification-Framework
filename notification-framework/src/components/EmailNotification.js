// Derived Class

import Notification from "./Notification";
import emailjs from "@emailjs/browser";

class EmailNotification extends Notification {
  constructor(recipient, message, config = {}) {
    super(recipient, message);
    this.serviceId = config.serviceId;
    this.templateId = config.templateId;
    this.publicKey = config.publicKey;
  }

  // Method overriding
  async send() {
    if (!this.recipient || !this.recipient.includes("@")) {
      throw new Error("Please enter a valid recipient email address.");
    }

    if (!this.message || this.message.trim() === "") {
      throw new Error("Message cannot be empty.");
    }

    if (!this.serviceId || !this.templateId || !this.publicKey) {
      throw new Error(
        "EmailJS credentials missing. Please configure Service ID, Template ID, and Public Key in settings."
      );
    }

    const templateParams = {
      to_email: this.recipient,
      recipient: this.recipient,
      message: this.message,
    };

    await emailjs.send(
      this.serviceId,
      this.templateId,
      templateParams,
      this.publicKey
    );

    return `Email successfully sent to ${this.recipient}!`;
  }
}

export default EmailNotification;