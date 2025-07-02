"use client"
import { ZohoCard, GoogleCalendarCard, OutlookCalendarCard, CalendlyCard } from '@/components/integration';
import GoogleSheetCard from '@/components/integration/card/GoogleSheet';
import GmailCard from '@/components/integration/card/Gmail';
import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, Calendar, Building2, Mail, Zap, Check } from 'lucide-react';

const page = () => {
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({
    calendar: true,
    crm: true,
    email: true
  });
  const [connectedIntegrations, setConnectedIntegrations] = useState({});

  useEffect(() => {
    const checkConnections = async () => {
      try {
        // Check for existing integrations by checking if we have tokens stored
        const providers = ['googleCalendar', 'outlookCalendar', 'calendly', 'zoho', 'gmail', 'googleSheets'];
        const connections = {};
        
        for (const provider of providers) {
          try {
            const response = await fetch(`/api/integration/${provider === 'googleSheets' ? 'googleSheet' : provider}/status`);
            if (response.ok) {
              const data = await response.json();
              connections[provider] = data.connected || false;
            } else {
              connections[provider] = false;
            }
          } catch (error) {
            connections[provider] = false;
          }
        }
        
        setConnectedIntegrations(connections);
      } catch (error) {
        console.error('Failed to check connection status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkConnections();
  }, []);

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleSuccess = (data: any) => {
    console.log('Integration success:', data);
    // Refresh connection status after successful integration
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleError = (error: any) => {
    console.error('Integration error:', error);
  };

  const handleIntegrationClick = (provider: string) => {
    switch (provider) {
      case 'googleCalendar':
        window.location.href = '/api/integration/googleCalendar/auth';
        break;
      case 'outlookCalendar':
        window.location.href = '/api/integration/outlookCalendar/auth';
        break;
      case 'calendly':
        window.location.href = '/api/integration/calendly/auth';
        break;
      case 'zoho':
        window.location.href = '/api/integration/crm/zoho/auth';
        break;
      case 'gmail':
        window.location.href = '/api/integration/gmail/auth';
        break;
      case 'googleSheets':
        window.location.href = '/api/integration/googleSheet/auth';
        break;
    }
  };

  // Accordion Section Component
  const AccordionSection = ({ id, title, icon, children, isOpen, onToggle }) => (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl">{icon}</span>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-gray-500 transition-transform" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-500 transition-transform" />
        )}
      </button>
      <div className={`transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="border-t border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );

  // Integration Row Component
  const IntegrationRow = ({ integration, isConnected, onConnect }) => (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
          <integration.icon className="text-orange-600 w-5 h-5" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{integration.name}</h3>
        </div>
      </div>
      
      <div className="flex-1 px-6">
        <p className="text-sm text-gray-500">{integration.description}</p>
      </div>
      
      <button
        onClick={() => onConnect(integration.provider)}
        className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
          isConnected 
            ? 'bg-green-100 text-green-700 cursor-default' 
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer'
        }`}
        disabled={isConnected}
      >
        {isConnected ? (
          <span className="flex items-center space-x-1">
            <Check className="w-3 h-3" />
            <span>Connected</span>
          </span>
        ) : (
          <span className="flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>Connect</span>
          </span>
        )}
      </button>
    </div>
  );

  const integrationSections = [
    {
      id: 'calendar',
      title: 'Calendar Integrations',
      icon: '📅',
      integrations: [
        {
          provider: 'googleCalendar',
          name: 'Google Calendar',
          description: 'Sync events with your Google Calendar',
          icon: Calendar
        },
        {
          provider: 'outlookCalendar',
          name: 'Outlook Calendar',
          description: 'Sync events with your Outlook Calendar',
          icon: Calendar
        },
        {
          provider: 'calendly',
          name: 'Calendly',
          description: 'Manage scheduled events with your Calendly',
          icon: Calendar
        }
      ]
    },
    {
      id: 'crm',
      title: 'CRM Integrations',
      icon: '🧩',
      integrations: [
        {
          provider: 'zoho',
          name: 'Zoho CRM',
          description: 'Connect your Zoho CRM for customer management',
          icon: Building2
        }
      ]
    },
    {
      id: 'email',
      title: 'Email Integrations',
      icon: '📧',
      integrations: [
        {
          provider: 'gmail',
          name: 'Gmail',
          description: 'Connect your Gmail to send emails',
          icon: Mail
        },
        {
          provider: 'googleSheets',
          name: 'Google Sheets',
          description: 'Connect Google Sheets for data management',
          icon: Building2
        }
      ]
    }
  ];

  if (loading) {
    return (
      <div className='pl-2'>
        <div className='text-xl py-2 my-2'>Integration</div>
        <div className='space-y-4 animate-pulse'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-3">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='pl-2'>
      <div className='text-xl py-2 my-2'>Integration</div>
      <div className='space-y-4'>
        {integrationSections.map(section => (
          <AccordionSection
            key={section.id}
            id={section.id}
            title={section.title}
            icon={section.icon}
            isOpen={openSections[section.id]}
            onToggle={() => toggleSection(section.id)}
          >
            {section.integrations.map(integration => (
              <IntegrationRow
                key={integration.provider}
                integration={integration}
                isConnected={connectedIntegrations[integration.provider]}
                onConnect={handleIntegrationClick}
              />
            ))}
          </AccordionSection>
        ))}
      </div>
    </div>
  )
}

export default page