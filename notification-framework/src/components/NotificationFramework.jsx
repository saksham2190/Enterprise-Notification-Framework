import React, { useState, useEffect } from "react";

import EmailNotification from "./EmailNotification";
import SMSNotification from "./SMSNotification";

function NotificationFramework() {
  const [type, setType] = useState("email");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // EmailJS Configuration from localStorage or environment variables
  const [serviceId, setServiceId] = useState(
    () => localStorage.getItem("emailjs_service_id") || import.meta.env.VITE_EMAILJS_SERVICE_ID || ""
  );
  const [templateId, setTemplateId] = useState(
    () => localStorage.getItem("emailjs_template_id") || import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ""
  );
  const [publicKey, setPublicKey] = useState(
    () => localStorage.getItem("emailjs_public_key") || import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ""
  );

  const isEmailConfigured = Boolean(serviceId && templateId && publicKey);
  const [showSettings, setShowSettings] = useState(!isEmailConfigured);

  const handleSaveSettings = (sId, tId, pKey) => {
    setServiceId(sId);
    setTemplateId(tId);
    setPublicKey(pKey);
    localStorage.setItem("emailjs_service_id", sId);
    localStorage.setItem("emailjs_template_id", tId);
    localStorage.setItem("emailjs_public_key", pKey);
  };

  const handleSend = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      let notification;

      // Polymorphic instantiation based on type
      if (type === "email") {
        notification = new EmailNotification(recipient, message, {
          serviceId,
          templateId,
          publicKey,
        });
      } else {
        notification = new SMSNotification(recipient, message);
      }

      // Calling overridden send() method asynchronously
      const response = await notification.send();

      setResult({ type: "success", text: response });
    } catch (error) {
      setResult({
        type: "error",
        text: `Error: ${error.message || error.text || "Failed to deliver notification."}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="notification-container">
      <h1>Enterprise Notification Framework</h1>

      <p className="subtitle">
        OOP-based Notification System with Real Email Delivery
      </p>

      {/* Notification Type */}
      <label>Notification Channel</label>
      <select
        value={type}
        onChange={(e) => {
          setType(e.target.value);
          setResult(null);
        }}
      >
        <option value="email">
          Email Notification (Live Delivery via EmailJS)
        </option>
        <option value="sms">
          SMS Notification (Simulation Demo)
        </option>
      </select>

      {/* Recipient */}
      <label>Recipient</label>
      <input
        type="text"
        placeholder={
          type === "email"
            ? "Enter recipient email (e.g., your-email@gmail.com)"
            : "+91XXXXXXXXXX"
        }
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />

      {/* Message */}
      <label>Message</label>
      <textarea
        rows="5"
        placeholder="Enter your notification message..."
        value={message}
        maxLength={type === "sms" ? 160 : undefined}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* SMS Character Counter */}
      {type === "sms" && (
        <div className="character-count">
          {message.length}/160 characters
        </div>
      )}

      {/* EmailJS Settings Toggle & Box (Visible for Email channel) */}
      {type === "email" && (
        <div>
          <button
            type="button"
            className="settings-toggle-btn"
            onClick={() => setShowSettings(!showSettings)}
          >
            ⚙️ {showSettings ? "Hide" : "Configure"} EmailJS API Keys
            <span className={`badge ${isEmailConfigured ? "badge-live" : "badge-demo"}`}>
              {isEmailConfigured ? "Keys Saved" : "Setup Required"}
            </span>
          </button>

          {showSettings && (
            <div className="settings-box">
              <h3>EmailJS Service Settings</h3>
              <p className="settings-help">
                To send real emails to your inbox for free:
                <br />
                1. Sign up at <a href="https://www.emailjs.com" target="_blank" rel="noreferrer">emailjs.com</a>
                <br />
                2. Add your email (e.g., Gmail) in <strong>Email Services</strong> to get <strong>Service ID</strong>
                <br />
                3. Create an <strong>Email Template</strong> (use <code>{"{{to_email}}"}</code> and <code>{"{{message}}"}</code>) to get <strong>Template ID</strong>
                <br />
                4. Copy your <strong>Public Key</strong> from <strong>Account &gt; API Keys</strong>
              </p>

              <div className="settings-input-group">
                <label>EmailJS Service ID</label>
                <input
                  type="text"
                  placeholder="service_xxxxxxx"
                  value={serviceId}
                  onChange={(e) => handleSaveSettings(e.target.value, templateId, publicKey)}
                />
              </div>

              <div className="settings-input-group">
                <label>EmailJS Template ID</label>
                <input
                  type="text"
                  placeholder="template_xxxxxxx"
                  value={templateId}
                  onChange={(e) => handleSaveSettings(serviceId, e.target.value, publicKey)}
                />
              </div>

              <div className="settings-input-group">
                <label>EmailJS Public Key</label>
                <input
                  type="text"
                  placeholder="e.g. 7abcXYZ123..."
                  value={publicKey}
                  onChange={(e) => handleSaveSettings(serviceId, templateId, e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={isLoading || (type === "email" && !isEmailConfigured)}
      >
        {isLoading
          ? "Sending Notification..."
          : type === "email" && !isEmailConfigured
          ? "Configure EmailJS Keys Above to Send"
          : "Send Notification"}
      </button>

      {/* Result Display */}
      {result && (
        <div className={`result ${result.type}`}>
          {result.text}
        </div>
      )}
    </div>
  );
}

export default NotificationFramework;