// src/worker/routes/health.ts
import { Router } from 'itty-router';
import { jsonResponse } from '../utils/response';
import type { HealthCheckResponse } from '../types';

export const healthRouter = Router({ base: '/health' });

healthRouter.get('/', () => {
    const healthCheck: HealthCheckResponse = {
        status: 'healthy',
        timestamp: new Date().toISOString()
    };
    
    return jsonResponse(healthCheck);
});
