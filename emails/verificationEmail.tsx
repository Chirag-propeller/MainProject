// lib/emails/PropalVerifyEmail.tsx
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
  
  interface PropalVerifyEmailProps {
    name: string; // Accept name as a string
    otp: string; // Accept OTP (verification code) as a string
  }
  
  export default function PropalVerifyEmail({
    name, // Destructure name and otp from props
    otp,
  }: PropalVerifyEmailProps) {
    return (
      <Html>
        <Head />
        <Preview>Propal AI Email Verification</Preview>
        <Body style={main}>
          <Container style={container}>
            <Section style={coverSection}>
              <Section style={upperSection}>
                <Heading style={h1}>Verify your email address</Heading>
                <Text style={mainText}>
                  Thanks for signing up with <strong>Propal AI</strong>! 
                  We're excited to have you onboard.
                  Please use the verification code below to complete your registration.
                </Text>
                <Section style={verificationSection}>
                  <Text style={verifyText}>Verification Code</Text>
                  <Text style={codeText}>{otp}</Text> {/* Using OTP here */}
                  <Text style={validityText}>
                    (This code is valid for 4 hours )
                  </Text>
                </Section>
              </Section>
              <Hr />
              <Section style={lowerSection}>
                <Text style={cautionText}>
                  For your security, never share your OTP code with anyone.
                </Text>
              </Section>
            </Section>
            <Text style={footerText}>
              © {new Date().getFullYear()} Propal AI. All rights reserved.
              Visit us at{' '}
              <Link href="https://your-company-website.com" target="_blank" style={link}>
                Propal AI
              </Link>.
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }
  
  PropalVerifyEmail.PreviewProps = {
    name: 'John Doe', // Example name
    otp: '596853', // Example OTP
  } satisfies PropalVerifyEmailProps;
  
  // --- Styles ---
  const main = { backgroundColor: '#fff', color: '#212121' };
  const container = { padding: '20px', margin: '0 auto', backgroundColor: '#eee' };
  const h1 = { color: '#333', fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' };
  const link = { color: '#2754C5', fontSize: '14px', textDecoration: 'underline' };
  const text = { color: '#333', fontSize: '14px', margin: '24px 0' };
  const coverSection = { backgroundColor: '#fff' };
  const upperSection = { padding: '25px 35px' };
  const lowerSection = { padding: '25px 35px' };
  const footerText = { ...text, fontSize: '12px', padding: '0 20px' };
  const verifyText = { ...text, margin: 0, fontWeight: 'bold', textAlign: 'center' as const };
  const codeText = { ...text, fontWeight: 'bold', fontSize: '36px', margin: '10px 0', textAlign: 'center' as const };
  const validityText = { ...text, margin: '0px', textAlign: 'center' as const };
  const verificationSection = { display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' as 'column' };
  const mainText = { ...text, marginBottom: '14px' };
  const cautionText = { ...text, margin: '0px' };
  