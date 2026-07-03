import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, eventType, eventDate, guestCount, message } = body;

    // Validation
    if (!name || !email || !eventType || !eventDate) {
      return NextResponse.json({ error: "Name, email, event type, and date are required." }, { status: 400 });
    }

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    // In production, you'd integrate with an email service (Resend, SendGrid) or database here.
    // For now, log the submission and return success.
    console.log("📸 FrameFlix Inquiry Received:", {
      name,
      email,
      phone,
      eventType,
      eventDate,
      guestCount,
      message,
      receivedAt: new Date().toISOString(),
    });

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been received! We'll get back to you within 24 hours.",
      inquiryId: `FF-${Date.now()}`,
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
