import { GoogleGenAI } from "@google/genai";

/* 
 * Redefinição de tipos locais para garantir que a função 
 * seja autossuficiente e não dependa de caminhos relativos complexos.
 */
interface Lead {
  id: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  rating: string;
  city: string;
}

/**
 * Formats phone numbers to the pattern +55 XX XXXXX-XXXX
 */
const formatPhoneNumber = (phone: string): string => {
  if (!phone || phone.toUpperCase().includes('N/A')) return 'N/A';
  
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '');

  // If empty after cleaning or too short, return original
  if (cleaned.length < 8) return phone;

  // Handle existing country code 55 (Brazil)
  if (cleaned.startsWith('55') && (cleaned.length === 12 || cleaned.length === 13)) {
    cleaned = cleaned.substring(2);
  }

  // Standardize Brazil Mobile (11 digits: DD + 9 + XXXX + XXXX)
  if (cleaned.length === 11) {
    return `+55 ${cleaned.substring(0, 2)} ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
  }

  // Standardize Brazil Landline (10 digits: DD + XXXX + XXXX)
  if (cleaned.length === 10) {
    return `+55 ${cleaned.substring(0, 2)} ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
  }
  
  return phone;
};

/**
 * Parses a Markdown table string into an array of Lead objects.
 */
const parseMarkdownTableToLeads = (markdown: string, city: string): Lead[] => {
  const lines = markdown.split('\n');
  const leads: Lead[] = [];
  
  let headersFound = false;
  let separatorFound = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;

    if (/^\|[\s-:|]+\|$/.test(trimmed) || trimmed.includes('---')) {
      separatorFound = true;
      continue;
    }

    if (!headersFound && !separatorFound) {
      headersFound = true;
      continue;
    }

    if (headersFound && separatorFound) {
      const rawCells = trimmed.split('|');
      
      if (rawCells.length > 0 && rawCells[0].trim() === '') rawCells.shift();
      if (rawCells.length > 0 && rawCells[rawCells.length - 1].trim() === '') rawCells.pop();

      const cells = rawCells.map(c => c.trim());
      
      if (cells.length >= 3) {
        leads.push({
          id: crypto.randomUUID(),
          city: city,
          name: cells[0] || 'N/A',
          address: cells[1] || 'N/A',
          phone: formatPhoneNumber(cells[2] || 'N/A'),
          website: cells[3] || 'N/A',
          rating: cells[4] || 'N/A',
        });
      }
    }
  }
  return leads;
};

export default async function handler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const segment = searchParams.get('segment');
    const city = searchParams.get('city');

    if (!segment || !city) {
      return new Response(JSON.stringify({ error: 'Segment and City are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!process.env.API_KEY) {
       return new Response(JSON.stringify({ error: 'Server API configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      Act as an expert Data Miner and Lead Extractor.
      
      TASK: Perform an EXHAUSTIVE search for "${segment}" in the city of "${city}" using Google Maps.
      
      CRITICAL INSTRUCTIONS FOR QUANTITY:
      1. **IGNORE DEFAULT LIMITS**: Your goal is to find *every single* establishment. Do NOT stop at 5 or 10. Aim for 30+ results if they exist.
      2. **EXPAND QUERY**: Automatically include related terms in your search to find more results. (e.g., if searching "Lanchonete", also search for "Hamburgueria", "Pastelaria", "Food Truck", "Sanduiche", "Restaurante popular").
      3. **SMALL CITIES**: In small cities like "${city}", you must be extremely thorough and find literally everything available.
      
      OUTPUT FORMAT:
      Return ONLY a Markdown table. No intro. No outro.
      
      Table Columns:
      | Name | Address | Phone | Website | Rating |

      Row Rules:
      - Name: The full name.
      - Address: The specific address.
      - Phone: The contact number. **MUST** be formatted strictly as "+55 XX XXXXX-XXXX". Write "N/A" if absolutely not found.
      - Website: Social media or website. Write "N/A" if none.
      - Rating: Numeric rating (e.g., 4.5).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      }
    });

    const text = response.text || '';
    const leads = parseMarkdownTableToLeads(text, city);

    return new Response(JSON.stringify(leads), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}