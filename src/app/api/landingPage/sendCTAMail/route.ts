import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import PropalMarketingEmail from '../../../../../emails/CTAEmail';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Read the PDF file
    const pdfPath = path.join(process.cwd(), 'emails', 'ProPAL AI.pdf');
    const pdfBuffer = fs.readFileSync(pdfPath);

    // Send email with attachment
    const { data, error } = await resend.emails.send({
      from: 'ayush@propalai.com', // Replace with your verified domain email
      to: [email],
      subject: `Elevate Your Business with AI-powered Voice Agents - ProPAL AI`,
      react: PropalMarketingEmail(),
      attachments: [
        {
          filename: 'ProPAL_AI_Brochure.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Email sent successfully', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { message: 'This endpoint only accepts POST requests' },
    { status: 405 }
  );
} 