import { NextRequest, NextResponse } from "next/server";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function GET(request: NextRequest) {
   const { searchParams } = new URL(request.url);
   const input = searchParams.get("input");

   if (!input) {
      return NextResponse.json(
         { error: "Input parameter is required" },
         { status: 400 },
      );
   }

   if (!GOOGLE_MAPS_API_KEY) {
      console.error("GOOGLE_MAPS_API_KEY is not configured");
      return NextResponse.json(
         { error: "API key not configured" },
         { status: 500 },
      );
   }

   try {
      const response = await fetch(
         `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            input,
         )}&key=${GOOGLE_MAPS_API_KEY}&language=ko&region=kr&types=geocode&components=country:kr&offset=5&sessiontoken=123`,
      );

      if (!response.ok) {
         console.warn("Google Places API HTTP Error:", response.status);
         return NextResponse.json(
            { error: `Google API HTTP Error: ${response.status}` },
            { status: response.status },
         );
      }

      const data = await response.json();

      if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
         console.warn("Google Places API Error:", {
            status: data.status,
            error_message: data.error_message,
            input: input,
         });
      }

      return NextResponse.json(data);
   } catch (error) {
      console.error("Places API error:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 },
      );
   }
}
