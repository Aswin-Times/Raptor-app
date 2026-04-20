export async function getCountryFromIp(ip: string): Promise<string> {
  // Handle local development IPs
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1") {
    return "Localhost (Testing)";
  }

  try {
    // Primary API: ip-api.com
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,countryCode,status,message`);
    if (!response.ok) {
      throw new Error(`IP-API HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.status === "success" && data.country) {
      return data.country;
    }
    throw new Error(`IP-API failed: ${data.message || "Unknown error"}`);
  } catch (error) {
    console.warn("[Geolocation] Primary API failed, trying fallback...", error instanceof Error ? error.message : String(error));
    
    try {
      // Fallback API: ipinfo.io
      const fallbackResponse = await fetch(`https://ipinfo.io/${ip}/json`);
      if (!fallbackResponse.ok) {
        throw new Error(`ipinfo HTTP error: ${fallbackResponse.status}`);
      }
      
      const fallbackData = await fallbackResponse.json();
      if (fallbackData.country) {
        // ipinfo returns 2-letter country code (e.g. "US", "IN")
        return fallbackData.country; 
      }
    } catch (fallbackError) {
      console.error("[Geolocation] Fallback API also failed:", fallbackError instanceof Error ? fallbackError.message : String(fallbackError));
    }
  }

  return "Unknown Location";
}
