import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import OutBoundCall from "@/model/call/outBoundCall";
import { getUserFromRequest } from "@/lib/auth";
import mongoose from "mongoose";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const user = await getUserFromRequest(req);
    const { callId } = await req.json();

    if (!callId) {
      return NextResponse.json({ success: false, message: "Call ID is required" }, { status: 400 });
    }

    const userId = new mongoose.Types.ObjectId(user.userId);

    const call = await OutBoundCall.findOne({
      _id: callId,
      $or: [{ user_id: userId }, { user_id: user.userId }],
    });

    if (!call) {
      return NextResponse.json({ success: false, message: "Call not found" }, { status: 404 });
    }

    // Format details
    const callDateTime = new Date(call.started_at);
    const dateStr = callDateTime.toLocaleDateString('en-IN');
    const timeStr = callDateTime.toLocaleTimeString('en-IN');
    const agentName = call.agent_config?.agentName || "Unknown Agent";
    const fromPhone = call.phonenumber || "Unknown";
    const toPhone = call.to_phonenumber || "Unknown";

    const logoPath = path.join(process.cwd(), 'public/assets/logo.png');
    const logoData = fs.readFileSync(logoPath).toString('base64');
    const logoSrc = `data:image/png;base64,${logoData}`;
    // Build full HTML with logo + details
    const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            @font-face {
              font-family: 'NotoSans';
              src: url('file://${path.join(process.cwd(), 'public/fonts/NotoSans-Regular.ttf')}') format('truetype');
            }
            body {
              font-family: 'NotoSans', sans-serif;
              padding: 40px;
              font-size: 14px;
              line-height: 1.7;
              color: #222;
            }
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 2px solid #ccc;
              margin-bottom: 20px;
              padding-bottom: 10px;
            }
            .logo {
              height: 50px;
            }
            .title {
              text-align: center;
              font-size: 22px;
              margin-bottom: 10px;
            }
            .info {
              margin-bottom: 20px;
            }
            .info b {
              display: inline-block;
              width: 160px;
            }
            .item {
              margin-bottom: 10px;
            }
            .role {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img class="logo" src="${logoSrc}" alt="Company Logo" />
            <div>
              <div style="font-weight:bold;font-size:18px;">Call Transcript</div>
              <div style="font-size:12px;">Generated: ${new Date().toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div class="info">
            <div><b>Date:</b> ${dateStr}</div>
            <div><b>Time:</b> ${timeStr}</div>
            <div><b>Agent Name:</b> ${agentName}</div>
            <div><b>From Phone:</b> ${fromPhone}</div>
            <div><b>To Phone:</b> ${toPhone}</div>
          </div>

          <div class="title">Transcript</div>

          ${Array.isArray(call.call_transcript?.items)
        ? call.call_transcript.items
          .map((item: any) => {
            const role = item.role === 'user' ? 'User' : 'Agent';
            const content = Array.isArray(item.content)
              ? item.content.join(' ')
              : item.content;
            return `<div class="item"><span class="role">${role}:</span> ${content}</div>`;
          })
          .join('')
        : '<p>No transcript available.</p>'
      }
        </body>
      </html>
    `;

    // Puppeteer: launch browser and render
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    const callDate = callDateTime.toISOString().split("T")[0];
    const filename = `transcript_${callDate}_${call.phonenumber}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error("Download transcript error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
