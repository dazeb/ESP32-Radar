import { GoogleGenAI } from "@google/genai";
import { Device } from "../types";

const initGenAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeDeviceSignature = async (device: Device): Promise<string> => {
  const ai = initGenAI();
  if (!ai) return "AI Service Unavailable: Missing API Key.";

  const prompt = `
    Analyze the following metadata for an ESP32 IoT device detected on the network.
    Provide a concise technical assessment (max 3 sentences) covering:
    1. The likely real-world application of this device based on its type and name.
    2. Potential security risks given its open ports and services.
    3. An estimated power consumption profile if relevant.

    Device Data:
    - Name: ${device.name}
    - Type: ${device.type}
    - Open Ports: ${device.openPorts?.join(', ') || 'None detected'}
    - Services: ${device.services?.join(', ')}
    - Firmware: ${device.firmwareVersion}
    - Signal Strength: ${device.rssi} dBm
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "Analysis complete but no text returned.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Failed to analyze device signature due to an API error.";
  }
};
