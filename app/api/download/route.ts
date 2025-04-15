// app/api/download/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Parse search params: ?url=...&filename=...
  const { searchParams } = new URL(request.url);
  const remoteUrl = searchParams.get("url");
  const filename = searchParams.get("filename") || "download";

  if (!remoteUrl) {
    return NextResponse.json(
      { error: "Missing 'url' query parameter" },
      { status: 400 },
    );
  }

  try {
    // Fetch the file from the remote CDN
    const remoteResponse = await fetch(remoteUrl);

    if (!remoteResponse.ok) {
      return NextResponse.json(
        { error: "Error fetching remote file" },
        { status: remoteResponse.status },
      );
    }

    // Create a new Response with appropriate download headers.
    const headers = new Headers();
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);
    headers.set(
      "Content-Type",
      remoteResponse.headers.get("Content-Type") || "application/octet-stream",
    );

    // Return the remote file body as a streamed response with our headers
    return new NextResponse(remoteResponse.body, {
      headers,
    });
  } catch (error: any) {
    console.error("Proxy download error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
