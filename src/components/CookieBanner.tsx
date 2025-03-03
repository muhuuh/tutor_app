import * as CookieConsent from "react-cookie-consent";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CookieBanner = () => {
  const { t } = useTranslation();

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
      {t("cookieBanner.message")}{" "}
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
