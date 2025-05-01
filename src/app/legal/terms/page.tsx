
import Navbar from "@/components/landingPage/NavBar";
import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <main>
        <Navbar/>
        <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-6">
            Effective Date: May 1, 2025
        </p>

        <p className="mb-6">
            These Terms of Service ("Terms") govern your access to and use of the services provided by Propeller Global Ventures Pvt. Ltd. (“Propeller,” “we,” “us,” or “our”) through our website <strong>www.propalai.com</strong> and related services (collectively, the “Platform”).
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">1. Acceptance of Terms</h2>
        <p className="mb-6">
            By accessing or using the Platform or Services, you agree to be bound by these Terms, as well as our Privacy Policy. If using on behalf of a business, you confirm you have authority to bind the entity. If you disagree with any part of these Terms, you must not use our Services.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">2. Eligibility</h2>
        <p className="mb-6">
            You must be legally capable under Indian law to enter into a binding contract. Users under 18 may only use the Services under parental or guardian supervision.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">3. Our Services</h2>
        <h3 className="font-semibold mt-4">a. Core Offering</h3>
        <p className="mb-4">
            We offer a platform for managing AI-powered voice agents, including telephony, campaigns, and analytics.
        </p>
        <h3 className="font-semibold mt-4">b. Additional Services</h3>
        <p className="mb-4">
            Includes AI development, integration, and consulting, which may be governed by separate agreements.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">4. Account Management</h2>
        <h3 className="font-semibold mt-4">a. Registration</h3>
        <p className="mb-4">
            You must register with accurate information and keep your credentials confidential. We are not responsible for third-party access resulting from your negligence.
        </p>

        <h3 className="font-semibold mt-4">b. License</h3>
        <p className="mb-4">
            You are granted a limited, non-transferable license to use the Platform. You must not reverse engineer, distribute, or misuse any part of the Services.
        </p>

        <h3 className="font-semibold mt-4">c. Unacceptable Activities</h3>
        <ul className="list-disc list-inside mb-4">
            <li>Violating any applicable laws</li>
            <li>Infringing intellectual property or privacy rights</li>
            <li>Hacking, spamming, or attacking our systems</li>
            <li>Impersonation, misrepresentation, or using offensive content</li>
            <li>Spreading malware or unauthorized scraping</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">5. Fees and Payment</h2>
        <p className="mb-4">
            All fees are non-refundable. Subscription renewals are automatic unless canceled. Payments are handled via third-party gateways, and we are not liable for gateway failures.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">6. Acceptable Use & Compliance</h2>
        <ul className="list-disc list-inside mb-4">
            <li>Comply with Indian IT laws and TRAI regulations</li>
            <li>Do not misuse AI voices without consent</li>
            <li>Scrub call lists against DND registries</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">7. Intellectual Property</h2>
        <p className="mb-4">
            All content is owned by Propeller. You may not copy, modify, or distribute it without permission.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">8. Data Protection</h2>
        <p className="mb-4">
            We follow ISO/IEC 27001-aligned security practices and Indian data protection laws. See our Privacy Policy for more.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">9. No Warranties</h2>
        <p className="mb-4">
            Services are provided "as is." We disclaim all warranties, including fitness for purpose, uninterrupted access, and accuracy of data.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">10. Limitation of Liability</h2>
        <p className="mb-4">
            We are not liable for indirect or consequential damages. Our total liability will not exceed ₹10,000 or the amount paid in the prior 12 months.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">11. Indemnification</h2>
        <p className="mb-4">
            You agree to indemnify us against any claims arising from your misuse of the Services or violation of these Terms.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">12. Governing Law & Dispute Resolution</h2>
        <p className="mb-4">
            These Terms are governed by Indian law. Disputes will be resolved through arbitration in Mumbai under the Arbitration and Conciliation Act, 1996.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">13. Modifications</h2>
        <p className="mb-4">
            We may revise these Terms. Updated Terms will be posted on this page with a new effective date.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">14. Contact Information</h2>
        <p className="mb-4">
            <strong>Propeller Global Ventures Pvt. Ltd.</strong><br />
            B1-401, Kanakia Boomerang, Chandivali Road,<br />
            Powai, Mumbai, Maharashtra, India – 400072<br />
            📧 <a href="mailto:support@propalai.com" className="text-blue-600 underline">support@propalai.com</a>
        </p>
        </div>
</main>
  )}

export default TermsOfService;
