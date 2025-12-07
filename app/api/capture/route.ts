// File: app/api/capture/route.ts

import { NextRequest, NextResponse } from "next/server";

/**
 * This endpoint handles POST requests from the Chrome extension.
 * It receives a JSON payload containing captured network requests.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse the incoming JSON data from the request body.
    const data = await request.json();

    // 2. Log some basic information to the server console to verify.
    console.log("✅ --- Data received from Chrome Extension --- ✅");
    console.log(`Total Requests Captured: ${data.totalRequests}`);
    console.log(`Exported on: ${data.exportDate}`);

    // 3. Loop through the requests and log the method and URL of each one.
    if (data.requests && data.requests.length > 0) {
      console.log("--- Captured Request Details ---");
      data.requests.forEach((req: any, index: number) => {
        console.log(
          `${index + 1}: [${req.method}] ${req.url} - Status: ${req.status}`,
        );
      });
      console.log("--------------------------------");
    } else {
      console.log("Payload did not contain any requests.");
    }

    // 4. Send a success response back to the extension.
    return NextResponse.json({
      success: true,
      message: `Successfully received ${data.totalRequests || 0} requests.`,
    });
  } catch (error) {
    // If an error occurs (e.g., invalid JSON), log it and send an error response.
    console.error("Error processing request:", error);
    return NextResponse.json(
      { success: false, message: "Error processing request." },
      { status: 400 }, // Bad Request
    );
  }
}
