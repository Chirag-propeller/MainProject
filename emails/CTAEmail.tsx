// lib/emails/PropalMarketingEmail.tsx
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
  } from '@react-email/components';
  
  interface PropalMarketingEmailProps {
    // Accept name as a string
  }
  
  export default function PropalMarketingEmail() {
    return (
      <Html>
        <Head />
        <Preview>proPAL AI - Advanced Voice AI Solutions</Preview>
        <Body style={main}>
          <Container style={container}>
            <Section style={coverSection}>
              <Section style={upperSection}>
                {/* Propal Logo */}
                <Section style={logoSection}>
                </Section>
                
                <Text style={mainText}>Hi!</Text>
                <Text style={mainText}>
                  This is Ayush, Co Founder of <strong>proPAL AI</strong>.
                </Text>
                <Text style={mainText}>
                  I hope you're well. We specialize in scalable, enterprise-grade Voice AI solutions, crafted in India, 
                  designed to handle both outbound and inbound call campaigns efficiently with multilingual and 
                  emotionally expressive voice agents.
                </Text>
                
                <Heading style={h2}>Who we are:</Heading>
                <Text style={bulletText}>
                  • <strong>Advanced Voice AI:</strong> Offering natural and engaging interactions through sophisticated 
                  Speech-to-Text (STT), Large Language Models (LLM), and Text-to-Speech (TTS).
                </Text>
                <Text style={bulletText}>
                  • <strong>Global Reach:</strong> Multilingual support enabling businesses to operate seamlessly across multiple regions.
                </Text>
                <Text style={bulletText}>
                  • <strong>Deep Customization:</strong> Tailor-made conversation flows and agent personalities aligned with your brand.
                </Text>

                <Heading style={h2}>What we do:</Heading>
                <Text style={bulletText}>
                  • Provide intelligent voice agents capable of managing high-volume call campaigns, ensuring consistency and compliance.
                </Text>
                <Text style={bulletText}>
                  • Automate sales processes, including follow-ups, lead qualification, and customer outreach.
                </Text>
                <Text style={bulletText}>
                  • Integrate seamlessly with your existing CRM and business systems.
                </Text>

                <Heading style={h2}>Key benefits:</Heading>
                <Text style={bulletText}>
                  • <strong>Cost Efficiency:</strong> Shift from CAPEX to OPEX; reduce headcount costs (~₹20k–₹40k/month per human agent).
                </Text>
                <Text style={bulletText}>
                  • <strong>Performance Boost:</strong> Achieve up to 2× more calls per week with auto-dial and follow-up automation.
                </Text>
                <Text style={bulletText}>
                  • <strong>Higher Engagement:</strong> Personalized, context-aware conversations lead to ~30% higher contact rates 
                  and a 10–20% increase in conversion rates.
                </Text>
                <Text style={bulletText}>
                  • <strong>24/7 Availability:</strong> Ensure uninterrupted customer engagement outside regular business hours.
                </Text>
                <Text style={bulletText}>
                  • <strong>Real-Time Analytics:</strong> Monitor agent performance, sentiment analysis, and KPI dashboards live 
                  for constant optimization.
                </Text>

                <Text style={attachmentText}>
                  Attached is our detailed brochure outlining all capabilities and use-case scenarios. I'd be happy to arrange a quick demo to demonstrate how <strong>proPAL AI</strong> can specifically benefit your business.
                </Text>

                <Section style={ctaSection}>
                <Text style={closingText}>
                  Looking forward to hearing from you soon.
                </Text>

                  <Link href="https://calendly.com/ayush-propalai/30min" target="_blank" style={ctaButton}>
                    Schedule a Product Demo
                  </Link>
                  <Text style={ctaSubText}>
                    30 Minute Meeting - Ayush Agarwal<br/>
                    Introductory call with <strong>proPAL AI</strong>
                  </Text>
                </Section>
              </Section>
              <Hr />
              <Section style={lowerSection}>

                <Text style={signatureText}>
                  Regards,<br />
                  <strong>Ayush Agarwal</strong><br />
                  Co-Founder, <strong>proPAL AI</strong><br />
                  <strong>M:</strong> +91 91374 25804<br />
                  <strong>E:</strong> Ayush@propalai.com
                </Text>
                
                {/* Propal AI Icon */}
                <Section style={logoSection}>
                  {/* <Img
                    src="logo1.png"
                    width="60"
                    height="20"
                    alt="proPAL AI"
                    style={logo}
                  /> */}
                </Section>
              </Section>
            </Section>
            <Text style={footerText}>
              © {new Date().getFullYear()} <strong>proPAL AI</strong>. All rights reserved.
              Visit us at{' '}
              <Link href="https://www.propalai.com" target="_blank" style={link}>
                www.propalai.com
              </Link>
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }
  
  PropalMarketingEmail.PreviewProps = {
    name: 'John Doe', // Example name
  } satisfies PropalMarketingEmailProps;
  
  // --- Styles ---
  const main = { backgroundColor: '#fff', color: '#212121' };
  const container = { margin: '0 auto' };
  const h1 = { color: '#333', fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' };
  const h2 = { color: '#333', fontSize: '18px', fontWeight: 'bold', marginTop: '20px', marginBottom: '10px' };
  const link = { color: '#2754C5', fontSize: '14px', textDecoration: 'underline' };
  const text = { color: '#333', fontSize: '14px', margin: '12px 0' };
  const coverSection = {};
  const upperSection = {};
  const lowerSection = {};
  const footerText = { ...text, fontSize: '12px' };
  const mainText = { ...text, marginBottom: '14px' };
  const bulletText = { 
    ...text, 
    marginBottom: '8px', 
    paddingLeft: '15px'
  };
  const closingText = { ...text, margin: '0px' };
  const signatureText = { ...text, marginTop: '15px', lineHeight: '1.4' };
  const attachmentText = { ...text, fontStyle: 'italic', marginTop: '15px' };
  const logoSection = { 
    textAlign: 'center' as const, 
    marginBottom: '20px' 
  };
  const logo = { 
    margin: '0 auto' 
  };
  const ctaSection = { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    flexDirection: 'column' as 'column',
    marginTop: '25px',
    marginBottom: '15px'
  };
  const ctaText = { ...text, textAlign: 'center' as const, marginBottom: '15px' };
  const ctaSubText = { 
    ...text, 
    textAlign: 'center' as const, 
    fontSize: '12px', 
    marginTop: '10px',
    color: '#666'
  };
  const ctaButton = {
    backgroundColor: '#2754C5',
    color: '#ffffff',
    padding: '12px 24px',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    display: 'inline-block'
  };
  