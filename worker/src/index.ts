export interface Env {
  SCANS_KV: KVNamespace;
}

// Very small API:
//  - GET /hit -> increments counter, returns { value }
//  - GET /get -> returns { value }
//  - GET /pixel -> increments counter and returns 1x1 transparent GIF

const KEY = 'qr_scans_total';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/$/, '');

    if (pathname === '/hit') {
      const value = await increment(env);
      return json({ value });
    }
    if (pathname === '/get') {
      const value = await get(env);
      return json({ value });
    }
    if (pathname === '/pixel') {
      await increment(env);
      return pixel();
    }

    return new Response('Not found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;

async function get(env: Env): Promise<number> {
  const val = await env.SCANS_KV.get(KEY);
  return Number(val || 0);
}

async function increment(env: Env): Promise<number> {
  const current = await get(env);
  const next = current + 1;
  await env.SCANS_KV.put(KEY, String(next));
  return next;
}

function json(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'no-store',
    },
  });
}

function pixel(): Response {
  // 1x1 transparent GIF
  const gif = Uint8Array.from([
    71,73,70,56,57,97,1,0,1,0,128,0,0,0,0,0,255,255,255,33,249,4,1,0,0,1,0,44,0,0,0,0,1,0,1,0,0,2,2,68,1,0,59
  ]);
  return new Response(gif, {
    headers: {
      'content-type': 'image/gif',
      'access-control-allow-origin': '*',
      'cache-control': 'no-store',
    },
  });
}


