import { motion } from "framer-motion";

export default function Terms() {
  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <motion.h1
            className="text-3xl font-bold text-gray-900 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Terms of Service
          </motion.h1>

          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600">Last updated: February 1, 2025</p>

            <h2>EU Data Protection Compliance (GDPR)</h2>
            <p>
              We are committed to complying with the EU General Data Protection
              Regulation (GDPR). As an EU resident, you have the right to
              access, rectify, or request erasure of your personal data at any
              time. You also have the right to object to or restrict certain
              processing of your data, as well as the right to data portability.
              To exercise these rights, please contact us at
              support@robinagent.ai.
            </p>
            <p>
              We will store your personal data only for as long as it is
              necessary to provide our services or as otherwise required by
              applicable law. When we no longer need your personal data, we will
              securely delete or anonymize it.
            </p>

            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing and using RobinAgent's services, you agree to be
              bound by these Terms of Service and our Privacy Policy. If you
              disagree with any part of these terms, you may not access our
              services.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              RobinAgent provides AI-powered educational tools and services
              designed to assist educators in grading, creating educational
              content, and managing student progress. Our service utilizes
              artificial intelligence technology to provide automated assistance
              and insights.
            </p>

            <h2>3. Subscription and Payment Terms</h2>
            <p>
              Our service is provided on a subscription basis. Payments are
              processed securely through Stripe on a monthly billing cycle. You
              may cancel your subscription at any time, and the cancellation
              will take effect at the end of your current billing period. No
              refunds are provided for partial months of service.
            </p>
            <p>
              If required under EU consumer protection laws, you may also be
              entitled to a statutory "cooling-off period" for certain
              subscription purchases.
            </p>

            <h2>4. User Accounts and Data</h2>
            <p>
              When you create an account, you must provide accurate and complete
              information. You are responsible for maintaining the security of
              your account and for all activities that occur under it. We store
              your data securely using Supabase infrastructure and utilize AI
              services to process your content. All data processing complies
              with applicable privacy laws and our Privacy Policy.
            </p>

            <h2>5. Intellectual Property Rights</h2>
            <p>
              The Service and its original content, features, and functionality
              are owned by RobinAgent and are protected by international
              copyright, trademark, and other intellectual property laws.
            </p>

            <h2>6. User Content and AI Processing</h2>
            <p>
              You retain rights to any content you submit, post, or display on
              or through the Service. By submitting content, you grant us
              permission to process it using AI technologies and store it
              securely to provide our services. We do not claim ownership of
              your content but require these rights to provide our service
              effectively.
            </p>

            <h2>7. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. We process your data using AI
              technologies and store it securely using Supabase. All data
              processing is carried out in compliance with applicable EU data
              protection legislation, including the GDPR. Please review our
              Privacy Policy to understand how we collect, use, and protect your
              personal information, as well as how you can exercise your rights
              with respect to your data.
            </p>

            <h2>AI Disclaimer</h2>
            <p>
              While we utilize advanced AI models to provide suggestions,
              insights, or other automated outputs, these features are provided
              on an "as-is" basis. The AI may not always produce accurate or
              error-free results, and you are responsible for verifying the
              information before relying upon it. RobinAgent disclaims any
              liability arising from AI-generated outputs that may be incomplete
              or inaccurate.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              RobinAgent shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages resulting from your
              use or inability to use the Service. While we strive for high
              accuracy in our AI-powered features, we cannot guarantee perfect
              results.
            </p>
            <p>
              The AI-powered functionalities provided by RobinAgent are for
              informational and educational purposes only and do not constitute
              legal, financial, health, or any other professional advice. If you
              need professional advice, please consult a qualified professional.
            </p>

            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will
              notify users of any material changes via email or through the
              Service.
            </p>

            <h2>10. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at
              support@robinagent.ai
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
