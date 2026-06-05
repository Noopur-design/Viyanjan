import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { tables = 20 } = await req.json().catch(() => ({}));
  const count = Math.min(Math.max(Number(tables), 1), 50);

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, NEXT_PUBLIC_BASE_URL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return NextResponse.json({ error: "SMTP not configured" }, { status: 500 });
  }

  const base = NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Generate QR codes as base64 PNG buffers
  const attachments: { filename: string; content: Buffer; cid: string }[] = [];
  const imgTags: string[] = [];

  for (let i = 1; i <= count; i++) {
    const url = `${base}/cart?table=${i}`;
    const buf = await QRCode.toBuffer(url, {
      width: 220,
      margin: 2,
      color: { dark: "#1d1109", light: "#fbf6ec" },
    });
    const cid = `table${i}@viyanjan`;
    attachments.push({ filename: `table-${i}.png`, content: buf, cid });
    imgTags.push(`
      <td style="padding:8px;text-align:center;vertical-align:bottom;">
        <img src="cid:${cid}" width="110" height="110" style="display:block;border-radius:8px;" />
        <div style="margin-top:6px;font-size:13px;font-weight:bold;color:#1d1109;letter-spacing:1px;">Table ${i}</div>
      </td>`);
  }

  // Build table rows of 5
  const rows: string[] = [];
  for (let r = 0; r < imgTags.length; r += 5) {
    rows.push(`<tr>${imgTags.slice(r, r + 5).join("")}</tr>`);
  }

  const html = `
  <div style="background:#140b07;padding:32px 0;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:680px;margin:0 auto;background:#fbf6ec;border-radius:16px;overflow:hidden;">
      <div style="background:#1d1109;padding:24px 32px;text-align:center;">
        <div style="color:#dcb65f;font-size:22px;letter-spacing:6px;">VIYANJAN</div>
      </div>
      <div style="padding:32px;">
        <h1 style="margin:0 0 8px;font-size:22px;color:#1d1109;font-weight:normal;">Table QR Codes</h1>
        <p style="margin:0 0 24px;color:#6b5a47;font-size:14px;">
          Scan each QR code to go directly to the ordering page for that table.
          Print and place them on your tables.
        </p>
        <table style="border-collapse:collapse;width:100%;">
          ${rows.join("")}
        </table>
        <p style="margin:28px 0 0;color:#8a7763;font-size:12px;">
          Each QR links to: <strong>${base}/cart?table=N</strong>
        </p>
      </div>
    </div>
  </div>`;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 465),
    secure: true,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: SMTP_FROM || `Viyanjan <${SMTP_USER}>`,
    to: SMTP_USER,
    subject: `Viyanjan — QR codes for ${count} tables`,
    html,
    attachments,
  });

  return NextResponse.json({ ok: true });
}
