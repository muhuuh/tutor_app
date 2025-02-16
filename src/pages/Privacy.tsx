import React from "react";

export function Privacy() {
  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Privacy Policy
        </h1>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Cookie Usage
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We use cookies to enhance your experience, analyze site traffic,
              and for personalized advertising.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Types of Cookies
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>
                <span className="font-medium">Strictly Necessary Cookies:</span>{" "}
                These cookies are essential for the website to function and
                cannot be switched off.
              </li>
              <li>
                <span className="font-medium">Non-Essential Cookies:</span>{" "}
                These include analytics and marketing cookies. They are only
                activated after you give your consent.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Your Consent
            </h3>
            <p className="text-gray-600 leading-relaxed">
              On your first visit, you will be asked to consent to the use of
              non-essential cookies. You may accept or decline. Your choice will
              be respected across all pages of our website.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Withdrawal of Consent
            </h3>
            <p className="text-gray-600 leading-relaxed">
              You can change or withdraw your consent at any time by clicking
              the "Cookie Settings" link in the footer of our website. When you
              withdraw consent, non-essential cookies will be disabled, and you
              may notice changes in website functionality.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Retention
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Your cookie preferences are stored for 365 days. If you do not
              change your settings, your choice will remain in effect until the
              cookie expires.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              How We Use Cookies
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>
                <span className="font-medium">Analytics:</span> To understand
                how visitors interact with our website, which pages are most
                popular, and how we can improve our service.
              </li>
              <li>
                <span className="font-medium">Functionality:</span> To remember
                your preferences and provide enhanced, personalized features.
              </li>
              <li>
                <span className="font-medium">Security:</span> To help protect
                our service and our users from unauthorized access.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Contact Us
            </h3>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about our cookie policy or privacy
              practices, please contact us through our{" "}
              <a
                href="/company/contact"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                contact page
              </a>
              .
            </p>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
