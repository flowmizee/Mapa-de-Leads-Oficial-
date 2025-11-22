import { Lead } from "../types";

/**
 * Fetches leads by calling the serverless API endpoint.
 */
export const fetchLeadsForCity = async (segment: string, city: string): Promise<Lead[]> => {
  try {
    const params = new URLSearchParams({
      segment,
      city
    });

    // Calls the Vercel/Next.js serverless function
    const response = await fetch(`/api/fetchLeads?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro na requisição: ${response.statusText}`);
    }

    const leads: Lead[] = await response.json();
    return leads;

  } catch (error) {
    console.error(`Error fetching leads for ${city}:`, error);
    throw error;
  }
};