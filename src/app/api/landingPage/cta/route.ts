import dbConnect from "@/lib/mongodb";
import CtaLeads from "@/model/landingPage/ctaLeads.model";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    dbConnect();
    try {
        const { email } = await req.json();
        const ctaLead = await CtaLeads.create({ email });
        return NextResponse.json({ message: 'Email sent successfully', ctaLead }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Email not sent' }, { status: 500 });
    }
}
