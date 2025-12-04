export enum DeviceType {
  UNKNOWN = 'Unknown',
  SENSOR = 'Sensor Node',
  CAMERA = 'ESP32-CAM',
  CONTROLLER = 'Relay Controller',
  DISPLAY = 'Display/HMI',
  WEARABLE = 'Wearable',
}

export enum ConnectionStatus {
  CONNECTED = 'Connected',
  DISCONNECTED = 'Disconnected',
  UNSTABLE = 'Unstable',
}

export interface Device {
  id: string;
  mac: string;
  name: string;
  type: DeviceType;
  rssi: number; // Signal strength in dBm (-30 to -90)
  distance: number; // Estimated distance in meters
  angle: number; // Angle in degrees relative to user (for radar viz)
  status: ConnectionStatus;
  lastSeen: number;
  ipAddress?: string;
  firmwareVersion?: string;
  openPorts?: number[];
  services?: string[];
  batteryLevel?: number; // percentage, optional
  aiAnalysis?: string; // Analysis result from Gemini
}

export interface RadarStats {
  totalDevices: number;
  onlineCount: number;
  avgSignal: number;
  threatLevel: 'Low' | 'Medium' | 'High';
}
