import { useTranslation } from "react-i18next";

export function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {t("privacy.title")}
        </h1>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("privacy.cookieUsage.heading")}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t("privacy.cookieUsage.paragraph")}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {t("privacy.typesOfCookies.heading")}
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              {(
                t("privacy.typesOfCookies.list", {
                  returnObjects: true,
                }) as Array<{ label: string; description: string }>
              ).map((item, index) => (
                <li key={index}>
                  <span className="font-medium">{item.label}:</span>{" "}
                  {item.description}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {t("privacy.yourConsent.heading")}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {t("privacy.yourConsent.paragraph")}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {t("privacy.withdrawalOfConsent.heading")}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {t("privacy.withdrawalOfConsent.paragraph")}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {t("privacy.retention.heading")}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {t("privacy.retention.paragraph")}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {t("privacy.howWeUseCookies.heading")}
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              {(
                t("privacy.howWeUseCookies.list", {
                  returnObjects: true,
                }) as Array<{ label: string; description: string }>
              ).map((item, index) => (
                <li key={index}>
                  <span className="font-medium">{item.label}:</span>{" "}
                  {item.description}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {t("privacy.contactUs.heading")}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {t("privacy.contactUs.paragraph")}
            </p>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            {t("privacy.lastUpdatedLabel")}: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
