import * as CookieConsent from "react-cookie-consent";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

const CookieBanner = () => {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Delay showing the cookie banner by 9 seconds
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  if (!showBanner) {
    return null;
  }

  return (
    <CookieConsent.default
      location="bottom"
      buttonText={t("cookieBanner.accept")}
      declineButtonText={t("cookieBanner.decline")}
      enableDeclineButton
      cookieName="CookieConsent"
      expires={365}
      style={{
        background: "#1f2937",
        fontSize: "12px",
        borderTop: "1px solid #374151",
        maxWidth: "380px",
        margin: "0 auto",
        left: "0",
        right: "0",
        bottom: "10px",
        borderRadius: "6px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        zIndex: 999,
      }}
      buttonStyle={{
        background: "#3b82f6",
        color: "#fff",
        fontSize: "12px",
        borderRadius: "4px",
        padding: "5px 10px",
        margin: "5px",
        minWidth: "60px",
        display: "inline-block",
      }}
      declineButtonStyle={{
        background: "transparent",
        border: "1px solid #6b7280",
        color: "#fff",
        fontSize: "12px",
        borderRadius: "4px",
        padding: "5px 10px",
        margin: "5px",
        minWidth: "60px",
        display: "inline-block",
      }}
      contentStyle={{
        flex: "1",
        margin: "0 0 8px 0",
        padding: "0",
        fontSize: "12px",
        lineHeight: "1.3",
      }}
      buttonWrapperClasses="flex justify-end w-full m-0 p-0"
      containerClasses="cookie-container"
      contentClasses="cookie-content"
      ariaAcceptLabel={t("cookieBanner.ariaAcceptLabel")}
      ariaDeclineLabel={t("cookieBanner.ariaDeclineLabel")}
      onAccept={() => {
        console.log("User accepted non-essential cookies");
        // Initialize analytics here if needed
      }}
      onDecline={() => {
        console.log("User declined non-essential cookies");
      }}
    >
      <div style={{ paddingRight: "4px" }}>
        {t("cookieBanner.message")}{" "}
        <Link
          to="/privacy"
          style={{ color: "#60a5fa", textDecoration: "underline" }}
        >
          Privacy Policy
        </Link>{" "}
        for details.
      </div>
    </CookieConsent.default>
  );
};

export default CookieBanner;
