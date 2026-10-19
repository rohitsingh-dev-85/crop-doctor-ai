"use client"

import { useCallback, useEffect, useState } from "react"
import { Droplets, RefreshCw, Wifi, WifiOff } from "lucide-react"
import type { AnalysisResult } from "./ai-analysis-panel"

interface SensorState {
  soilMoisture: number
  soilRaw: number
  needsWater: boolean
  pumpOn: boolean
}

interface IrrigationControlProps {
  result: AnalysisResult | null
}

export function IrrigationControl({ result }: IrrigationControlProps) {
  const [sensor, setSensor] = useState<SensorState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPumping, setIsPumping] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const readSensor = useCallback(async () => {
    try {
      const response = await fetch("/api/esp32", { cache: "no-store" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Could not read the soil sensor")
      setSensor(data)
      setError(null)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "ESP32 is offline")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    readSensor()
    const interval = window.setInterval(readSensor, 2000)
    return () => window.clearInterval(interval)
  }, [readSensor])

  const pumpRunning = isPumping || sensor?.pumpOn === true
  const canStartPump = sensor !== null && !pumpRunning

  const setPump = async (on: boolean) => {
    setIsPumping(on)
    try {
      const response = await fetch("/api/esp32", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ on, durationSeconds: 15 }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Could not control the pump")
      setSensor((current) => current ? { ...current, pumpOn: data.pumpOn ?? on } : current)
      setError(null)
      if (on) {
        window.setTimeout(() => {
          setIsPumping(false)
          readSensor()
        }, 16000)
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Pump command failed")
      setIsPumping(false)
    } finally {
      if (!on) setIsPumping(false)
    }
  }

  return (
    <section className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {sensor ? <Wifi className="h-5 w-5 text-green-600" /> : <WifiOff className="h-5 w-5 text-muted-foreground" />}
          <div>
            <h2 className="font-bold text-foreground">Smart Irrigation</h2>
            <p className="text-xs text-muted-foreground">ESP32 soil sensor and water pump</p>
          </div>
        </div>
        <button
          type="button"
          onClick={readSensor}
          disabled={isLoading}
          aria-label="Refresh soil sensor"
          className="rounded-lg p-2 text-blue-700 hover:bg-blue-100 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-white p-3">
          <p className="text-xs text-muted-foreground">Soil moisture</p>
          <p className="mt-1 text-xl font-bold">{sensor ? `${sensor.soilMoisture}%` : "--"}</p>
        </div>
        <div className="rounded-xl bg-white p-3">
          <p className="text-xs text-muted-foreground">Water needed</p>
          <p className={`mt-1 font-bold ${sensor?.needsWater ? "text-orange-600" : "text-green-600"}`}>
            {sensor ? (sensor.needsWater ? "Yes" : "No") : "--"}
          </p>
        </div>
        <div className="rounded-xl bg-white p-3">
          <p className="text-xs text-muted-foreground">Raw sensor value</p>
          <p className="mt-1 text-xl font-bold">{sensor ? sensor.soilRaw : "--"}</p>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">Sensor updates every 2 seconds</p>

      <p className="mt-3 text-xs text-muted-foreground">
        {result
          ? `AI recommendation: ${result.needsWater ? "Water needed" : "No watering request"}`
          : "Manual pump control is available when ESP32 is connected."}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setPump(true)}
          disabled={!canStartPump}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <Droplets className="h-4 w-4" />
          {pumpRunning ? "Pump running" : "Turn ON"}
        </button>
        <button
          type="button"
          onClick={() => setPump(false)}
          disabled={!sensor || !pumpRunning}
          className="rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Turn OFF
        </button>
      </div>
      {error && <p className="mt-3 text-xs font-medium text-red-600">{error}</p>}
      {!error && !sensor && (
        <p className="mt-3 text-xs text-muted-foreground">
          Connect to the ESP32 hotspot to control the pump.
        </p>
      )}
    </section>
  )
}
