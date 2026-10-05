// api/lead.js
// Vercel Edge Function — keeps the response fast and the logic simple

export const config = {
  runtime: "edge",
};

export default async function handler(request) {
  // Only accept POST
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const { name, email, business, message, source } = body;

    // Basic guard
    if (!name || !email) {
      return new Response(JSON.stringify({ error: "Name and email required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build a clean internal email
    const subject = `New lead — ${business || name}`;
    const text = `
New PrismWave lead

Name:     ${name}
Email:    ${email}
Business: ${business || "—"}
Source:   ${source || "website"}

Message:
${message || "(none)"}
    `.trim();

    // Send via Resend
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PrismWave <leads@yourdomain.com>", // change to the verified domain
        to: ["you@yourdomain.com"],               // real inbox
        subject,
        text,
      }),
    });

    if (!resendRes.ok) {
      console.error("Resend error", await resendRes.text());
      return new Response(JSON.stringify({ error: "Could not send notification" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}