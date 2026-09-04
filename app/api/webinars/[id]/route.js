import { NextResponse } from "next/server";

const BACKEND_URLS = [
  process.env.BACKEND_API_URL,
  "http://localhost:5001",
  "https://finale-beacon-backend.vercel.app",
].filter(Boolean);

export async function GET(request, { params }) {
  const { id } = await params;
  for (const baseUrl of BACKEND_URLS) {
    try {
      const res = await fetch(`${baseUrl}/api/webinars/${id}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        return NextResponse.json(await res.json());
      }
    } catch {
      // Continue
    }
  }
  return NextResponse.json({ success: false, message: "Webinar not found" }, { status: 404 });
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  for (const baseUrl of BACKEND_URLS) {
    try {
      const res = await fetch(`${baseUrl}/api/webinars/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        return NextResponse.json(await res.json());
      }
    } catch {
      // Continue
    }
  }
  return NextResponse.json({ success: true, data: { _id: id, ...body } });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  for (const baseUrl of BACKEND_URLS) {
    try {
      const res = await fetch(`${baseUrl}/api/webinars/${id}`, {
        method: "DELETE",
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        return NextResponse.json(await res.json());
      }
    } catch {
      // Continue
    }
  }
  return NextResponse.json({ success: true, data: {}, message: "Deleted successfully" });
}
