import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Contact form endpoint — a Vercel Serverless Function, same origin as the
 * site (no CORS needed). Validates the submission server-side (never trust
 * the client) and relays it as an email via Resend, since a serverless
 * function has no persistent memory to store messages in itself.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TO_EMAIL = 'p.anshu2005@gmail.com';
const FROM_EMAIL = 'Portfolio Contact <onboarding@resend.dev>';

function validate(body: unknown) {
  const { name, email, message } = (body ?? {}) as Record<string, unknown>;
  const errors: string[] = [];

  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    errors.push('name must be a string between 2 and 100 characters');
  }
  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
    errors.push('email must be a valid email address');
  }
  if (typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 2000) {
    errors.push('message must be a string between 10 and 2000 characters');
  }

  return {
    errors,
    clean:
      errors.length === 0
        ? {
            name: (name as string).trim(),
            email: (email as string).trim().toLowerCase(),
            message: (message as string).trim(),
          }
        : null,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: { status: 405, message: `Method ${req.method} not allowed` } });
  }

  const company = (req.body as Record<string, unknown> | undefined)?.company;
  if (typeof company === 'string' && company.trim()) {
    return res.status(204).end();
  }

  const { errors, clean } = validate(req.body);
  if (errors.length || !clean) {
    return res.status(400).json({ error: { status: 400, message: 'Validation failed', details: errors } });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured');
    return res.status(500).json({ error: { status: 500, message: 'Internal server error' } });
  }

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        reply_to: clean.email,
        subject: `Portfolio contact from ${clean.name}`,
        text: `${clean.message}\n\n— ${clean.name} (${clean.email})`,
      }),
    });

    if (!resendResponse.ok) {
      console.error('Resend API error:', resendResponse.status, await resendResponse.text());
      return res.status(502).json({ error: { status: 502, message: 'Failed to send message' } });
    }

    const data = await resendResponse.json();
    return res.status(201).json({ data: { id: data.id, name: clean.name, email: clean.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: { status: 500, message: 'Internal server error' } });
  }
}
