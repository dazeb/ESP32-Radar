# ESP32 Radar Command

![ESP32 Radar Dashboard](https://placehold.co/1200x600/0f172a/10b981?text=ESP32+Radar+Command+Dashboard)

## Description

**ESP32 Radar Command** is a futuristic, real-time dashboard designed to track, visualize, and analyze ESP32 and IoT devices within your local network radius. 

The application simulates a hardware scanner interface that detects devices via WiFi/BLE signals, plotting them on a tactical radar view based on their Signal Strength (RSSI). It goes beyond simple monitoring by integrating **Google Gemini** to perform AI-driven security analysis on detected device signatures.

### Key Features

*   **Visual Radar Interface**: Real-time plotting of devices with distance estimation based on signal strength.
*   **Live Connection Status**: Visual indicators for Connected, Unstable, and Disconnected devices.
*   **AI Threat Analysis**: One-click integration with the Gemini API to analyze device metadata (ports, services, firmware) and generate a security assessment.
*   **Device Management**: View detailed telemetry, simulate firmware updates, and monitor battery levels.
*   **Immersive UI**: A fully responsive, dark-mode "cyberpunk" aesthetic built with Tailwind CSS.

### Tech Stack

*   **Frontend**: React, TypeScript, Tailwind CSS
*   **AI**: Google GenAI SDK (Gemini 2.5 Flash)
*   **Icons**: Lucide React
