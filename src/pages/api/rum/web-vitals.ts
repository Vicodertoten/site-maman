import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../../lib/server/access';

export const prerender = false;

const ALLOWED_METRICS = new Set(['LCP', 'CLS', 'INP']);

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function sanitizePayload(raw: unknown): Array<Record<string, unknown>> {
  const list = Array.isArray(raw) ? raw : [raw];
  return list
    .filter(item => isObject(item))
    .map(item => {
      const name = String(item.name || '').toUpperCase();
      const value = Number(item.value);
      const rating = String(item.rating || '');
      const id = String(item.id || '');
      const path = String(item.path || '');
      const navigationType = String(item.navigationType || '');
      const ts = Number(item.ts) || Date.now();
      const meta = isObject(item.meta) ? item.meta : {};

      return {
        id,
        name,
        value: Number.isFinite(value) ? value : null,
        rating,
        path,
        navigationType,
        ts: new Date(ts).toISOString(),
        meta,
      };
    })
    .filter(item => ALLOWED_METRICS.has(item.name) && item.value !== null);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const metrics = sanitizePayload(body);
    if (metrics.length === 0) {
      return new Response(
        JSON.stringify({ ok: false, error: 'invalid_payload' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || '';

    let persisted = false;
    try {
      const supabase = getSupabaseAdmin();
      const rows = metrics.map(metric => ({
        metric_id: metric.id,
        metric_name: metric.name,
        metric_value: metric.value,
        rating: metric.rating,
        path: metric.path,
        navigation_type: metric.navigationType,
        measured_at: metric.ts,
        user_agent: userAgent,
        ip,
        meta: metric.meta,
      }));
      const { error } = await supabase.from('web_vitals_events').insert(rows);
      persisted = !error;
      if (error) {
        console.error('RUM web_vitals_events insert error:', error);
      }
    } catch (error) {
      // Supabase not configured in this environment: keep best-effort logs
      console.log(
        'RUM CWV fallback log',
        JSON.stringify({ metrics, userAgent, ip })
      );
      if (error instanceof Error) {
        console.warn('RUM supabase unavailable:', error.message);
      }
    }

    if (!persisted) {
      console.log(
        'RUM CWV metrics',
        JSON.stringify({ metrics, userAgent, ip })
      );
    }

    return new Response(null, {
      status: 204,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('RUM endpoint error:', error);
    return new Response(JSON.stringify({ ok: false, error: 'server_error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  }
};
