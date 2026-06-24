import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Terms of Service - AI Credits Trading Platform",
  description:
    "Terms of Service for the AI Credits Trading Platform. Please read these terms carefully before using our service.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using the AI Credits Trading Platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service. These Terms apply to all users, including traders, buyers, sellers, and visitors.`,
  },
  {
    title: "2. Description of Service",
    content: `The AI Credits Trading Platform is a marketplace for buying, selling, and trading AI API credits across multiple providers. We provide the platform and tools for users to trade credits, but we are not a party to any transaction between users. We do not guarantee the availability, quality, or accuracy of AI credits traded on the platform.`,
  },
  {
    title: "3. User Accounts",
    content: `To use the Service, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must be at least 18 years old to create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.`,
  },
  {
    title: "4. Trading Rules",
    content: `All trades on the platform are subject to the following rules: (a) Trades are binding once confirmed by both parties; (b) Credits must be transferred within the agreed-upon timeframe; (c) The platform charges a commission on each trade as specified in your plan; (d) Disputes between traders will be handled through our dispute resolution process; (e) We reserve the right to suspend or cancel trades that violate these Terms or appear fraudulent.`,
  },
  {
    title: "5. Payments and Fees",
    content: `Trading commissions vary by plan: Free (2.5%), Pro (1.0%), and Enterprise (0.25%). Fees are deducted from each transaction. We reserve the right to change our fee structure with 30 days' notice. All payments are processed through our payment partners. Refunds are handled on a case-by-case basis in accordance with our refund policy.`,
  },
  {
    title: "6. User Responsibilities",
    content: `You are responsible for: (a) Ensuring you have the legal right to trade any credits you list; (b) Accurately describing the credits you are selling; (c) Transferring credits promptly after a trade is confirmed; (d) Complying with all applicable laws and regulations; (e) Not engaging in fraudulent, misleading, or manipulative practices; (f) Maintaining the security of your account and API keys.`,
  },
  {
    title: "7. Prohibited Activities",
    content: `The following activities are prohibited on the platform: (a) Trading stolen or fraudulently obtained credits; (b) Market manipulation or price fixing; (c) Creating multiple accounts to circumvent limits; (d) Harassing, threatening, or abusing other users; (e) Attempting to reverse-engineer or disrupt the platform; (f) Using the platform for money laundering or other illegal activities; (g) Circumventing the platform's escrow system.`,
  },
  {
    title: "8. Intellectual Property",
    content: `The Service and its original content, features, and functionality are owned by AI Credits Trading Platform and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any content from the Service without our prior written consent.`,
  },
  {
    title: "9. Limitation of Liability",
    content: `To the maximum extent permitted by law, the AI Credits Trading Platform shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, goodwill, or other intangible losses, arising out of or relating to your use of or inability to use the Service, any transactions made through the Service, or any unauthorized access to your personal information.`,
  },
  {
    title: "10. Dispute Resolution",
    content: `Any disputes arising out of or relating to these Terms or the Service shall first be attempted to be resolved through informal negotiation. If informal resolution fails, disputes will be submitted to binding arbitration in accordance with the rules of the American Arbitration Association. You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.`,
  },
  {
    title: "11. Changes to Terms",
    content: `We reserve the right to modify these Terms at any time. We will provide notice of significant changes via email or through the platform. Your continued use of the Service after any changes constitutes acceptance of the updated Terms. It is your responsibility to review these Terms periodically.`,
  },
  {
    title: "12. Contact Information",
    content: `If you have any questions about these Terms, please contact us at legal@aicredits.io or through our support portal. For security concerns, please email security@aicredits.io.`,
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-muted-foreground">
          Last updated: January 15, 2025
        </p>
      </div>

      <Separator className="mb-8" />

      {/* Introduction */}
      <div className="mb-8 text-muted-foreground leading-relaxed">
        <p>
          Welcome to the AI Credits Trading Platform. These Terms of Service
          govern your use of our platform and services. By using our Service,
          you agree to these Terms. Please read them carefully.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xl font-semibold tracking-tight mb-3">
              {section.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      <Separator className="my-8" />

      {/* Footer note */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          By using the AI Credits Trading Platform, you acknowledge that you
          have read, understood, and agree to be bound by these Terms of
          Service.
        </p>
        <p className="mt-4">
          For questions about these terms, contact us at{" "}
          <a
            href="mailto:legal@aicredits.io"
            className="text-primary hover:underline"
          >
            legal@aicredits.io
          </a>
        </p>
      </div>
    </div>
  );
}
