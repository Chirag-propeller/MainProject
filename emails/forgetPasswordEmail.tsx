import {
    Body,
    Container,
    Head,
    Html,
    Preview,
    Section,
    Text,
  } from '@react-email/components';
  
  interface PasswordResetOTPEmailProps {
    name?: string;
    otp?: string;
  }
  
  export const PasswordResetOTPEmail = ({
    name,
    otp,
  }: PasswordResetOTPEmailProps) => {
    return (
      <Html>
        <Head />
        <Body style={main}>
          <Preview>Propal AI Password Reset OTP</Preview>
          <Container style={container}>
            <Section>
              <Text style={heading}>Propal AI</Text>
              <Text style={text}>Hi {name},</Text>
              <Text style={text}>
                We received a request to reset your Propal AI account password. 
                Use the following OTP to verify your identity:
              </Text>
  
              <Section style={codeContainer}>
                <Text style={codeText}>{otp}</Text>
              </Section>
  
              <Text style={text}>
                This OTP is valid for 15 minutes. If you didn't request this password reset, 
                please ignore this email or contact our support team.
              </Text>
  
              <Text style={text}>
                For security reasons, never share this OTP with anyone. 
                Our team will never ask you for your verification code.
              </Text>
  
              <Text style={text}>
                Best regards,
                <br />
                The Propal AI Team
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  };
  
  PasswordResetOTPEmail.PreviewProps = {
    name: 'Alex',
    otp: '123456',
  } as PasswordResetOTPEmailProps;
  
  export default PasswordResetOTPEmail;
  
  const main = {
    backgroundColor: '#ffffff',
    padding: '20px 0',
  };
  
  const container = {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f0f0',
    padding: '45px',
    maxWidth: '600px',
    margin: '0 auto',
  };
  
  const heading = {
    fontSize: '24px',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontWeight: 'bold',
    color: '#404040',
    marginBottom: '30px',
  };
  
  const text = {
    fontSize: '16px',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    color: '#404040',
    lineHeight: '26px',
    margin: '20px 0',
  };
  
  const codeContainer = {
    backgroundColor: '#f6f6f6',
    borderRadius: '4px',
    padding: '20px',
    margin: '25px 0',
    textAlign: 'center' as const,
  };
  
  const codeText = {
    ...text,
    fontSize: '32px',
    fontWeight: 'bold',
    letterSpacing: '8px',
    color: '#0070f3',
    margin: '0',
  };