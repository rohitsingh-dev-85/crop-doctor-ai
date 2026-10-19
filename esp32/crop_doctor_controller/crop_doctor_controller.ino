#include <WebServer.h>
#include <WiFi.h>

const char* AP_SSID = "ESP32_WaterPump";
const char* AP_PASSWORD = "12345678";

const int SOIL_SENSOR_PIN = 34;
const int PUMP_MOSFET_GATE_PIN = 26;
const int DRY_THRESHOLD_PERCENT = 35;
const int SOIL_DRY_RAW = 4095;
const int SOIL_WET_RAW = 1500;

WebServer server(80);

bool pumpOn = false;
unsigned long pumpOffAt = 0;

void writePump(bool on) {
  pumpOn = on;
  digitalWrite(PUMP_MOSFET_GATE_PIN, on ? HIGH : LOW);
}

int readSoilRaw() {
  long total = 0;
  for (int sample = 0; sample < 10; sample++) {
    total += analogRead(SOIL_SENSOR_PIN);
    delay(2);
  }
  return static_cast<int>(total / 10);
}

int readSoilMoisture(int raw) {
  return constrain(map(raw, SOIL_DRY_RAW, SOIL_WET_RAW, 0, 100), 0, 100);
}

void handleSensor() {
  const int raw = readSoilRaw();
  const int moisture = readSoilMoisture(raw);

  String json = "{\"soilMoisture\":" + String(moisture) +
    ",\"soilRaw\":" + String(raw) +
    ",\"needsWater\":" + (moisture < DRY_THRESHOLD_PERCENT ? "true" : "false") +
    ",\"pumpOn\":" + (pumpOn ? "true" : "false") + "}";

  server.send(200, "application/json", json);
}

void handleRoot() {
  server.send(
    200,
    "text/plain",
    "ESP32 Water Pump is online\n"
    "GET  /sensor\n"
    "POST /pump\n"
  );
}

void handlePump() {
  if (!server.hasArg("plain")) {
    server.send(
      400,
      "application/json",
      "{\"error\":\"JSON body required\"}"
    );
    return;
  }

  const String body = server.arg("plain");
  const bool turnOn = body.indexOf("\"on\":true") >= 0;

  if (turnOn) {
    int duration = 15;

    const int durationStart =
      body.indexOf("\"durationSeconds\":");

    if (durationStart >= 0) {
      duration = body.substring(durationStart + 18).toInt();
    }

    duration = constrain(duration, 1, 120);

    writePump(true);
    pumpOffAt = millis() + (duration * 1000UL);
  } else {
    writePump(false);
    pumpOffAt = 0;
  }

  server.send(
    200,
    "application/json",
    String("{\"pumpOn\":") +
    (pumpOn ? "true" : "false") +
    "}"
  );
}

void setup() {
  Serial.begin(115200);

  pinMode(PUMP_MOSFET_GATE_PIN, OUTPUT);
  analogReadResolution(12);
  writePump(false);

  WiFi.mode(WIFI_AP);

  if (!WiFi.softAP(AP_SSID, AP_PASSWORD)) {
    Serial.println("Failed to start ESP32 access point");
    return;
  }

  server.on("/", HTTP_GET, handleRoot);
  server.on("/sensor", HTTP_GET, handleSensor);
  server.on("/pump", HTTP_POST, handlePump);

  server.begin();

  Serial.println();
  Serial.println("ESP32 Water Pump is online");
  Serial.print("Wi-Fi name: ");
  Serial.println(AP_SSID);
  Serial.print("ESP32 API address: http://");
  Serial.println(WiFi.softAPIP());
}

void loop() {
  server.handleClient();

  if (pumpOn && pumpOffAt != 0 && millis() >= pumpOffAt) {
    writePump(false);
    pumpOffAt = 0;
  }
}