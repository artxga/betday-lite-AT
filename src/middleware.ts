import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "./auth";

const handleI18nRouting = createMiddleware(routing);

// En entornos productivos debe optarse por alternativas escalables como Redis
const rateLimitMap = new Map<string, number[]>();

const LIMIT = 60;
const WINDOW_MS = 60 * 1000;

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  // 1. Rate Limiting for API routes
  if (pathname.startsWith("/api")) {
    const now = Date.now();
    const clientRequests = rateLimitMap.get(ip) || [];

    const recentRequests = clientRequests.filter((timestamp) => now - timestamp < WINDOW_MS);

    const remaining = Math.max(0, LIMIT - recentRequests.length);
    const resetTime = recentRequests.length > 0 ? recentRequests[0] + WINDOW_MS : now + WINDOW_MS;

    if (recentRequests.length >= LIMIT) {
      return new NextResponse(
        JSON.stringify({
          error: "Too Many Requests",
          message:
            "Has superado el límite de solicitudes permitido (60 por minuto). Por favor, inténtalo de nuevo más tarde.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": LIMIT.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": Math.ceil(resetTime / 1000).toString(),
            "Retry-After": Math.ceil((resetTime - now) / 1000).toString(),
          },
        },
      );
    }

    // Record this request
    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);

    const apiResponse = NextResponse.next();
    applySecurityHeaders(apiResponse);

    apiResponse.headers.set("X-RateLimit-Limit", LIMIT.toString());
    apiResponse.headers.set("X-RateLimit-Remaining", remaining.toString());
    apiResponse.headers.set("X-RateLimit-Reset", Math.ceil(resetTime / 1000).toString());

    return apiResponse;
  }

  // 2. Handle i18n routing for non-API routes
  const response = handleI18nRouting(req);

  // 3. Apply security headers
  applySecurityHeaders(response);

  return response;
});

function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // Content Security Policy (CSP)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self';
  `
    .replace(/\s{2,}/g, " ")
    .trim();
  response.headers.set("Content-Security-Policy", cspHeader);

  // Strict-Transport-Security (HSTS)
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
