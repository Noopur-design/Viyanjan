import nodemailer from "nodemailer";

/**
 * Order-confirmation email via Hostinger SMTP.
 *
 * Configure these in .env (NOT committed):
 *   SMTP_HOST=smtp.hostinger.com
 *   SMTP_PORT=465
 *   SMTP_USER=orders@yourdomain.com
 *   SMTP_PASS=your-mailbox-password
 *   SMTP_FROM="Viyanjan <orders@yourdomain.com>"   # optional, defaults to SMTP_USER
 *
 * If SMTP isn't configured, sending is skipped (the order still succeeds).
 */

type OrderItemLike = {
  nameSnapshot: string;
  quantity: number;
  unitPrice: number; // minor units (paise)
};

type OrderLike = {
  id: string;
  customerName: string;
  email: string;
  guests: number;
  tableNumber?: string | null;
  reservationDate?: Date | string | null;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  totalAmount: number; // minor units
  items: OrderItemLike[];
};

const rupees = (minor: number) => `₹${(minor / 100).toLocaleString("en-IN")}`;

function smtpConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT ?? 465);
  return {
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    from: process.env.SMTP_FROM || `Viyanjan <${SMTP_USER}>`,
  };
}

function buildHtml(order: OrderLike) {
  const rows = order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;color:#2b2118;">${i.quantity} × ${i.nameSnapshot}</td>
        <td style="padding:8px 0;text-align:right;color:#2b2118;">${rupees(
          i.unitPrice * i.quantity
        )}</td>
      </tr>`
    )
    .join("");

  const paid = order.paymentStatus === "PAID";

  return `
  <div style="background:#140b07;padding:32px 0;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:520px;margin:0 auto;background:#fbf6ec;border-radius:16px;overflow:hidden;">
      <div style="background:#1d1109;padding:28px 32px;text-align:center;">
        <div style="color:#dcb65f;font-size:22px;letter-spacing:6px;">VIYANJAN</div>
      </div>
      <div style="padding:32px;">
        <h1 style="margin:0 0 4px;font-size:24px;color:#1d1109;font-weight:normal;">Order confirmed</h1>
        <p style="margin:0 0 24px;color:#6b5a47;font-size:15px;">
          Thank you, ${order.customerName}. Your order
          <strong>#${order.id.slice(-6)}</strong> is ${order.status.toLowerCase()}.
        </p>

        <table style="width:100%;border-collapse:collapse;font-size:15px;">
          ${rows}
          <tr><td colspan="2" style="border-top:1px solid #e3d7c4;padding-top:0;"></td></tr>
          <tr>
            <td style="padding:12px 0 0;font-weight:bold;color:#1d1109;">Total</td>
            <td style="padding:12px 0 0;text-align:right;font-weight:bold;color:#b6872f;font-size:18px;">${rupees(
              order.totalAmount
            )}</td>
          </tr>
        </table>

        <table style="width:100%;margin-top:20px;font-size:14px;color:#6b5a47;">
          ${order.reservationDate ? `<tr><td style="padding:3px 0;">Date & time</td><td style="text-align:right;">${new Date(order.reservationDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</td></tr>` : ""}
          <tr><td style="padding:3px 0;">Table for</td><td style="text-align:right;">${order.guests} ${
            order.guests === 1 ? "guest" : "guests"
          }</td></tr>
          ${
            order.tableNumber
              ? `<tr><td style="padding:3px 0;">Table no.</td><td style="text-align:right;">${order.tableNumber}</td></tr>`
              : ""
          }
          <tr><td style="padding:3px 0;">Payment</td><td style="text-align:right;">${
            order.paymentMethod === "CARD" ? "Card" : "Cash at table"
          }</td></tr>
          <tr><td style="padding:3px 0;">Status</td><td style="text-align:right;">${
            paid ? "Paid" : "Pay at table"
          }</td></tr>
        </table>

        <p style="margin:28px 0 0;color:#8a7763;font-size:13px;line-height:1.6;">
          We'll have your table ready. See you soon at<br/>
          <strong style="color:#1d1109;">Viyanjan · Sector 29, Gurgaon</strong><br/>
          Tue – Sun · 5:00 pm – 11:00 pm
        </p>
      </div>
    </div>
  </div>`;
}

/** Sends the confirmation. Never throws — logs and returns false on failure. */
export async function sendOrderConfirmation(order: OrderLike): Promise<boolean> {
  if (!order.email) return false;
  const cfg = smtpConfig();
  if (!cfg) {
    console.warn("[mail] SMTP not configured — skipping confirmation email.");
    return false;
  }
  try {
    const transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: cfg.auth,
    });

    await transporter.sendMail({
      from: cfg.from,
      to: order.email,
      subject: `Your Viyanjan order #${order.id.slice(-6)} is confirmed`,
      html: buildHtml(order),
    });
    return true;
  } catch (err) {
    console.error("[mail] failed to send confirmation:", err);
    return false;
  }
}
