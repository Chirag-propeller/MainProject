// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb";
// import OutBoundCall from "@/model/call/outBoundCall";
// import { getUserFromRequest } from "@/lib/auth";
// import mongoose from "mongoose";
// import puppeteer from "puppeteer";
// import path from "path";
// import fs from "fs";

// export async function POST(req: NextRequest) {
//   await dbConnect();

//   try {
//     const user = await getUserFromRequest(req);
//     const { callId } = await req.json();

//     if (!callId) {
//       return NextResponse.json({ success: false, message: "Call ID is required" }, { status: 400 });
//     }

//     const userId = new mongoose.Types.ObjectId(user.userId);

//     const call = await OutBoundCall.findOne({
//       _id: callId,
//       $or: [{ user_id: userId }, { user_id: user.userId }],
//     });

//     if (!call) {
//       return NextResponse.json({ success: false, message: "Call not found" }, { status: 404 });
//     }

//     // Format details
//     const callDateTime = new Date(call.started_at);
//     const dateStr = callDateTime.toLocaleDateString('en-IN');
//     const timeStr = callDateTime.toLocaleTimeString('en-IN');
//     const agentName = call.agent_config?.agentName || "Unknown Agent";
//     const fromPhone = call.phonenumber || "Unknown";
//     const toPhone = call.to_phonenumber || "Unknown";

//     const logoPath = path.join(process.cwd(), 'public/assets/logo.png');
//     const logoData = fs.readFileSync(logoPath).toString('base64');
//     const logoSrc = `data:image/png;base64,${logoData}`;
//     // Build full HTML with logo + details
//     const htmlContent = `
//       <html>
//         <head>
//           <meta charset="UTF-8">
//           <style>
//             @font-face {
//               font-family: 'NotoSans';
//               src: url('file://${path.join(process.cwd(), 'public/fonts/NotoSans-Regular.ttf')}') format('truetype');
//             }
//             body {
//               font-family: 'NotoSans', sans-serif;
//               padding: 40px;
//               font-size: 14px;
//               line-height: 1.7;
//               color: #222;
//             }
//             .header {
//               display: flex;
//               align-items: center;
//               justify-content: space-between;
//               border-bottom: 2px solid #ccc;
//               margin-bottom: 20px;
//               padding-bottom: 10px;
//             }
//             .logo {
//               height: 50px;
//             }
//             .title {
//               text-align: center;
//               font-size: 22px;
//               margin-bottom: 10px;
//             }
//             .info {
//               margin-bottom: 20px;
//             }
//             .info b {
//               display: inline-block;
//               width: 160px;
//             }
//             .item {
//               margin-bottom: 10px;
//             }
//             .role {
//               font-weight: bold;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <img class="logo" src="${logoSrc}" alt="Company Logo" />
//             <div>
//               <div style="font-weight:bold;font-size:18px;">Call Transcript</div>
//               <div style="font-size:12px;">Generated: ${new Date().toLocaleString('en-IN')}</div>
//             </div>
//           </div>

//           <div class="info">
//             <div><b>Date:</b> ${dateStr}</div>
//             <div><b>Time:</b> ${timeStr}</div>
//             <div><b>Agent Name:</b> ${agentName}</div>
//             <div><b>From Phone:</b> ${fromPhone}</div>
//             <div><b>To Phone:</b> ${toPhone}</div>
//           </div>

//           <div class="title">Transcript</div>

//           ${Array.isArray(call.call_transcript?.items)
//         ? call.call_transcript.items
//           .map((item: any) => {
//             const role = item.role === 'user' ? 'User' : 'Agent';
//             const content = Array.isArray(item.content)
//               ? item.content.join(' ')
//               : item.content;
//             return `<div class="item"><span class="role">${role}:</span> ${content}</div>`;
//           })
//           .join('')
//         : '<p>No transcript available.</p>'
//       }
//         </body>
//       </html>
//     `;

//     // Puppeteer: launch browser and render
//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: "networkidle0" });

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//     });

//     await browser.close();

//     const callDate = callDateTime.toISOString().split("T")[0];
//     const filename = `transcript_${callDate}_${call.phonenumber}.pdf`;

//     return new NextResponse(pdfBuffer, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename="${filename}"`,
//       },
//     });

//   } catch (error) {
//     console.error("Download transcript error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: error instanceof Error ? error.message : "An unknown error occurred",
//       },
//       { status: 500 }
//     );
//   }
// }

