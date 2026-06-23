import { db } from '../db';

const PING_INTERVAL_MS = 4 * 60 * 1000; // 4 minutes — Neon drops idle connections at ~5 min

let timer: ReturnType<typeof setInterval> | null = null;

export function startDbKeepalive(): void {
  if (timer) return;
  timer = setInterval(async () => {
    try {
      await db.$queryRaw`SELECT 1`;
    } catch (err: any) {
      console.warn('[Keepalive] DB ping failed (will retry):', err.message);
    }
  }, PING_INTERVAL_MS);
  // Don't block process exit
  if (timer.unref) timer.unref();
  console.log('✓ DB keepalive started (ping every 4 min to prevent Neon idle-disconnect)');
}

export function stopDbKeepalive(): void {
  if (timer) { clearInterval(timer); timer = null; }
}
