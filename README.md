# Lead Edge Function

Minimal Vercel Edge Function that receives a lead form submission 
and sends a clean notification email via Resend.

## What it does
- Accepts POST requests only
- Validates basic fields (name + email)
- Sends a plain-text email to your inbox
- Returns a simple JSON response

## Stack
- Vercel Edge Runtime
- Resend API

## Setup
1. Place the file at `api/lead.js` in a Vercel project
2. Add `RESEND_API_KEY` to the project environment variables
3. Update the `from` and `to` addresses to the verified domain and inbox
4. Point to form to `POST /api/lead`

## Notes
This is a working example, not a full production system.  
It stays intentionally small so it can be understood and modified quickly.