// @ts-ignore
const fontkit = require("fontkit");
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import OutBoundCall from "@/model/call/outBoundCall";
import { getUserFromRequest } from "@/lib/auth";
import mongoose from "mongoose";
import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";


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

    const callDateTime = new Date(call.started_at);
    const dateStr = callDateTime.toLocaleDateString("en-IN");
    const timeStr = callDateTime.toLocaleTimeString("en-IN");
    const agentName = call.agent_config?.agentName || "Unknown Agent";
    const fromPhone = call.phonenumber || "Unknown";
    const toPhone = call.to_phonenumber || "Unknown";

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const fontPath = path.join(process.cwd(), "public/fonts/NotoSans-Regular.ttf");
    const fontBytes = fs.readFileSync(fontPath);
    const font = await pdfDoc.embedFont(fontBytes);

    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;
    const margin = 57;
    let cursorY = height - margin;

    // Draw Logo (top-left)
    let logoDims = { width: 0, height: 0 };
    try {
      const logoPath = path.join(process.cwd(), "public/assets/logo.png");
      const logoBytes = fs.readFileSync(logoPath);
      const logoImage = await pdfDoc.embedPng(logoBytes);
      logoDims = logoImage.scale(0.125); // half of 0.25 => smaller
      page.drawImage(logoImage, {
        x: margin,
        y: cursorY - logoDims.height,
        width: logoDims.width,
        height: logoDims.height,
      });
    } catch (e) {
      console.warn("Logo load failed:", e);
    }

    // Draw "Call Transcript" and date (top-right)
    const rightTextX = width - margin - 180;
    page.drawText("Call Transcript", {
      x: rightTextX,
      y: cursorY - 10,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText(`Generated: ${new Date().toLocaleString("en-IN")}`, {
      x: rightTextX,
      y: cursorY - 30,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });

    cursorY -= logoDims.height + 30;

    // Draw horizontal line
    page.drawLine({
      start: { x: margin, y: cursorY },
      end: { x: width - margin, y: cursorY },
      thickness: 1,
      color: rgb(0.75, 0.75, 0.75),
    });

    cursorY -= 20;

    const drawText = (text: string) => {
      if (cursorY < 40) {
        page = pdfDoc.addPage();
        cursorY = height - margin;
      }
      page.drawText(text, {
        x: margin,
        y: cursorY,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      cursorY -= fontSize + 5;
    };


    const infoFields = [
      { label: "Call Date", value: dateStr },
      { label: "Call Time", value: timeStr },
      { label: "Agent Name", value: agentName },
      { label: "From Phone", value: fromPhone },
      { label: "To Phone", value: toPhone || "N/A" },
    ];

    for (const field of infoFields) {
      drawText(`${field.label}: ${field.value}`);
    }

    cursorY -= 10;
    // Draw horizontal line
    page.drawLine({
      start: { x: margin, y: cursorY },
      end: { x: width - margin, y: cursorY },
      thickness: 1,
      color: rgb(0.75, 0.75, 0.75),
    });
    cursorY -= 20;
    drawText("Transcript:");
    cursorY -= 15;

    const wrapText = (text: string, maxWidth: number, fontSize: number) => {
      const words = text.split(" ");
      const lines = [];
      let currentLine = "";

      for (let word of words) {
        const testLine = currentLine + word + " ";
        const width = font.widthOfTextAtSize(testLine, fontSize);
        if (width > maxWidth) {
          lines.push(currentLine.trim());
          currentLine = word + " ";
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine.trim());
      return lines;
    };

    if (Array.isArray(call.call_transcript?.items)) {
      let lastRole = "";
      for (const item of call.call_transcript.items) {
        const role = item.role === "user" ? "User" : "Agent";
        const content = Array.isArray(item.content)
          ? item.content.join(" ")
          : item.content;

        const textLines = wrapText(`${role}: ${content}`, width - 2 * margin, fontSize);
        
        // Extra spacing if speaker changed
        if (lastRole && role !== lastRole) {
          cursorY -= 6;
        }
        lastRole = role;

        for (const line of textLines) {
          if (cursorY < 40) {
            page = pdfDoc.addPage();
            cursorY = height - margin;
          }
          page.drawText(line, {
            x: margin,
            y: cursorY,
            size: fontSize,
            font,
            color: rgb(0.1, 0.1, 0.1),
          });
          cursorY -= fontSize + 4;
        }

        cursorY -= 4; // Space between blocks
      }
    } else {
      drawText("No transcript available.");
    }

    const pdfBytes = await pdfDoc.save();
    const callDate = callDateTime.toISOString().split("T")[0];
    const filename = `transcript_${callDate}_${call.phonenumber}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
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
