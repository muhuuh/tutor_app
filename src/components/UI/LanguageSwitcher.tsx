import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2">
      <button
        className={`px-2 py-1 rounded ${
          i18n.language === "en" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => changeLanguage("en")}
      >
        EN
      </button>
      <button
        className={`px-2 py-1 rounded ${
          i18n.language === "de" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => changeLanguage("de")}
      >
        DE
      </button>
      <button
        className={`px-2 py-1 rounded ${
          i18n.language === "fr" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => changeLanguage("fr")}
      >
        FR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
