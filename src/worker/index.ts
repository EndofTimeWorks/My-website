// src/worker/index.ts
import { Router } from 'itty-router';
import type { Env } from './types';
import { errorResponse, corsResponse } from './utils/response';
import { spotifyRouter } from './routes/spotify';
import { healthRouter } from './routes/health';

const router = Router();

// CORS preflight
router.options('*', () => corsResponse());

// Mount route handlers
router.get('/health/*', healthRouter.handle);
router.get('/spotify/*', spotifyRouter.handle);

// 404 handler
router.all('*', () => errorResponse('Not Found', 404));

export default {
    fetch: (request: Request, env: Env, ctx: ExecutionContext) => 
        router.handle(request, env, ctx)
            .catch(error => errorResponse(error instanceof Error ? error.message : 'Internal Server Error', 500))
};
