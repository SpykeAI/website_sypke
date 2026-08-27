import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // ElevenLabs sends the tool parameters directly in the body (or inside an arguments object)
    const args = payload.arguments || payload;
    const email = args.email;
    const name = args.name || "SpykeAI Lead";
    const startTime = args.start_time || args.date; 

    if (!email || !startTime) {
      return NextResponse.json({ 
        result: "Failed: Missing email or start_time in request." 
      }, { status: 400 });
    }

    // Call Cal.com API to create a booking
    // Event type ID is required by Cal.com. We will assume a default one, or try to fetch it.
    // Since we don't have their specific Event Type ID, we'll try to book a generic event, 
    // or return a mock success for now if we can't fetch it dynamically.
    
    const calApiKey = process.env.CALCOM_API_KEY;
    
    // First, fetch the event type ID for 'spykeai-technologies/30min'
    let eventTypeId = 12345; // Placeholder
    
    try {
      const eventTypesRes = await fetch(`https://api.cal.com/v1/event-types?apiKey=${calApiKey}`);
      const eventTypesData = await eventTypesRes.json();
      if (eventTypesData.event_types && eventTypesData.event_types.length > 0) {
        eventTypeId = eventTypesData.event_types[0].id;
      }
    } catch (e) {
      console.log("Could not fetch Cal.com event types", e);
    }

    // Now book the meeting
    const bookingRes = await fetch(`https://api.cal.com/v1/bookings?apiKey=${calApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventTypeId: eventTypeId,
        start: startTime,
        responses: {
          name: name,
          email: email,
          location: { value: "inPerson", optionValue: "" }
        },
        timeZone: "America/New_York",
        language: "en",
        title: `Demo with ${name}`,
        status: "ACCEPTED"
      })
    });

    const bookingData = await bookingRes.json();

    if (bookingRes.ok) {
      // Log the successful booking in Supabase as a placeholder conversation
      await supabase.from("conversations").insert({
        contact_name: name,
        email: email,
        summary: `AI automatically booked a meeting for ${startTime}`,
        interest_level: "Very High",
        booked_meeting: true
      });

      return NextResponse.json({ 
        result: `Successfully booked meeting for ${name} at ${startTime}. Confirmation email sent to ${email}.`
      });
    } else {
      return NextResponse.json({ 
        result: `Failed to book meeting on Cal.com. Error: ${JSON.stringify(bookingData)}`
      });
    }

  } catch (err) {
    console.error("Booking tool error:", err);
    return NextResponse.json({ result: "Internal server error during booking." });
  }
}
