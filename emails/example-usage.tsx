// Example usage component for sending marketing emails
import React, { useState } from 'react';

const MarketingEmailSender = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendMarketingEmail = async (name: string, email: string) => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/landingPage/sendCTAMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Marketing email sent successfully!');
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage('Failed to send email. Please try again.');
      console.error('Error sending email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Example usage
  const handleSendEmail = () => {
    sendMarketingEmail('John Doe', 'john.doe@example.com');
  };

  return (
    <div>
      <button 
        onClick={handleSendEmail} 
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isLoading ? 'Sending...' : 'Send Marketing Email'}
      </button>
      {message && (
        <p className={`mt-2 ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default MarketingEmailSender; 