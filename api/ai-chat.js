import { GoogleGenAI } from '@google/genai';

const DEFAULT_BACKEND_URL = 'https://campass-coin-backend-production.up.railway.app';

const getBackendApiUrl = () => {
  let baseUrl = (process.env.BACKEND_API_URL || process.env.VITE_API_URL || DEFAULT_BACKEND_URL).trim();
  if (!/^https?:\/\//i.test(baseUrl)) baseUrl = `https://${baseUrl}`;
  baseUrl = baseUrl.replace(/\/+$/, '');
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

const json = (res, status, body) => res.status(status).json(body);

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { message: 'Method not allowed.' });
  }

  const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return json(res, 401, { message: 'Please sign in to use the AI assistant.' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json(res, 503, { message: 'Gemini is not configured. Add GEMINI_API_KEY to the server environment.' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    return json(res, 400, { message: 'The request body must be valid JSON.' });
  }
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message || message.length > 4000) {
    return json(res, 400, { message: 'Enter a question up to 4,000 characters.' });
  }

  try {
    const authResponse = await fetch(`${getBackendApiUrl()}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10000)
    });
    if (authResponse.status === 401 || authResponse.status === 403) {
      return json(res, 401, { message: 'Your session has expired. Please sign in again.' });
    }
    if (!authResponse.ok) {
      return json(res, 503, { message: 'Could not verify your session. Please try again shortly.' });
    }

    const history = Array.isArray(body.history)
      ? body.history
        .filter((item) => item && ['user', 'model'].includes(item.role) && typeof item.text === 'string')
        .slice(-12)
        .map((item) => ({
          role: item.role,
          parts: [{ text: item.text.slice(0, 4000) }]
        }))
      : [];
    const contents = [
      ...history,
      { role: 'user', parts: [{ text: message }] }
    ];
    const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
    const ai = new GoogleGenAI({ apiKey });
    let result;
    try {
      result = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: 'You are CampusCoin AI, a helpful general-purpose assistant with expertise in student budgeting and personal finance. Answer the user\'s actual question directly and thoughtfully; do not use canned replies. Match the user\'s language when possible. For financial topics, be practical, state assumptions, never invent the user\'s financial data, and clarify that you are not a licensed financial advisor. If you lack information needed for a personalized answer, ask a concise follow-up question.',
          temperature: 0.7,
          maxOutputTokens: 1200
        }
      });
    } catch (err) {
      if (err.status === 429) {
        return json(res, 429, { message: 'Gemini is busy right now. Please try again shortly.' });
      }
      return json(res, 502, { message: 'Gemini could not complete that response. Please try again.' });
    }

    const reply = result.text?.trim();
    if (!reply) return json(res, 502, { message: 'Gemini returned no text. Please try asking another way.' });

    return json(res, 200, { reply });
  } catch {
    return json(res, 502, { message: 'Could not reach Gemini. Please try again shortly.' });
  }
}