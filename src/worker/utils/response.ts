// src/worker/utils/response.ts
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const jsonResponse = <T>(data: T, status = 200): Response => {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
        },
    });
};

export const errorResponse = (message: string, status = 500): Response => {
    return jsonResponse({ error: message, status }, status);
};

export const corsResponse = (): Response => {
    return new Response(null, { headers: corsHeaders });
};
