import React from "react";
import * as CookieConsent from "react-cookie-consent";
import { Link } from "react-router-dom";

const CookieBanner = () => {
  return (
    <CookieConsent.default
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      cookieName="CookieConsent"
      expires={365}
      style={{
        background: "#1f2937",
        fontSize: "14px",
        borderTop: "1px solid #374151",
      }}
      buttonStyle={{
        background: "#3b82f6",
        color: "#fff",
        fontSize: "14px",
        borderRadius: "0.5rem",
        padding: "0.5rem 1rem",
      }}
      declineButtonStyle={{
        background: "transparent",
        border: "1px solid #6b7280",
        color: "#fff",
        fontSize: "14px",
        borderRadius: "0.5rem",
        padding: "0.5rem 1rem",
      }}
      ariaAcceptLabel="Accept cookies"
      ariaDeclineLabel="Decline cookies"
      onAccept={() => {
        console.log("User accepted non-essential cookies");
        // Initialize analytics here if needed
      }}
      onDecline={() => {
        console.log("User declined non-essential cookies");
      }}
    >
      We use cookies to improve your experience. By clicking "Accept," you
      consent to the use of non-essential cookies (e.g. analytics). Read our{" "}
      <Link
        to="/privacy"
        style={{ color: "#60a5fa", textDecoration: "underline" }}
      >
        Privacy Policy
      </Link>{" "}
      for details.
    </CookieConsent.default>
  );
};

export default CookieBanner;
