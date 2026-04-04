import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "https://biletim.simgesoft.com";

async function handleProxy(
  request: NextRequest,
  path: string[] | undefined
): Promise<NextResponse> {
  try {
    // Build URL - if path is undefined/empty, use base URL
    const pathString = path && path.length > 0 ? path.join("/") : "";
    const url = pathString
      ? `${BACKEND_API_URL}/api/v1/${pathString}`
      : `${BACKEND_API_URL}/api/v1`;

    console.log(`[API PROXY] ${request.method} ${url}`);
    console.log(`[API PROXY] Headers:`, Object.fromEntries(request.headers.entries()));

    // Prepare request options
    const options: RequestInit = {
      method: request.method,
      headers: {
        "Accept": "application/json",
      },
    };

    // Handle body for POST, PUT, PATCH
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      const contentType = request.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        const jsonBody = await request.json();
        console.log(`[API PROXY] Request body:`, jsonBody);
        options.body = JSON.stringify(jsonBody);
        (options.headers as Record<string, string>)["Content-Type"] = "application/json";
      } else if (contentType?.includes("multipart/form-data")) {
        options.body = await request.formData();
      } else {
        options.body = await request.text();
      }
    }

    // Forward authorization header if present
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      (options.headers as Record<string, string>)["Authorization"] = authHeader;
    }

    // Forward cookies
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      (options.headers as Record<string, string>)["Cookie"] = cookieHeader;
    }

    // Make request to backend
    const response = await fetch(url, options);

    // Parse response
    let responseData: unknown;
    const responseContentType = response.headers.get("content-type");
    if (responseContentType?.includes("application/json")) {
      responseData = await response.json().catch(() => null);
    } else {
      responseData = await response.text().catch(() => null);
    }

    // Create NextResponse
    const nextResponse = NextResponse.json(responseData || {}, {
      status: response.status,
    });

    // Forward cookies from backend
    const setCookieHeaders = response.headers.getSetCookie();
    for (const setCookie of setCookieHeaders) {
      nextResponse.headers.append("Set-Cookie", setCookie);
    }

    console.log(`[API PROXY] Response: ${response.status}`, responseData);

    return nextResponse;
  } catch (error) {
    console.error("[API PROXY] Error:", error);
    return NextResponse.json(
      { message: "Proxy hatası", success: false },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await context.params;
  return handleProxy(request, path);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await context.params;
  return handleProxy(request, path);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await context.params;
  return handleProxy(request, path);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await context.params;
  return handleProxy(request, path);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await context.params;
  return handleProxy(request, path);
}
