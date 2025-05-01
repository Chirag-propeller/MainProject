// import Navbar from '@/components/landingPage/NavBar'
// import React from 'react'

// const page = () => {
//   return (
//     <main className="min-h-screen bg-white text-foreground">
//     <Navbar/>
//     </main>
//   )
// }

// export default page



import Navbar from '@/components/landingPage/NavBar';
import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <main className=''>
    <Navbar/>
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-6">
        Effective Date: April 30, 2025 • Last Updated: April 30, 2025
      </p>

      <p className="mb-6">
        Propeller Global Ventures Pvt. Ltd. (“Propeller,” “we,” “us,” or “our”) operates the website <strong>www.propalai.com</strong> and its associated services (collectively, the “Platform”). This Privacy Policy describes how we collect, use, share, store, and protect personal information in compliance with Indian law and applicable international data protection principles.
      </p>
      <p className="mb-6">By using our Platform, you consent to the practices outlined in this Policy.</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Information We Collect</h2>

      <h3 className="font-semibold mt-4">a. Personal Information</h3>
      <ul className="list-disc list-inside mb-4">
        <li>Full name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Address (including PIN code)</li>
        <li>Government-issued ID (if applicable)</li>
        <li>Information shared through forms, contact pages, or account registration</li>
      </ul>

      <h3 className="font-semibold mt-4">b. Sensitive Personal Data or Information (SPDI)</h3>
      <p className="mb-2">As per Rule 3 of the IT Rules, 2011, this includes:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Passwords</li>
        <li>Financial details (e.g., bank or card information)</li>
        <li>Physical, physiological, or mental health conditions</li>
        <li>Sexual orientation</li>
        <li>Medical history and records</li>
        <li>Biometric identifiers</li>
        <li>Any information relating to the above, collected for providing a service</li>
      </ul>
      <p className="mb-4">We will obtain explicit consent before collecting or using any SPDI.</p>

      <h3 className="font-semibold mt-4">c. Usage and Device Data</h3>
      <ul className="list-disc list-inside mb-4">
        <li>IP address, browser type, device identifiers</li>
        <li>Operating system, pages visited, time spent</li>
        <li>Crash logs, diagnostic data</li>
        <li>Mobile device data (type, OS, browser)</li>
      </ul>

      <h3 className="font-semibold mt-4">d. Location Information</h3>
      <p className="mb-4">
        With your permission, we may collect and use real-time location data for customized service delivery. You can manage location permissions via your device settings.
      </p>

      <h3 className="font-semibold mt-4">e. Cookies & Tracking Technologies</h3>
      <p className="mb-2">We use:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Session Cookies (platform functionality)</li>
        <li>Preference Cookies (remember settings)</li>
        <li>Analytics Cookies (usage patterns)</li>
        <li>Security Cookies</li>
        <li>Advertising Cookies (where applicable)</li>
      </ul>
      <p className="mb-4">You may disable cookies in your browser; however, some features may become unavailable.</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Deliver and maintain services</li>
        <li>Provide customer support</li>
        <li>Personalize your experience</li>
        <li>Send transactional, account-related, or promotional communications</li>
        <li>Analyze trends and monitor performance</li>
        <li>Comply with legal obligations</li>
        <li>Prevent fraud or abuse</li>
        <li>Enforce terms and contractual rights</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. Consent and Right to Withdraw</h2>
      <p className="mb-4">
        You may withdraw consent for the collection and processing of your personal or sensitive personal data at any time by writing to <a href="mailto:support@propalai.com" className="text-blue-600 underline">support@propalai.com</a>. Withdrawal may impact your ability to access certain features or services.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Disclosure of Information</h2>
      <p className="mb-2">We do not sell your data. We may share it:</p>
      <ul className="list-disc list-inside mb-4">
        <li>With trusted service providers under confidentiality agreements</li>
        <li>To enforce terms of service</li>
        <li>When required by law or government order</li>
        <li>To prevent harm or fraud</li>
        <li>During business transfers (merger, acquisition, etc.)</li>
      </ul>
      <p className="mb-4">
        SPDI will only be disclosed with your prior consent or under legal compulsion as per Rule 6 of the IT Rules.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Data Transfers</h2>
      <p className="mb-4">
        If your data is transferred outside India, we ensure the recipient offers a level of data protection equivalent to Indian law, as mandated under Rule 7. Transfers occur only with your consent or under lawful contractual necessity.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Data Retention</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Required to deliver our services</li>
        <li>Necessary for legal, regulatory, or tax purposes</li>
        <li>Needed to resolve disputes or enforce our terms</li>
      </ul>
      <p className="mb-4">Anonymized usage data may be retained for analytics and performance monitoring.</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">7. Your Rights</h2>
      <p className="mb-2">You have the right to:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Access your personal data</li>
        <li>Request correction of inaccurate details</li>
        <li>Delete your data (subject to legal exceptions)</li>
        <li>Withdraw consent</li>
        <li>Object to certain processing</li>
        <li>Export your data in machine-readable format</li>
      </ul>
      <p className="mb-4">To exercise these rights, contact <a href="mailto:support@propalai.com" className="text-blue-600 underline">support@propalai.com</a>.</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">8. Reasonable Security Practices</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Secure servers and encrypted transmissions</li>
        <li>Access control and audit trails</li>
        <li>Regular vulnerability assessments and security audits</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">9. Grievance Officer</h2>
      <p className="mb-4">
        As per Rule 5(9), we have appointed a Grievance Officer:
        <br />
        Name: [To be added]<br />
        Email: <a href="mailto:grievance@propalai.com" className="text-blue-600 underline">grievance@propalai.com</a><br />
        Phone: [To be added]
        <br />
        Complaints will be addressed within 30 days of receipt.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">10. Children’s Privacy</h2>
      <p className="mb-4">
        Our services are not intended for children under 16. We do not knowingly collect data from minors. If identified, such data will be deleted promptly.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">11. Email Communication</h2>
      <p className="mb-4">
        You may receive service updates, alerts, or promotional emails. You can opt out anytime by using the “unsubscribe” link or contacting <a href="mailto:support@propalai.com" className="text-blue-600 underline">support@propalai.com</a>.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">12. Changes to this Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy periodically. Any material changes will be notified on our website or by email. Continued use of our services after such changes constitutes your agreement to the updated policy.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">13. Contact Us</h2>
      <p className="mb-4">
        Propeller Global Ventures Pvt. Ltd.<br />
        B1-401, Kanakia Boomerang, Chandivali Road<br />
        Powai, Mumbai, Maharashtra, India – 400072<br />
        📧 <a href="mailto:support@propalai.com" className="text-blue-600 underline">support@propalai.com</a>
      </p>
    </div>
    </main>
  );
};

export default PrivacyPolicyPage;
