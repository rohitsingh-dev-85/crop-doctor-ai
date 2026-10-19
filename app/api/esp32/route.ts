const ESP32_BASE_URL = process.env.ESP32_BASE_URL
const REQUEST_TIMEOUT_MS = 5000

function getEsp32Url(path: string) {
  if (!ESP32_BASE_URL) {
    throw new Error("ESP32_BASE_URL is not configured")
  }

  return `${ESP32_BASE_URL.replace(/\/$/, "")}${path}`
}

async function fetchEsp32(path: string, init?: RequestInit) {
  return fetch(getEsp32Url(path), {
    ...init,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  })
}

export async function GET() {
  try {
    const response = await fetchEsp32("/sensor", { cache: "no-store" })
    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return Response.json(
        { error: data?.error || "ESP32 sensor request failed" },
        { status: 502 },
      )
    }

    return Response.json(data)
  } catch (error) {
    console.error("[esp32] Sensor request failed:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "ESP32 is unreachable" },
      { status: 503 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const on = body?.on
    const durationSeconds = body?.durationSeconds

    if (typeof on !== "boolean") {
      return Response.json({ error: "The 'on' field must be boolean" }, { status: 400 })
    }

    if (on && (!Number.isInteger(durationSeconds) || durationSeconds < 1 || durationSeconds > 120)) {
      return Response.json(
        { error: "durationSeconds must be an integer between 1 and 120 when starting the pump" },
        { status: 400 },
      )
    }

    const response = await fetchEsp32("/pump", {
      method: "POST",
      body: JSON.stringify({ on, durationSeconds }),
    })
    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return Response.json(
        { error: data?.error || "ESP32 pump request failed" },
        { status: 502 },
      )
    }

    return Response.json(data)
  } catch (error) {
    console.error("[esp32] Pump request failed:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "ESP32 is unreachable" },
      { status: 503 },
    )
  }
}
