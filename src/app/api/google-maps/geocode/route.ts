import { NextRequest, NextResponse } from "next/server";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function GET(request: NextRequest) {
   const { searchParams } = new URL(request.url);
   const address = searchParams.get("address");

   if (!address) {
      return NextResponse.json(
         { error: "Address parameter is required" },
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
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
         address,
      )}&key=${GOOGLE_MAPS_API_KEY}&language=ko&region=kr&components=country:kr`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
         console.error("Google API HTTP Error:", response.status);
         return NextResponse.json(
            { error: `Google API HTTP Error: ${response.status}` },
            { status: response.status },
         );
      }

      const data = await response.json();

      if (data.status !== "OK") {
         console.error("Google API Error:", {
            status: data.status,
            error_message: data.error_message,
            address: address,
         });

         // ZERO_RESULTS인 경우 더 구체적인 주소로 재시도
         if (data.status === "ZERO_RESULTS") {
            const retryAddress = address
               .replace(/^서울특별시/, "서울")
               .replace(/^경기도/, "경기");
            if (retryAddress !== address) {
               const retryUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                  retryAddress,
               )}&key=${GOOGLE_MAPS_API_KEY}&language=ko&region=kr&components=country:kr`;

               const retryResponse = await fetch(retryUrl);
               if (retryResponse.ok) {
                  const retryData = await retryResponse.json();
                  if (retryData.status === "OK") {
                     return NextResponse.json(retryData);
                  }
               }
            }
         }
      }

      return NextResponse.json(data);
   } catch (error) {
      console.error("Geocoding API error:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 },
      );
   }
}
