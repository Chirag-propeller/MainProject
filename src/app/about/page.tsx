import Navbar from '@/components/landingPage/NavBar';
import React from 'react';

const AboutAndContactPage = () => {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
      <div className='mt-4' id='about-us'>
        <h1 className="text-3xl font-bold mb-6" >About Us</h1>
        <p className="mb-4">
          At <strong>proPAL AI</strong>, we’re reimagining how businesses communicate — through intelligent,
          emotionally expressive <strong>voice AI agents</strong> that sound and feel human.
        </p>
        <p className="mb-4">
          Our platform combines <strong>Large Language Models (LLMs)</strong>, advanced <strong>speech recognition and synthesis</strong>,
          and intelligent <strong>workflow orchestration</strong> to create agents that can engage in <strong>real-time</strong>, <strong>natural conversations</strong> , detect intent, adapt emotionally, and drive outcomes.
        </p>
        <p className="mb-4">
          Beyond 1:1 interaction, <strong>proPAL AI enables campaign-based and batch calling at scale</strong> — with agents
          that can<strong> automatically follow up</strong>, handle <strong>lead qualification</strong>, respond to<strong> inbound requests</strong>, and
          escalate when necessary — all while sounding naturally human.
        </p>
        <p className="mb-4">
          Each conversation is scored and analyzed with deep interaction metrics, including:
        </p>
        <ul className="list-disc list-inside mb-4 font-semibold">
          <li>Intent detection & success rates</li>
          <li>Script adherence and call disposition tagging</li>
          <li>Sentiment analysis and tone violation flags</li>
          <li>Customer engagement & lead scoring</li>
          <li>AI confidence, NLP error rates, and compliance risk</li>
        </ul>
        <p className="mb-4">
          Example outcome from a real call:</p>
          <p className='mb-2 italic'> Call connected, script partially followed, sentiment neutral, tone violation detected (‘informal language’), lead score: 2, no conversion or escalation, but customer remained engaged across 10 turns.
        </p>
        <p className="mb-8">
          With structured analytics like these, businesses can monitor performance, surface opportunities,
          and continuously optimize every voice interaction.
        </p>
        <p className="mb-12">
          <strong>proPAL AI</strong> is a brand owned and operated by <strong>Propeller Global Ventures Pvt. Ltd.</strong>,
          a Mumbai-based company focused on building practical, high-impact AI solutions for modern enterprises.
        </p>
        </div>
        <div className='mt-15 mb-20' id='contact-us'>
        <h2 className="text-2xl font-bold mb-4" >Contact Us</h2>
        <p className="mb-4">Want to partner, collaborate, or explore our technology?</p>
        <p className="mb-2">📧 Email: <a href="mailto:support@propalai.com" className="text-blue-600 underline">support@propalai.com</a></p>
        <p className="mb-2">🏢 Address:</p>
        <p className="ml-4 mb-4">
          Propeller Global Ventures Pvt. Ltd.<br />
          B1-401, Kanakia Boomerang, Chandivali Road<br />
          Powai, Mumbai, Maharashtra, India – 400072
        </p>
        <p className="mb-2">
          🌐 Website: <a href="https://www.propalai.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">www.propalai.com</a>
        </p>
        <p className="mt-4 font-semibold">Let’s build the future of voice — together.</p>
        </div>
      </div>
    </main>
  );
};

export default AboutAndContactPage;
